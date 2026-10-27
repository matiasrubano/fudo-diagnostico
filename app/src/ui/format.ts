import { copy } from '../content/copy'
import type { Provenance } from '../domain/types'

export {
  formatDecimal,
  formatMoney,
  formatNumber,
  formatPercent,
  formatPrice,
  formatRating,
} from '../domain/numbers'

/** "2026-10-26" → "26/10/2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
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
