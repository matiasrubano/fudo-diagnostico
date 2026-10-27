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
 * Búsqueda por texto sobre un catálogo cerrado (snapshot, mock).
 * Un local entra si coincide al menos una palabra de su nombre o ciudad;
 * se ordena por relevancia y, a igualdad, el país sesgado (por IP) va primero.
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
      const name = fold(profile.fields.name.value ?? '')
      const where = fold(
        [profile.fields.address.value?.city, profile.fields.address.value?.region].join(' '),
      )
      const type = fold(profile.fields.businessType.value ?? '')
      const nameHits = tokens.filter((t) => name.includes(t)).length
      const whereHits = tokens.filter((t) => where.includes(t)).length
      const typeHits = tokens.filter((t) => type.includes(t)).length
      // El nombre y la ciudad mandan: el tipo solo ("pizzeria") no alcanza para entrar
      return {
        profile,
        score: nameHits * 3 + whereHits * 2 + typeHits,
        relevant: nameHits + whereHits > 0,
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

export function countryFromCode(code: string | null | undefined): CountryCode | null {
  const up = code?.toUpperCase()
  return up === 'AR' || up === 'MX' || up === 'CL' || up === 'CO' || up === 'BR' ? up : null
}
