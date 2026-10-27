// Tipos compartidos entre gateway, dominio, API y UI. Sin lógica.

export const COUNTRY_CODES = ['AR', 'MX', 'CL', 'CO', 'BR'] as const
export type CountryCode = (typeof COUNTRY_CODES)[number]

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === 'string' && (COUNTRY_CODES as readonly string[]).includes(value)
}

// ─── Datos del local (esquema del snapshot, el mismo para todos los proveedores) ───

/** found = lo encontramos · not_found = no sabemos · absent = verificado que NO existe */
export type FieldStatus = 'found' | 'not_found' | 'absent'

export interface Provenance {
  source: string
  url?: string
  /** YYYY-MM-DD */
  capturedAt: string
  /** true = dato real de un local real */
  real: boolean
  /** true = consultado en vivo a la API en este request (badge "en vivo") */
  live?: boolean
  note?: string
}

export interface Field<T> {
  value: T | null
  status: FieldStatus
  provenance: Provenance
}

export interface Address {
  street: string | null
  city: string | null
  region: string | null
  postalCode: string | null
  country: CountryCode | null
}

export interface DeliveryLinks {
  pedidosya?: string | null
  rappi?: string | null
  ubereats?: string | null
  didi?: string | null
  ifood?: string | null
}

export interface PlaceFields {
  name: Field<string>
  address: Field<Address>
  businessType: Field<string>
  rating: Field<number>
  reviewCount: Field<number>
  openingHours: Field<string[]>
  website: Field<string>
  instagram: Field<{ handle: string; url: string }>
  delivery: Field<DeliveryLinks>
  locationsCount: Field<number>
  priceLevel: Field<string>
  dineIn: Field<boolean>
  takeout: Field<boolean>
  deliveryOffered: Field<boolean>
}

export type PlaceOrigin = 'snapshot' | 'places' | 'mock'

export interface PlaceProfile {
  id: string
  country: CountryCode | null
  /** perfil editorial del snapshot (pizzeria-delivery, bar, ...). Solo informativo */
  profile?: string
  capturedAt: string
  origin: PlaceOrigin
  fields: PlaceFields
  notes?: string
}

/** Lo mínimo para la lista de resultados y la pantalla "¿Es este?" */
export interface PlaceSummary {
  id: string
  name: string
  /** "Av. 9 de Julio 1253, Lanús" */
  addressLine: string
  city: string | null
  country: CountryCode | null
  businessType: string | null
  rating: number | null
  reviewCount: number | null
  /** procedencia del conjunto (para el badge) */
  provenance: Provenance
}

export interface GeoBias {
  /** país sugerido por la IP (x-vercel-ip-country). Solo sesga: el país final sale de la dirección */
  country?: CountryCode
  lat?: number
  lng?: number
}

// ─── Respuestas del dueño (las 4 preguntas) ───

export type BusinessType =
  'restaurante' | 'bar' | 'pizzeria' | 'cafeteria' | 'dark-kitchen' | 'por-abrir' | 'otro'
export type SalesChannel = 'salon' | 'mostrador' | 'apps' | 'delivery-propio'
export type BillingSetup = 'manual' | 'terminal' | 'otro-sistema'
export type LocalsBand = '1' | '2-3' | '4+'

export interface Answers {
  businessType: BusinessType
  channels: SalesChannel[]
  billing: BillingSetup
  locals: LocalsBand
}

// ─── Resultado del diagnóstico ───

export type AreaId = 'google' | 'reviews' | 'web' | 'delivery' | 'operation'
export type LeadTier = 'caliente' | 'switcher' | 'nutrir' | 'descartar' | 'por-abrir'
