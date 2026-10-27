import { getCountry } from '../../config/countries'
import { copy, copyFor } from '../../content/copy'
import type { Recommendation } from '../../domain/recommendations'
import { track } from '../../analytics/events'
import type { DiagnosisResponse } from '../../server/diagnosisService'
import { Neighbors } from '../components/Neighbors'
import { ScreenTitle } from '../components/ScreenTitle'
import { Ticket } from '../components/Ticket'
import { RouteSection } from './Routes'

function RecommendationCard({ rec, d }: { rec: Recommendation; d: DiagnosisResponse }) {
  return (
    <li className="card">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
        {copy.areas[rec.area].name} · {copy.result.actionKind[rec.action.kind]}
      </p>
      <h3 className="mt-1 text-xl font-bold leading-snug">{rec.title}</h3>
      <p className="mt-2 text-body">{rec.body}</p>
      <a
        href={rec.action.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary mt-4 w-full sm:w-auto"
        onClick={() => track('cta_click', { cta: `rec:${rec.id}`, tier: d.lead.tier })}
      >
        {rec.action.label}
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    </li>
  )
}

export function Result({
  d,
  sample = false,
  onRestart,
}: {
  d: DiagnosisResponse
  /** true = el diagnóstico de un local real con respuestas de ejemplo (vidriera de la home) */
  sample?: boolean
  onRestart: () => void
}) {
  const country = getCountry(d.country)
  return (
    <div className="space-y-10">
      {sample && (
        <div
          role="note"
          className="flex flex-col gap-3 rounded-xl bg-[#FFF1B8] p-4 text-sm font-medium text-warning-text sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{copyFor(d.country).result.sampleBanner}</p>
          <button type="button" className="btn btn-night shrink-0" onClick={onRestart}>
            {copy.proof.tryMine}
          </button>
        </div>
      )}
      {d.country === 'BR' && (
        <p role="note" className="rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-800">
          {copy.result.brBanner}
        </p>
      )}
      {d.countryAssumed && (
        <p role="note" className="rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-800">
          {copy.result.countryAssumed}
        </p>
      )}

      <section>
        <ScreenTitle eyebrow={copy.result.eyebrow}>{d.place.fields.name.value ?? ''}</ScreenTitle>
        <div className="mx-auto mt-8 max-w-[520px]">
          <Ticket d={d} sample={sample} />
        </div>
      </section>

      {d.neighbors && <Neighbors n={d.neighbors} country={d.country} />}

      <section aria-labelledby="recs-title">
        <h2 id="recs-title" className="text-2xl font-extrabold">
          {copy.result.recsTitle}
        </h2>
        <p className="mb-4 mt-1 text-muted">{copy.result.recsIntro}</p>
        <ul className="space-y-4">
          {d.recommendations.map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} d={d} />
          ))}
        </ul>
        {d.country !== 'BR' && (
          <p className="mt-4">
            <a
              href={`/blog/#${d.country.toLowerCase()}`}
              className="inline-flex min-h-touch items-center font-semibold text-blue-700 underline"
            >
              {copy.result.guidesLink(country.name)}
            </a>
          </p>
        )}
      </section>

      <RouteSection d={d} />

      <p>
        <button type="button" className="btn btn-secondary" onClick={onRestart}>
          {copy.result.restart}
        </button>
      </p>
    </div>
  )
}
