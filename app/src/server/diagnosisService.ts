import { diagnose, type Diagnosis } from '../domain/diagnose'
import {
  isCountryCode,
  type Answers,
  type BillingSetup,
  type BusinessType,
  type GeoBias,
  type LocalsBand,
  type PlaceSummary,
  type SalesChannel,
} from '../domain/types'
import { getGateway, type PlaceDataProvider } from '../gateway'

/** Lo que devuelve /api/places-search */
export interface SearchResponse {
  results: PlaceSummary[]
  /** locales reales de la demo para sugerir cuando no hubo resultados */
  suggestions: PlaceSummary[]
  notFound: boolean
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
export function geoBiasFromHeaders(headers: Headers): GeoBias {
  const country = headers.get('x-vercel-ip-country')?.toUpperCase()
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
  if (results.length > 0) return { results, suggestions: [], notFound: false }
  return { results: [], suggestions: (await provider.suggest?.(geoBias)) ?? [], notFound: true }
}

export async function runDiagnosis(
  placeId: string,
  answers: Answers,
  provider: PlaceDataProvider = getGateway(),
): Promise<Diagnosis> {
  const place = await provider.getDetails(placeId)
  return diagnose(place, answers)
}
