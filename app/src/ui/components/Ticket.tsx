import { copy, copyFor } from '../../content/copy'
import type { Diagnosis } from '../../domain/diagnose'
import { ASSUMPTIONS } from '../../domain/moneyLost'
import type { AreaScore, Grade } from '../../domain/scoring'
import type { AreaId } from '../../domain/types'
import { evidenceFor, rowSummary } from '../evidence'
import { formatMoney, formatNumber } from '../format'
import { ProvenanceBadge, SimulatedBadge } from './ProvenanceBadge'

const AREA_ORDER: AreaId[] = ['google', 'reviews', 'web', 'delivery', 'operation']

const GRADE_TEXT: Record<Grade, string> = {
  great: 'text-success-text',
  good: 'text-blue-700',
  fair: 'text-warning-text',
  poor: 'text-danger',
}

function Row({ area, d, sample }: { area: AreaScore; d: Diagnosis; sample: boolean }) {
  const v = copyFor(d.country)
  const hasScore = area.score !== null
  const unknownCount = area.checks.filter((c) => c.status === 'unknown').length
  const simulatedRow = sample && area.id === 'operation'
  return (
    <li className="ticket-rule">
      <details className="group">
        <summary className="flex min-h-touch cursor-pointer items-start justify-between gap-3 py-3">
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold leading-snug">
              {v.ticket.areaQuestion[area.id]}
            </span>
            <span className="mt-0.5 block break-words text-xs uppercase tracking-wide text-muted">
              {copy.areas[area.id].name} · {rowSummary(area.id, d)}
            </span>
            <span className="mt-1 block text-xs font-semibold text-blue-700 underline group-open:no-underline">
              <span className="group-open:hidden">{copy.ticket.detail}</span>
              <span className="hidden group-open:inline">{copy.ticket.hideDetail}</span>
            </span>
          </span>
          <span className="shrink-0 text-right">
            {hasScore ? (
              <>
                <span className="ticket-num block text-3xl leading-none">
                  {area.score}
                  <span className="text-xs font-medium text-muted">{copy.ticket.outOf}</span>
                </span>
                <span
                  className={`mt-1 block text-xs font-bold uppercase ${GRADE_TEXT[area.grade as Grade]}`}
                >
                  {copy.grade[area.grade as Grade]}
                </span>
              </>
            ) : (
              <>
                <span className="ticket-num block text-3xl leading-none text-muted">—</span>
                <span className="mt-1 block max-w-[112px] text-xs text-muted">
                  {area.applicable ? copy.result.insufficient : v.result.notApplicable}
                </span>
              </>
            )}
            {simulatedRow && (
              <span className="mt-1 block">
                <SimulatedBadge />
              </span>
            )}
          </span>
        </summary>
        <div className="pb-3">
          <p className="mb-2 text-xs text-muted">{copy.areas[area.id].help}</p>
          {unknownCount > 0 && (
            <p className="mb-2 text-xs font-medium">
              {copy.result.partial(area.checks.length - unknownCount, area.checks.length)}
            </p>
          )}
          <ul className="space-y-2">
            {area.checks.map((check) => {
              const ev = evidenceFor(check.id, d)
              return (
                <li key={check.id} className="text-[13px]">
                  <span className="font-semibold">{copy.checks[check.id]}</span>
                  <span className="text-muted"> — </span>
                  <span className="break-words">{ev.text}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase">
                      {copy.checkStatus[check.status]}
                    </span>
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

function MoneyBlock({ d, sample }: { d: Diagnosis; sample: boolean }) {
  const m = d.money
  const t = copy.money
  const v = copyFor(d.country)
  const money = (n: number) => formatMoney(n, d.country)
  const a = ASSUMPTIONS
  const pct = (n: number) => `${Math.round(n * 100)}%`
  const sellsByApps = m.inputs.appShare > 0

  return (
    <section aria-labelledby="money-title" className="ticket-rule pt-4">
      <h3
        id="money-title"
        className="flex flex-wrap items-center gap-2 font-mono text-[15px] font-bold leading-snug"
      >
        {copy.ticket.money}
        <SimulatedBadge />
      </h3>
      {m.total > 0 ? (
        <>
          <p className="mt-2 text-xs text-muted">{copy.ticket.moneyApprox}</p>
          <p className="ticket-num break-words text-[34px] leading-tight text-ticket-stamp sm:text-[40px]">
            {money(m.total)}
          </p>
          <p className="mt-1 text-xs text-muted">
            {copy.ticket.moneyRange(money(m.low), money(m.high))}
          </p>
        </>
      ) : (
        <p className="mt-2 font-medium">{copy.ticket.moneyZero}</p>
      )}
      <p className="mt-3 text-xs font-medium">{copy.ticket.moneyDisclaimer}</p>
      {sample && <p className="mt-1 text-xs text-muted">{copy.ticket.sampleMoney}</p>}

      <details className="mt-3 border-2 border-dashed border-ticket-rule p-3">
        <summary className="min-h-touch cursor-pointer text-[14px] font-semibold text-blue-700 underline">
          {t.how}
        </summary>
        <div className="mt-3 space-y-3 text-[13px]">
          <p>{v.money.howIntro}</p>
          <p className="font-semibold">
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
              <li key={line.id} className="ticket-rule pt-2">
                <p className="flex flex-wrap justify-between gap-2 font-semibold">
                  <span>{t.lines[line.id].title}</span>
                  <span className="ticket-num">{money(line.amount)}</span>
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

/**
 * El resultado como una comanda de cocina: papel de ticket con borde dentado, números en tipografía de ancho fijo,
 * un renglón por área (con su puntaje) y al pie el total que se escapa por mes.
 * `sample` = es el ticket de ejemplo de la home: las respuestas operativas son simuladas y se marcan como tales.
 */
export function Ticket({ d, sample = false }: { d: Diagnosis; sample?: boolean }) {
  const f = d.place.fields
  const address = [f.address.value?.street, f.address.value?.city].filter(Boolean).join(', ')
  const { overall, overallGrade } = d.scorecard
  return (
    <div className="ticket-wrap">
      <article className="ticket" aria-labelledby="ticket-title">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
            {copy.ticket.header}
          </p>
          <h2
            id="ticket-title"
            className="mt-2 break-words font-mono text-xl font-bold leading-tight"
          >
            {f.name.value}
          </h2>
          {address && <p className="mt-1 break-words text-xs text-muted">{address}</p>}
          <p className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <ProvenanceBadge provenance={f.name.provenance} />
          </p>
        </header>

        <ul className="mt-4">
          {AREA_ORDER.map((id) => (
            <Row key={id} area={d.scorecard.areas[id]} d={d} sample={sample} />
          ))}
        </ul>

        <div className="ticket-rule flex items-end justify-between gap-3 py-3">
          <p className="text-[15px] font-bold uppercase">{copy.ticket.overall}</p>
          {overall !== null ? (
            <p className="text-right">
              <span className="ticket-num text-3xl leading-none">{overall}</span>
              <span className="text-xs font-medium text-muted">{copy.ticket.outOf}</span>
              {overallGrade && (
                <span
                  className={`mt-1 block text-xs font-bold uppercase ${GRADE_TEXT[overallGrade]}`}
                >
                  {copy.grade[overallGrade]}
                </span>
              )}
            </p>
          ) : (
            <p className="font-semibold">{copy.result.noScore}</p>
          )}
        </div>

        <MoneyBlock d={d} sample={sample} />

        <p className="ticket-rule mt-5 pt-3 text-center text-xs uppercase tracking-[0.2em] text-muted">
          * * * {copy.ticket.footer} * * *
        </p>
      </article>
    </div>
  )
}
