import type { CountryCode } from './types.js'

// Formato de números por país: separador de miles y de decimales de cada lugar
// (AR/CL/CO/BR: 1.600 y 4,4 · MX: 1,600 y 4.4). Funciones puras, también las usa el servidor.

const LOCALE: Record<CountryCode, string> = {
  AR: 'es-AR',
  MX: 'es-MX',
  CL: 'es-CL',
  CO: 'es-CO',
  BR: 'pt-BR',
}

const CURRENCY: Record<CountryCode, string> = {
  AR: 'ARS',
  MX: 'MXN',
  CL: 'CLP',
  CO: 'COP',
  BR: 'BRL',
}

export function localeOf(country: CountryCode): string {
  return LOCALE[country]
}

/** 1600 → "1.600" (AR, CL, CO, BR) o "1,600" (MX). Siempre con separador: es-CO/es-CL no lo ponen en 4 cifras. */
export function formatNumber(n: number, country: CountryCode = 'AR'): string {
  return new Intl.NumberFormat(LOCALE[country], { useGrouping: 'always' }).format(n)
}

/** Rating de Google con un decimal, con el separador del país: "4,4" o "4.4" (MX). */
export function formatRating(rating: number, country: CountryCode = 'AR'): string {
  return new Intl.NumberFormat(LOCALE[country], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating)
}

export function formatMoney(amount: number, country: CountryCode): string {
  return new Intl.NumberFormat(LOCALE[country], {
    style: 'currency',
    currency: CURRENCY[country],
    maximumFractionDigits: 0,
    useGrouping: 'always',
  }).format(amount)
}

/** Precio de un plan: con centavos solo si los tiene (Deli: R$ 83,90). */
export function formatPrice(amount: number, country: CountryCode): string {
  return new Intl.NumberFormat(LOCALE[country], {
    style: 'currency',
    currency: CURRENCY[country],
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    useGrouping: 'always',
  }).format(amount)
}

/** 2.5 → "2,5" (o "2.5" en MX): hasta un decimal */
export function formatDecimal(n: number, country: CountryCode = 'AR'): string {
  return new Intl.NumberFormat(LOCALE[country], { maximumFractionDigits: 1 }).format(n)
}

/** Porcentaje sin redondear de más: 0.015 → "1,5%" (0.35 → "35%"). */
export function formatPercent(fraction: number, country: CountryCode = 'AR'): string {
  return new Intl.NumberFormat(LOCALE[country], {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(fraction)
}
