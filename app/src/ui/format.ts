import { copy } from '../content/copy'
import type { CountryCode, Provenance } from '../domain/types'

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

export function formatMoney(amount: number, country: CountryCode): string {
  return new Intl.NumberFormat(LOCALE[country], {
    style: 'currency',
    currency: CURRENCY[country],
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number, country: CountryCode = 'AR'): string {
  return new Intl.NumberFormat(LOCALE[country]).format(n)
}

/** "2026-10-26" → "26/10/2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',')
}

export type BadgeKind = 'real' | 'live' | 'simulated' | 'answer'

/** Qué badge corresponde a una procedencia: "en vivo", "real · capturado el dd/mm/aaaa" o "simulado" */
export function badgeOf(provenance: Provenance): { kind: BadgeKind; label: string } {
  if (provenance.live) return { kind: 'live', label: copy.badge.live }
  if (provenance.real) {
    return { kind: 'real', label: copy.badge.real(formatDate(provenance.capturedAt)) }
  }
  return { kind: 'simulated', label: copy.badge.simulated }
}

export function initialOf(name: string): string {
  return (name.trim()[0] ?? '?').toUpperCase()
}

/** Precio de un plan: con centavos solo si los tiene (Deli: R$ 83,90). */
export function formatPrice(amount: number, country: CountryCode): string {
  return new Intl.NumberFormat(LOCALE[country], {
    style: 'currency',
    currency: CURRENCY[country],
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}
