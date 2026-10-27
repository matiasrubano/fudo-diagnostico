import { track } from '../../analytics/events'

/** Enlace que abre en pestaña nueva y registra el clic (cta + tier) en el panel de eventos. */
export function ExternalLink({
  href,
  tier,
  cta,
  className,
  children,
}: {
  href: string
  tier: string
  cta: string
  className: string
  children: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track('cta_click', { cta, tier })}
    >
      {children}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  )
}
