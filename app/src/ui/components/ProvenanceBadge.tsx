import type { Provenance } from '../../domain/types'
import { copy } from '../../content/copy'
import { badgeOf, type BadgeKind } from '../format'

const STYLES: Record<BadgeKind, string> = {
  real: 'bg-success-bg text-success-text',
  live: 'bg-blue-100 text-blue-800',
  simulated: 'bg-[#FFF1B8] text-warning-text',
  answer: 'bg-surface text-muted',
}

/** Marca de dónde sale un dato: "real · capturado el dd/mm/aaaa", "en vivo" o "simulado". */
export function Badge({ kind, label, title }: { kind: BadgeKind; label: string; title?: string }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-0.5 text-xs font-semibold ${STYLES[kind]}`}
    >
      {label}
    </span>
  )
}

export function ProvenanceBadge({ provenance }: { provenance?: Provenance }) {
  if (!provenance) return <Badge kind="answer" label={copy.badge.answer} />
  const { kind, label } = badgeOf(provenance)
  return <Badge kind={kind} label={label} title={provenance.source} />
}

export function SimulatedBadge() {
  return <Badge kind="simulated" label={copy.badge.simulated} />
}
