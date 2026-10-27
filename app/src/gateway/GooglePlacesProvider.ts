import type {
  Address,
  Field,
  GeoBias,
  PlaceProfile,
  PlaceSummary,
  Provenance,
} from '../domain/types'
import { PlaceNotFoundError, type PlaceDataProvider } from './PlaceDataProvider'
import { countryFromCode, field, notFound } from './shared'

// Google Places API (New). Field masks mínimos de docs/research/datos.md §1.2.
// El SKU lo define el campo más caro de la máscara, así que se pide solo lo que usamos.
const BASE_URL = 'https://places.googleapis.com/v1'

/** Búsqueda: SKU Text Search Pro. Pedir rating acá la subiría a Enterprise (USD 35/1.000), por eso no va. */
export const SEARCH_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.primaryType',
  'places.googleMapsUri',
].join(',')

/** Detalle: SKU Place Details Enterprise + Atmosphere (USD 25/1.000). Sin espacios: la API lo exige. */
export const DETAILS_FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'addressComponents',
  'location',
  'primaryType',
  'businessStatus',
  'googleMapsUri',
  'rating',
  'userRatingCount',
  'regularOpeningHours',
  'websiteUri',
  'priceLevel',
  'delivery',
  'takeout',
  'dineIn',
].join(',')

// ─── Forma (parcial) de las respuestas de Places que usamos ───
interface PlacesAddressComponent {
  longText?: string
  shortText?: string
  types?: string[]
}
export interface PlacesPlace {
  id: string
  displayName?: { text: string; languageCode?: string }
  formattedAddress?: string
  addressComponents?: PlacesAddressComponent[]
  primaryType?: string
  googleMapsUri?: string
  rating?: number
  userRatingCount?: number
  regularOpeningHours?: { weekdayDescriptions?: string[] }
  websiteUri?: string
  priceLevel?: string
  delivery?: boolean
  takeout?: boolean
  dineIn?: boolean
}

const PRICE_LEVELS: Record<string, string> = {
  PRICE_LEVEL_FREE: '$',
  PRICE_LEVEL_INEXPENSIVE: '$',
  PRICE_LEVEL_MODERATE: '$$',
  PRICE_LEVEL_EXPENSIVE: '$$$',
  PRICE_LEVEL_VERY_EXPENSIVE: '$$$$',
}

const TYPE_MAP: Record<string, string> = {
  pizza_restaurant: 'pizzeria',
  bar: 'bar',
  cafe: 'cafeteria',
  coffee_shop: 'cafeteria',
  hamburger_restaurant: 'hamburgueseria',
  mexican_restaurant: 'taqueria',
}

function provenanceOf(place: PlacesPlace, now: Date): Provenance {
  return {
    source: 'Google Places API (New)',
    url: place.googleMapsUri,
    capturedAt: now.toISOString().slice(0, 10),
    real: true,
    live: true,
  }
}

/** Busca por `types` (la posición del array puede cambiar, dice la doc) */
function component(place: PlacesPlace, type: string): PlacesAddressComponent | undefined {
  return place.addressComponents?.find((c) => c.types?.includes(type))
}

/** El país final del local sale de la dirección, no de la IP del visitante. */
export function parseAddress(place: PlacesPlace): Address {
  const route = component(place, 'route')?.longText
  const number = component(place, 'street_number')?.longText
  return {
    street: route
      ? [route, number].filter(Boolean).join(' ')
      : (place.formattedAddress?.split(',')[0] ?? null),
    city:
      component(place, 'locality')?.longText ??
      component(place, 'administrative_area_level_2')?.longText ??
      null,
    region: component(place, 'administrative_area_level_1')?.longText ?? null,
    postalCode: component(place, 'postal_code')?.longText ?? null,
    country: countryFromCode(component(place, 'country')?.shortText),
  }
}

/** "Ausente" en la respuesta NO es false: se marca not_found (no sabemos). */
function optional<T>(value: T | undefined, prov: Provenance, note?: string): Field<T> {
  return value === undefined
    ? field<T>(null, 'not_found', { ...prov, note })
    : field<T>(value, 'found', prov)
}

export function mapSearchResult(place: PlacesPlace, now = new Date()): PlaceSummary {
  const prov = provenanceOf(place, now)
  const parts = (place.formattedAddress ?? '').split(',').map((s) => s.trim())
  return {
    id: place.id,
    name: place.displayName?.text ?? '(sin nombre)',
    addressLine: parts.slice(0, 2).join(', '),
    city: parts[1] ?? null,
    country: null, // se resuelve con addressComponents en getDetails
    businessType: place.primaryType ? (TYPE_MAP[place.primaryType] ?? 'restaurante') : null,
    rating: null,
    reviewCount: null,
    provenance: prov,
  }
}

export function mapDetails(place: PlacesPlace, now = new Date()): PlaceProfile {
  const prov = provenanceOf(place, now)
  const address = parseAddress(place)
  const noSource = { ...prov, source: 'Places no informa esta fuente', url: undefined, live: false }
  const profile: PlaceProfile = {
    id: place.id,
    country: address.country,
    capturedAt: prov.capturedAt,
    origin: 'places',
    fields: {
      name: optional(place.displayName?.text, prov),
      address: field(address, 'found', prov),
      businessType: optional(
        place.primaryType ? (TYPE_MAP[place.primaryType] ?? 'restaurante') : undefined,
        prov,
      ),
      rating: optional(place.rating, prov, 'Sin rating: el local puede no tener reseñas'),
      reviewCount: optional(place.userRatingCount, prov),
      openingHours: optional(place.regularOpeningHours?.weekdayDescriptions, prov),
      // Un websiteUri ausente en la ficha sí significa "no tiene web cargada" (como en el snapshot)
      website: place.websiteUri
        ? field(place.websiteUri, 'found', prov)
        : field<string>(null, 'absent', { ...prov, note: 'La ficha de Google no tiene sitio web' }),
      instagram: notFound(noSource),
      delivery: notFound(noSource),
      locationsCount: notFound(noSource),
      priceLevel: optional(place.priceLevel ? PRICE_LEVELS[place.priceLevel] : undefined, prov),
      dineIn: optional(place.dineIn, prov),
      takeout: optional(place.takeout, prov),
      deliveryOffered: optional(place.delivery, prov),
    },
  }
  return profile
}

export interface GooglePlacesOptions {
  apiKey: string
  /** inyectable para tests */
  fetchImpl?: typeof fetch
  now?: () => Date
}

export class GooglePlacesProvider implements PlaceDataProvider {
  private readonly fetchImpl: typeof fetch
  private readonly now: () => Date

  constructor(private readonly options: GooglePlacesOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch
    this.now = options.now ?? (() => new Date())
  }

  private async call<T>(url: string, init: RequestInit, mask: string): Promise<T> {
    const response = await this.fetchImpl(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.options.apiKey,
        'X-Goog-FieldMask': mask,
      },
    })
    if (response.status === 404) throw new PlaceNotFoundError(url.split('/').pop() ?? '')
    if (!response.ok) {
      // No logueamos headers ni la key: solo el status
      throw new Error(`Google Places respondió ${response.status}`)
    }
    return (await response.json()) as T
  }

  async search(query: string, geoBias?: GeoBias): Promise<PlaceSummary[]> {
    const body: Record<string, unknown> = {
      textQuery: query,
      languageCode: geoBias?.country === 'BR' ? 'pt-BR' : 'es-419',
      pageSize: 5,
    }
    if (geoBias?.country) body.regionCode = geoBias.country
    if (geoBias?.lat !== undefined && geoBias.lng !== undefined) {
      body.locationBias = {
        circle: { center: { latitude: geoBias.lat, longitude: geoBias.lng }, radius: 20000.0 },
      }
    }
    const data = await this.call<{ places?: PlacesPlace[] }>(
      `${BASE_URL}/places:searchText`,
      { method: 'POST', body: JSON.stringify(body) },
      SEARCH_FIELD_MASK,
    )
    const now = this.now()
    return (data.places ?? []).map((p) => mapSearchResult(p, now))
  }

  async getDetails(id: string): Promise<PlaceProfile> {
    const place = await this.call<PlacesPlace>(
      `${BASE_URL}/places/${encodeURIComponent(id)}?languageCode=es-419`,
      { method: 'GET' },
      DETAILS_FIELD_MASK,
    )
    return mapDetails(place, this.now())
  }
}
