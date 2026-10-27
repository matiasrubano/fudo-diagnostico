import { getCountry } from '../../config/countries'
import { copyFor } from '../../content/copy'
import { CONSULTOR_URL, guidePath, OPENING_GUIDES } from '../../domain/opening'
import { withUtm } from '../../domain/links'
import type { CountryCode } from '../../domain/types'
import { ExternalLink } from '../components/ExternalLink'
import { ScreenTitle } from '../components/ScreenTitle'

/**
 * "Estoy por abrir": una ruta propia, sin diagnóstico de ningún local (ni notas, ni plata, ni comanda).
 * Primero el Consultor de Nuevos Negocios; después la guía de trámites del país y qué datos conviene tener.
 */
export function PorAbrir({
  country,
  onOpenLocal,
}: {
  country: CountryCode
  onOpenLocal: () => void
}) {
  const c = getCountry(country)
  const v = copyFor(country).opening
  const guides = OPENING_GUIDES[country]
  return (
    <section aria-labelledby="opening-title">
      <ScreenTitle eyebrow={v.eyebrow}>{v.title}</ScreenTitle>
      <p className="mt-4 text-lg text-muted">{v.intro}</p>

      <div className="card mt-8 border-2 border-primary-500">
        <h2 className="text-2xl font-extrabold">{v.consultor.title}</h2>
        <p className="mt-2 text-body">{v.consultor.body}</p>
        <ExternalLink
          href={withUtm(CONSULTOR_URL, 'por-abrir')}
          tier="por-abrir"
          cta="consultor"
          className="btn btn-primary mt-4 w-full sm:w-auto"
        >
          {v.consultor.cta}
        </ExternalLink>
      </div>

      {guides.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-extrabold">{v.guidesTitle(c.name)}</h2>
          <p className="mt-1 text-muted">{v.guidesIntro(c.fiscal.authority)}</p>
          <ul className="mt-4 space-y-2">
            {guides.map((slug) => (
              <li key={slug}>
                <a
                  href={guidePath(slug)}
                  className="card flex min-h-touch items-center font-semibold text-blue-700 underline"
                >
                  {v.guides[slug]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-extrabold">{v.dataTitle}</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body">
          {v.data(c.fiscal.authority).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="mt-8 text-muted">{v.later}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn btn-secondary" onClick={onOpenLocal}>
          {v.openLocal}
        </button>
      </div>
    </section>
  )
}
