import { useState } from 'react'
import { getCountry } from '../../config/countries'
import { copy, copyFor } from '../../content/copy'
import type { Answers, CountryCode, SalesChannel } from '../../domain/types'
import { ScreenTitle } from '../components/ScreenTitle'
import { NO_CLICKS, useSettled } from '../useSettled'

export const TOTAL_QUESTIONS = 4

type Option<V extends string> = { value: V; label: string }

function entries<V extends string>(options: Record<V, string>): Option<V>[] {
  return (Object.keys(options) as V[]).map((value) => ({ value, label: options[value] }))
}

function Progress({ step }: { step: number }) {
  const n = step + 1
  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-semibold text-muted">
        {copy.questions.progress(n, TOTAL_QUESTIONS)}
      </p>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_QUESTIONS}
        aria-valuenow={n}
        aria-label={copy.questions.progress(n, TOTAL_QUESTIONS)}
        className="h-2 overflow-hidden rounded-pill bg-line"
      >
        <div
          className="h-full rounded-pill bg-primary-500 transition-all duration-300"
          style={{ width: `${(n / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>
    </div>
  )
}

function SingleChoice<V extends string>({
  title,
  hint,
  options,
  selected,
  onSelect,
}: {
  title: string
  hint?: string
  options: Option<V>[]
  selected?: V
  onSelect: (value: V) => void
}) {
  // B-1: el segundo clic de un doble clic no puede contestar la pregunta que sigue
  const { settled, guard } = useSettled()
  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      {hint && <p className="mt-2 text-muted">{hint}</p>}
      <div
        role="radiogroup"
        aria-label={title}
        className="mt-6 grid gap-3"
        style={settled ? undefined : NO_CLICKS}
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected === o.value}
            className="option"
            onClick={guard(() => onSelect(o.value))}
          >
            {o.label}
          </button>
        ))}
      </div>
    </>
  )
}

function MultiChoice({
  title,
  hint,
  options,
  initial,
  onDone,
}: {
  title: string
  hint: string
  options: Option<SalesChannel>[]
  initial: SalesChannel[]
  onDone: (values: SalesChannel[]) => void
}) {
  const [selected, setSelected] = useState<SalesChannel[]>(initial)
  const { guard } = useSettled()
  const toggle = (v: SalesChannel) =>
    setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))
  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <p className="mt-2 text-muted">{hint}</p>
      <div role="group" aria-label={title} className="mt-6 grid gap-3">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={selected.includes(o.value)}
            className="option"
            onClick={() => toggle(o.value)}
          >
            <span
              aria-hidden="true"
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 text-sm ${
                selected.includes(o.value) ? 'border-night bg-night text-white' : 'border-line'
              }`}
            >
              {selected.includes(o.value) ? '✓' : ''}
            </span>
            {o.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary mt-6 w-full sm:w-auto"
        disabled={selected.length === 0}
        onClick={guard(() => onDone(selected))}
      >
        {copy.questions.next}
      </button>
      {selected.length === 0 && (
        <p className="mt-2 text-sm text-muted">{copy.questions.pickAtLeastOne}</p>
      )}
    </>
  )
}

/** Una pregunta por pantalla. `step` va de 0 a 3. */
export function Questions({
  step,
  answers,
  country,
  onAnswer,
  onBack,
}: {
  step: number
  answers: Partial<Answers>
  country: CountryCode | null
  onAnswer: <K extends keyof Answers>(key: K, value: Answers[K] | 'por-abrir') => void
  onBack: () => void
}) {
  const q = copy.questions.items
  const v = copyFor(country).questions
  const authority = country ? getCountry(country).fiscal.authority : 'el ente fiscal'
  const appNames = country
    ? getCountry(country)
        .deliveryApps.slice(0, 2)
        .map((a) => a.name)
        .join(', ')
    : ''
  const channelOptions = entries(q.channels.options).map((o) =>
    o.value === 'apps' && appNames ? { ...o, label: `${o.label} (${appNames})` } : o,
  )

  return (
    <section>
      <Progress step={step} />
      {step === 0 && (
        <SingleChoice
          key="q1"
          title={q.businessType.title}
          options={entries(q.businessType.options)}
          selected={answers.businessType}
          onSelect={(v) => onAnswer('businessType', v)}
        />
      )}
      {step === 1 && (
        <MultiChoice
          key="q2"
          title={v.channelsTitle}
          hint={v.channelsHint}
          options={channelOptions}
          initial={answers.channels ?? []}
          onDone={(v) => onAnswer('channels', v)}
        />
      )}
      {step === 2 && (
        <SingleChoice
          key="q3"
          title={v.billingTitle}
          hint={v.billingHint(authority)}
          options={entries(q.billing.options)}
          selected={answers.billing}
          onSelect={(v) => onAnswer('billing', v)}
        />
      )}
      {step === 3 && (
        <SingleChoice
          key="q4"
          title={v.localsTitle}
          options={entries(q.locals.options)}
          selected={answers.locals}
          onSelect={(v) => onAnswer('locals', v)}
        />
      )}
      <button type="button" className="btn btn-secondary mt-8" onClick={onBack}>
        {copy.questions.back}
      </button>
    </section>
  )
}
