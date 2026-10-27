import { diagnose, type Diagnosis } from '../domain/diagnose.js'
import { compareWithNeighbors, type NeighborComparison } from '../domain/neighbors.js'
import { FEATURED_PLACE, sampleAnswersFor, type LandingCountry } from '../domain/showcase.js'
import {
  isCountryCode,
  type Answers,
  type BillingSetup,
  type BusinessType,
  type CountryCode,
  type GeoBias,
  type LocalsBand,
  type PlaceSummary,
  type SalesChannel,
} from '../domain/types.js'
import { getGateway, type PlaceDataProvider } from '../gateway/index.js'
import { summaryOf } from '../gateway/shared.js'

/** Lo que devuelve /api/places-search */
export interface SearchResponse {
  results: PlaceSummary[]
  /** locales reales de la demo para sugerir cuando no hubo resultados */
  suggestions: PlaceSummary[]
  notFound: boolean
  /** país con el que se ordenaron las sugerencias (el de la ciudad que nombra la búsqueda, o el detectado); null = ninguno */
  priorityCountry: CountryCode | null
  /** true = la búsqueda nombra una ciudad: las sugerencias son solo de ese país */
  onlyPriority: boolean
}

const BUSINESS_TYPES: BusinessType[] = [
  'restaurante',
  'bar',
  'pizzeria',
  'cafeteria',
  'dark-kitchen',
  'por-abrir',
  'otro',
]
const CHANNELS: SalesChannel[] = ['salon', 'mostrador', 'apps', 'delivery-propio']
const BILLING: BillingSetup[] = ['manual', 'terminal', 'otro-sistema']
const LOCALS: LocalsBand[] = ['1', '2-3', '4+']

/** Valida el body de /api/diagnose; devuelve null si algo no cuadra. */
export function parseAnswers(input: unknown): Answers | null {
  if (typeof input !== 'object' || input === null) return null
  const a = input as Record<string, unknown>
  const channels = Array.isArray(a.channels) ? a.channels : null
  if (
    !BUSINESS_TYPES.includes(a.businessType as BusinessType) ||
    !channels ||
    !channels.every((c) => CHANNELS.includes(c as SalesChannel)) ||
    !BILLING.includes(a.billing as BillingSetup) ||
    !LOCALS.includes(a.locals as LocalsBand)
  ) {
    return null
  }
  return {
    businessType: a.businessType as BusinessType,
    channels: channels as SalesChannel[],
    billing: a.billing as BillingSetup,
    locals: a.locals as LocalsBand,
  }
}

/** La IP solo sesga la búsqueda: el país del local sale de su dirección. */
export function geoBiasFromHeaders(headers: Headers, override?: string | null): GeoBias {
  // `override` = el país de la landing desde la que se busca (o ?country= para probar): gana sobre la IP
  const forced = override?.toUpperCase()
  const country = isCountryCode(forced) ? forced : headers.get('x-vercel-ip-country')?.toUpperCase()
  const lat = Number(headers.get('x-vercel-ip-latitude'))
  const lng = Number(headers.get('x-vercel-ip-longitude'))
  return {
    country: isCountryCode(country) ? country : undefined,
    lat: Number.isFinite(lat) && headers.get('x-vercel-ip-latitude') ? lat : undefined,
    lng: Number.isFinite(lng) && headers.get('x-vercel-ip-longitude') ? lng : undefined,
  }
}

export async function searchPlaces(
  query: string,
  geoBias: GeoBias,
  provider: PlaceDataProvider = getGateway(),
): Promise<SearchResponse> {
  const results = await provider.search(query, geoBias)
  if (results.length > 0) {
    return { results, suggestions: [], notFound: false, priorityCountry: null, onlyPriority: false }
  }
  const plan = (await provider.suggestFor?.(query, geoBias)) ?? {
    suggestions: (await provider.suggest?.(geoBias)) ?? [],
    priority: null,
    restricted: false,
  }
  return {
    results: [],
    suggestions: plan.suggestions,
    notFound: true,
    priorityCountry: plan.priority,
    onlyPriority: plan.restricted,
  }
}

/** Lo que devuelve /api/diagnose: el diagnóstico + la comparación con otros locales reales de la demo */
export type DiagnosisResponse = Diagnosis & { neighbors: NeighborComparison | null }

export async function runDiagnosis(
  placeId: string,
  answers: Answers,
  provider: PlaceDataProvider = getGateway(),
): Promise<DiagnosisResponse> {
  const place = await provider.getDetails(placeId)
  const catalog = (await provider.suggest?.()) ?? []
  return {
    ...diagnose(place, answers),
    neighbors: compareWithNeighbors(summaryOf(place), catalog),
  }
}

/** Diagnóstico de un local real con las respuestas de ejemplo (SIMULADAS): "Ver su diagnóstico completo" */
export async function runSampleDiagnosis(
  placeId: string,
  provider: PlaceDataProvider = getGateway(),
): Promise<DiagnosisResponse> {
  const place = await provider.getDetails(placeId)
  return runDiagnosis(placeId, sampleAnswersFor(place), provider)
}

/** Lo que devuelve /api/showcase: el ticket de ejemplo y los locales reales de la demo (de un país o de todos) */
export interface ShowcaseResponse {
  country: LandingCountry | null
  /** diagnóstico del local destacado con respuestas de ejemplo (SIMULADAS); null si el catálogo no lo tiene */
  featured: DiagnosisResponse | null
  places: PlaceSummary[]
}

export async function buildShowcase(
  country: LandingCountry | null,
  provider: PlaceDataProvider = getGateway(),
): Promise<ShowcaseResponse> {
  const all = (await provider.suggest?.()) ?? []
  const places = (country ? all.filter((p) => p.country === country) : all).sort(
    (a, b) =>
      (a.country ?? '').localeCompare(b.country ?? '') ||
      (b.reviewCount ?? -1) - (a.reviewCount ?? -1),
  )
  const featuredId = FEATURED_PLACE[country ?? 'AR']
  const id = places.some((p) => p.id === featuredId) ? featuredId : places[0]?.id
  if (!id) return { country, featured: null, places }
  return { country, featured: await runSampleDiagnosis(id, provider), places }
}
