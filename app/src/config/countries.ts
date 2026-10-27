import raw from './countries.json' with { type: 'json' }
import type { CountryCode } from '../domain/types.js'

// Forma de countries.json (generado en la investigación G1, con fuente y fecha por dato)
export interface FudoPlan {
  name: string
  priceMonthly: number
  currency: string
  source: string
  capturedAt: string
}

export interface CountryConfig {
  code: CountryCode
  name: string
  /** idioma del país según countries.json (BR sigue en español en la demo, pero formatea en pt-BR) */
  language: string
  currency: { code: string; symbol: string }
  fiscal: { authority: string; system: string; url: string }
  deliveryApps: { name: string; url: string }[]
  fudoPlans: FudoPlan[]
  fudoSignupUrl: string
  fudoSiteUrl: string
  /** Nombre del producto en ese país: "Fudo", o "Deli" en Brasil */
  productName: string
}

export const COUNTRIES = raw as unknown as Record<CountryCode, CountryConfig>

export function getCountry(code: CountryCode): CountryConfig {
  return COUNTRIES[code]
}
