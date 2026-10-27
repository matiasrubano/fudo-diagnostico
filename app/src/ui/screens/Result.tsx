import { getCountry } from '../../config/countries'
import { copy } from '../../content/copy'
import type { Diagnosis } from '../../domain/diagnose'
import type { Recommendation } from '../../domain/recommendations'
import type { AreaScore, Grade } from '../../domain/scoring'
import type { AreaId } from '../../domain/types'
import { ASSUMPTIONS } from '../../domain/moneyLost'
import { track } from '../../analytics/events'
import { ProvenanceBadge, SimulatedBadge } from '../components/ProvenanceBadge'
import { ScreenTitle } from '../components/ScreenTitle'
import { evidenceFor } from '../evidence'
import { formatMoney, formatNumber } from '../format'
import { RouteSection } from './Routes'

const GRADE_BAR: Record<Grade, string> = {
  great: 'bg-success',
  good: 'bg-blue-500',
  fair: 'bg-[#AC8F00]',
  poor: 'bg-danger',
}

const AREA_ORDER: AreaId[] = ['google', 'reviews', 'web', 'delivery', 'operation']

function AreaRow({ area, d }: { area: AreaScore; d: Diagnosis }) {
  const text = copy.areas[area.id]
  const hasScore = area.score !== null
  const unknownCount = area.checks.filter((c) => c.status === 'unknown').length
  return (
    <li className="card !p-0">
      <details className="group">
        <summary className="flex min-h-touch cursor-pointer list-none flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 sm:w-40">
            <p className="font-display text-xl font-bold">{text.name}</p>
          </div>
          <div className="flex-1">
            {hasScore ? (
              <div className="h-3 overflow-hidden rounded-pill bg-line" aria-hidden="true">
                <div
                  className={`h-full rounded-pill ${GRADE_BAR[area.grade as Grade]}`}
                  style={{ width: `${area.score}%` }}
                />
              </div>
            ) : (
              <p className="text-sm text-muted">
                {area.applicable ? copy.result.insufficient : copy.result.notApplicable}
              </p>
            )}
          </div>
          {hasScore && (
            <p className="text-right font-semibold sm:w-44">
              {area.score}/100 · {copy.grade[area.grade as Grade]}
            </p>
          )}
          <span className="text-sm font-medium text-blue-700 underline group-open:no-underline">
            {copy.result.detail}
          </span>
        </summary>
        <div className="border-t border-line p-4">
          <p className="mb-3 text-sm text-muted">{text.help}</p>
          {unknownCount > 0 && (
            <p className="mb-3 text-sm font-medium">
              {copy.result.partial(area.checks.length - unknownCount, area.checks.length)}
            </p>
          )}
          <ul className="space-y-3">
            {area.checks.map((check) => {
              const ev = evidenceFor(check.id, d)
              return (
                <li
                  key={check.id}
                  className="flex flex-col gap-1 text-sm sm:flex-row sm:items-start sm:gap-3"
                >
                  <span className="font-semibold sm:w-44">{copy.checks[check.id]}</span>
                  <span className="flex-1 break-words">{ev.text}</span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{copy.checkStatus[check.status]}</span>
                    <ProvenanceBadge provenance={ev.provenance} />
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </details>
    </li>
  )
}

function MoneyCard({ d }: { d: Diagnosis }) {
  const m = d.money
  const t = copy.money
  const money = (n: number) => formatMoney(n, d.country)
  const a = ASSUMPTIONS
  const pct = (n: number) => `${Math.round(n * 100)}%`
  const sellsByApps = m.inputs.appShare > 0

  return (
    <section aria-labelledby="money-title" className="card border-2 border-night">
      <div className="flex flex-wrap items-center gap-2">
        <SimulatedBadge />
        <p className="eyebrow">{t.eyebrow}</p>
      </div>
      <h2 id="money-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">
        {t.title}
      </h2>
      {m.total > 0 ? (
        <>
          <p className="mt-3 text-sm text-muted">{t.approx}</p>
          <p className="font-display text-5xl font-extrabold text-ink sm:text-6xl">
            {money(m.total)}
          </p>
          <p className="mt-1 text-sm text-muted">{t.range(money(m.low), money(m.high))}</p>
        </>
      ) : (
        <p className="mt-3 text-lg">{t.zero}</p>
      )}
      <p className="mt-3 text-sm font-medium">{t.disclaimer}</p>

      <details className="mt-4 rounded-xl bg-surface p-4">
        <summary className="min-h-touch cursor-pointer font-semibold text-blue-700 underline">
          {t.how}
        </summary>
        <div className="mt-3 space-y-3 text-sm">
          <p>{t.howIntro}</p>
          <p className="font-medium">
            {t.steps.sales(
              formatNumber(m.inputs.ordersPerMonth, d.country),
              money(m.inputs.avgTicket),
              `×${m.inputs.localsFactor}`,
              money(m.inputs.monthlySales),
            )}
          </p>
          <p className="text-muted">{t.steps.volumeNote(m.inputs.volume)}</p>
          <ul className="space-y-2">
            {m.lines.map((line) => (
              <li key={line.id} className="rounded-lg bg-white p-3">
                <p className="flex flex-wrap justify-between gap-2 font-semibold">
                  <span>{t.lines[line.id].title}</span>
                  <span>{money(line.amount)}</span>
                </p>
                <p className="text-muted">= {t.lines[line.id].formula}</p>
              </li>
            ))}
          </ul>
          <p className="font-semibold">{t.assumptionsTitle}</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              {t.assumptions.orders}: {formatNumber(a.ordersPerMonth.bajo, d.country)} /{' '}
              {formatNumber(a.ordersPerMonth.medio, d.country)} /{' '}
              {formatNumber(a.ordersPerMonth.alto, d.country)}
            </li>
            <li>
              {t.assumptions.ticket}: {money(a.avgTicket[d.country])}
            </li>
            {sellsByApps && (
              <>
                <li>
                  {t.assumptions.appShare}: {pct(a.appShare)} ({t.assumptions.appShareDarkKitchen}:{' '}
                  {pct(a.appShareDarkKitchen)})
                </li>
                <li>
                  {t.assumptions.appCommission}: {pct(a.appCommission)}
                </li>
                <li>
                  {t.assumptions.redirectableShare}: {pct(a.redirectableShare)}
                </li>
              </>
            )}
            <li>
              {t.assumptions.googleGapLoss}: {pct(a.googleGapLoss)}
            </li>
            <li>
              {t.assumptions.billingManual}: {pct(a.billingLoss.manual)} ·{' '}
              {t.assumptions.billingTerminal}: {pct(a.billingLoss.terminal)}
            </li>
          </ul>
        </div>
      </details>
    </section>
  )
}

function RecommendationCard({ rec, d }: { rec: Recommendation; d: Diagnosis }) {
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

export function Result({ d, onRestart }: { d: Diagnosis; onRestart: () => void }) {
  const country = getCountry(d.country)
  const { overall, overallGrade } = d.scorecard
  return (
    <div className="space-y-10">
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
        <div className="mt-6 flex flex-wrap items-center gap-6 rounded-2xl bg-night p-6 text-white">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-blue-200">
              {copy.result.overall}
            </p>
            {overall !== null ? (
              <p className="font-display text-7xl font-extrabold leading-none">
                {overall}
                <span className="ml-1 text-xl font-semibold text-blue-200">
                  {copy.result.outOf}
                </span>
              </p>
            ) : (
              <p className="font-display text-3xl font-extrabold">{copy.result.noScore}</p>
            )}
          </div>
          {overallGrade && (
            <p className="rounded-pill bg-primary-500 px-5 py-2 font-display text-2xl font-extrabold text-ink">
              {copy.grade[overallGrade]}
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="areas-title">
        <h2 id="areas-title" className="mb-4 text-2xl font-extrabold">
          {copy.result.areasTitle}
        </h2>
        <ul className="space-y-3">
          {AREA_ORDER.map((id) => (
            <AreaRow key={id} area={d.scorecard.areas[id]} d={d} />
          ))}
        </ul>
      </section>

      <MoneyCard d={d} />

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
