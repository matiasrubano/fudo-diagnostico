import type {
  Address,
  CountryCode,
  Field,
  GeoBias,
  PlaceProfile,
  PlaceSummary,
  Provenance,
} from '../domain/types.js'

const STOPWORDS = new Set(['de', 'la', 'el', 'los', 'las', 'del', 'y', 'en', 'lo', 'un', 'una'])

/** minúsculas y sin tildes: "Pizzería" -> "pizzeria" */
export function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function queryTokens(query: string): string[] {
  return fold(query)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t))
}

/** Palabras de un texto, sin tildes ni mayúsculas: "Ciudad de México" -> ["ciudad", "de", "mexico"] */
function wordsOf(text: string | null | undefined): string[] {
  return fold(text ?? '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

/** Un término de la búsqueda coincide si es el comienzo de alguna palabra ("pizza" -> "pizzaria"). */
const matches = (token: string, words: string[]) => words.some((w) => w.startsWith(token))

export function addressLine(address: Address | null): string {
  if (!address) return ''
  return [address.street, address.city].filter(Boolean).join(', ')
}

export function field<T>(
  value: T | null,
  status: Field<T>['status'],
  provenance: Provenance,
): Field<T> {
  return { value, status, provenance }
}

/** Campo que no pudimos obtener (no sabemos): status not_found */
export function notFound<T>(provenance: Provenance): Field<T> {
  return { value: null, status: 'not_found', provenance }
}

export function summaryOf(profile: PlaceProfile): PlaceSummary {
  const { fields } = profile
  return {
    id: profile.id,
    name: fields.name.value ?? '(sin nombre)',
    addressLine: addressLine(fields.address.value),
    city: fields.address.value?.city ?? null,
    country: profile.country,
    businessType: fields.businessType.value,
    rating: fields.rating.value,
    reviewCount: fields.reviewCount.value,
    provenance: fields.name.provenance,
  }
}

/**
 * Búsqueda por texto sobre un catálogo cerrado (snapshot, mock). HONESTA: un local solo se ofrece
 * ("¿Es este?") si coincide de verdad. Cada palabra significativa de la búsqueda tiene que estar en el
 * nombre, en la ciudad o en el tipo de negocio ("pizzería"), y al menos una en el nombre o la ciudad.
 * Si falta una sola ("Café Lumbre" -> no hay "Lumbre"), no hay coincidencia: se prefiere decir
 * "no encontramos" antes que mostrar otro local como si fuera el del dueño.
 * Se ordena por relevancia y, a igualdad, el país sesgado (por IP o landing) va primero.
 */
export function searchCatalog(
  catalog: PlaceProfile[],
  query: string,
  geoBias?: GeoBias,
): PlaceSummary[] {
  const tokens = queryTokens(query)
  if (tokens.length === 0) return []
  const scored = catalog
    .map((profile) => {
      const name = wordsOf(profile.fields.name.value)
      const where = wordsOf(
        [profile.fields.address.value?.city, profile.fields.address.value?.region].join(' '),
      )
      const type = wordsOf(profile.fields.businessType.value)
      const nameHits = tokens.filter((t) => matches(t, name)).length
      const whereHits = tokens.filter((t) => matches(t, where)).length
      const typeHits = tokens.filter((t) => matches(t, type)).length
      const everyTokenFound = tokens.every(
        (t) => matches(t, name) || matches(t, where) || matches(t, type),
      )
      return {
        profile,
        score: nameHits * 3 + whereHits * 2 + typeHits,
        relevant: everyTokenFound && nameHits + whereHits > 0,
      }
    })
    .filter((s) => s.relevant)
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      Number(b.profile.country === geoBias?.country) -
        Number(a.profile.country === geoBias?.country),
  )
  return scored.map((s) => summaryOf(s.profile))
}

/** Todos los locales del catálogo, con el país sesgado primero. */
export function suggestFromCatalog(catalog: PlaceProfile[], geoBias?: GeoBias): PlaceSummary[] {
  return [...catalog]
    .sort(
      (a, b) =>
        Number(b.country === geoBias?.country) - Number(a.country === geoBias?.country) ||
        (a.fields.name.value ?? '').localeCompare(b.fields.name.value ?? ''),
    )
    .map(summaryOf)
}

/** Palabras de ciudad/región que no identifican un lugar ("Ciudad Autónoma de Buenos Aires") */
const GENERIC_PLACE_WORDS = new Set(['ciudad', 'autonoma', 'metropolitana', 'region', 'distrito'])

/** Países del catálogo cuyas ciudades o regiones nombra la búsqueda ("Lanús" -> AR). */
export function countriesNamedInQuery(catalog: PlaceProfile[], query: string): CountryCode[] {
  const tokens = queryTokens(query).filter((t) => t.length >= 4 && !GENERIC_PLACE_WORDS.has(t))
  const named = new Set<CountryCode>()
  for (const profile of catalog) {
    if (!profile.country) continue
    const where = wordsOf(
      [profile.fields.address.value?.city, profile.fields.address.value?.region].join(' '),
    )
    if (tokens.some((t) => where.includes(t))) named.add(profile.country)
  }
  return [...named]
}

/** Qué sugerir cuando una búsqueda no encuentra nada, y con qué país primero. */
export interface SuggestionPlan {
  suggestions: PlaceSummary[]
  /** país con el que se ordenó: el de la ciudad que nombra la búsqueda, o el detectado (IP o landing) */
  priority: CountryCode | null
  /** true = la búsqueda nombra una ciudad: las sugerencias son solo de ese país (nunca se mezclan países) */
  restricted: boolean
}

/**
 * Sugerencias para el estado "No encontramos «X»".
 *  1. Si la búsqueda nombra una ciudad del catálogo ("Pizzería Don Rubén Lanús"), solo los locales de ese país.
 *  2. Si no, todos, con el país detectado primero.
 */
export function planSuggestions(
  catalog: PlaceProfile[],
  query: string,
  geoBias?: GeoBias,
): SuggestionPlan {
  const named = countriesNamedInQuery(catalog, query)
  if (named.length > 0) {
    const only = catalog.filter((p) => p.country && named.includes(p.country))
    return {
      suggestions: suggestFromCatalog(only, { country: named[0] }),
      priority: named[0] ?? null,
      restricted: true,
    }
  }
  const suggestions = suggestFromCatalog(catalog, geoBias)
  const priority =
    geoBias?.country && suggestions[0]?.country === geoBias.country ? geoBias.country : null
  return { suggestions, priority, restricted: false }
}

export function countryFromCode(code: string | null | undefined): CountryCode | null {
  const up = code?.toUpperCase()
  return up === 'AR' || up === 'MX' || up === 'CL' || up === 'CO' || up === 'BR' ? up : null
}
