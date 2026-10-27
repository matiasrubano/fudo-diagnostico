import { useState, type FormEvent } from 'react'
import { track } from '../../analytics/events'
import { getCountry, type CountryConfig } from '../../config/countries'
import { copy } from '../../content/copy'
import type { Diagnosis } from '../../domain/diagnose'
import { withUtm } from '../../domain/links'
import { FREE_RESOURCES, moduleUrl } from '../../domain/recommendations'
import type { AreaId } from '../../domain/types'
import { Modal } from '../components/Modal'
import { ProvenanceBadge, SimulatedBadge } from '../components/ProvenanceBadge'
import { formatDate, formatPrice } from '../format'

const r = copy.route

function ExternalLink({
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

// ─── Caliente y switcher: "Tu Fudo ya armado" ───

function AccountPreview({ d, country }: { d: Diagnosis; country: CountryConfig }) {
  const f = d.place.fields
  const plan = country.fudoPlans[0]
  const address = f.address.value
  return (
    <div className="card">
      <h3 className="text-xl font-bold">{r.preview.title}</h3>
      <dl className="mt-4 space-y-4">
        <div>
          <dt className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted">
            {r.preview.name} <ProvenanceBadge provenance={f.name.provenance} />
          </dt>
          <dd className="text-lg font-bold">{f.name.value}</dd>
        </div>
        <div>
          <dt className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted">
            {r.preview.address} <ProvenanceBadge provenance={f.address.provenance} />
          </dt>
          <dd>{[address?.street, address?.city, address?.region].filter(Boolean).join(', ')}</dd>
        </div>
        <div>
          <dt className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted">
            {r.preview.hours} <ProvenanceBadge provenance={f.openingHours.provenance} />
          </dt>
          <dd>
            {f.openingHours.value && f.openingHours.value.length > 0 ? (
              <ul className="text-sm">
                {f.openingHours.value.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <span className="text-muted">{r.preview.hoursMissing}</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted">
            {r.preview.menu} <SimulatedBadge />
          </dt>
          <dd>
            <ul className="text-sm">
              {r.preview.menuSample.map((item) => (
                <li
                  key={item.name}
                  className="flex justify-between gap-4 border-b border-dashed border-line py-1"
                >
                  <span>{item.name}</span>
                  <span className="text-muted">{item.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">{r.preview.menuNote}</p>
          </dd>
        </div>
        {plan && (
          <div>
            <dt className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted">
              {r.preview.plan}
              <ProvenanceBadge
                provenance={{ source: plan.source, capturedAt: plan.capturedAt, real: true }}
              />
            </dt>
            <dd>
              {r.preview.planFrom(plan.name, formatPrice(plan.priceMonthly, d.country))}.{' '}
              <span className="text-sm text-muted">
                {r.preview.planNote} ({formatDate(plan.capturedAt)})
              </span>
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}

function CreateAccount({ d, country }: { d: Diagnosis; country: CountryConfig }) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const tier = d.lead.tier
  const site = new URL(country.fudoSignupUrl).hostname
  const f = d.place.fields

  function close() {
    setOpen(false)
    setDone(false)
  }

  return (
    <>
      <p className="rounded-xl bg-[#FFF1B8] p-4 text-sm font-medium text-warning-text">
        {r.simulatedNotice(site)}
      </p>
      <button
        type="button"
        className="btn btn-primary mt-4 w-full sm:w-auto"
        onClick={() => {
          setOpen(true)
          track('cta_click', { cta: 'simulate_account', tier })
        }}
      >
        {r.caliente.cta(country.productName)}
      </button>
      <Modal open={open} onClose={close} title={r.modal.title}>
        {!done ? (
          <>
            <p className="text-body">{r.modal.body}</p>
            <ul className="my-3 list-disc pl-5 text-sm">
              <li>{f.name.value}</li>
              <li>{[f.address.value?.street, f.address.value?.city].filter(Boolean).join(', ')}</li>
              <li>{r.preview.hours}</li>
            </ul>
            <p className="rounded-lg bg-[#FFF1B8] p-3 text-sm font-medium text-warning-text">
              {r.simulatedNotice(site)}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn btn-primary" onClick={() => setDone(true)}>
                {r.modal.simulate}
              </button>
              <button type="button" className="btn btn-secondary" onClick={close}>
                {r.modal.cancel}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="flex items-center gap-2 text-lg font-bold">
              {r.modal.doneTitle} <SimulatedBadge />
            </p>
            <p className="mt-2 text-body">{r.modal.doneBody}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <ExternalLink
                href={withUtm(country.fudoSignupUrl, tier)}
                tier={tier}
                cta="signup_link"
                className="btn btn-primary"
              >
                {r.modal.realLink(country.productName)}
              </ExternalLink>
              <button type="button" className="btn btn-secondary" onClick={close}>
                {r.modal.cancel}
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

function HotOrSwitcher({ d, country }: { d: Diagnosis; country: CountryConfig }) {
  const switcher = d.lead.tier === 'switcher'
  const product = country.productName
  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow mb-2">{r.caliente.eyebrow(product)}</p>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          {switcher ? r.switcher.title(product) : r.caliente.title(product)}
        </h2>
        <p className="mt-2 text-lg text-muted">{switcher ? r.switcher.intro : r.caliente.intro}</p>
      </div>
      <AccountPreview d={d} country={country} />
      {switcher && (
        <div className="card">
          <h3 className="flex flex-wrap items-center gap-2 text-xl font-bold">
            {r.switcher.migrateTitle} <SimulatedBadge />
          </h3>
          <p className="mt-2 text-body">{r.switcher.migrateBody}</p>
          <ExternalLink
            href={r.switcher.migrateUrl}
            tier={d.lead.tier}
            cta="migrate_help"
            className="mt-3 inline-flex min-h-touch items-center font-semibold text-blue-700 underline"
          >
            {r.switcher.migrateLink}
          </ExternalLink>
        </div>
      )}
      <CreateAccount d={d} country={country} />
    </div>
  )
}

// ─── Nutrir ───

function Nurture({ d }: { d: Diagnosis }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'invalid' | 'sent'>('idle')

  // Las dos áreas más flojas que sí pudimos medir
  const weakest = (Object.values(d.scorecard.areas) as { id: AreaId; score: number | null }[])
    .filter((a) => a.score !== null)
    .sort((a, b) => (a.score as number) - (b.score as number))
    .slice(0, 2)
  const guides = weakest.map((a) => ({ area: a.id, ...FREE_RESOURCES[a.id] }))

  function submit(event: FormEvent) {
    event.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    setState(valid ? 'sent' : 'invalid')
    // Simulado: no se envía ni se guarda el email (ni siquiera en localStorage)
    if (valid) track('cta_click', { cta: 'email_guides', tier: d.lead.tier })
  }

  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-extrabold leading-tight">{r.nutrir.title}</h2>
      <p className="text-lg text-muted">{r.nutrir.intro}</p>
      <ul className="space-y-3">
        {guides.map((g) => (
          <li key={g.url} className="card">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
              {copy.areas[g.area].name}
            </p>
            <ExternalLink
              href={withUtm(g.url, g.area)}
              tier={d.lead.tier}
              cta={`download:${g.area}`}
              className="mt-1 inline-flex min-h-touch items-center text-lg font-bold text-blue-700 underline"
            >
              {g.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="card" noValidate>
        <label
          htmlFor="nurture-email"
          className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold"
        >
          {r.nutrir.emailLabel} <SimulatedBadge />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="nurture-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setState('idle')
            }}
            aria-invalid={state === 'invalid'}
            aria-describedby="nurture-msg"
            className="input flex-1"
          />
          <button type="submit" className="btn btn-primary">
            {r.nutrir.emailButton}
          </button>
        </div>
        <p
          id="nurture-msg"
          role="status"
          className={`mt-2 text-sm font-medium ${state === 'invalid' ? 'text-danger' : 'text-success-text'}`}
        >
          {state === 'invalid' ? r.nutrir.emailInvalid : state === 'sent' ? r.nutrir.emailDone : ''}
        </p>
      </form>
    </div>
  )
}

// ─── Por abrir ───

function OpenBusiness({ d }: { d: Diagnosis }) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-extrabold leading-tight">{r.porAbrir.title}</h2>
      <p className="text-lg text-body">{r.porAbrir.body}</p>
      <ExternalLink
        href={withUtm(r.porAbrir.url, 'por-abrir')}
        tier={d.lead.tier}
        cta="consultor"
        className="btn btn-primary w-full sm:w-auto"
      >
        {r.porAbrir.cta}
      </ExternalLink>
    </div>
  )
}

// ─── Descartar ───

function Discard({ d, country }: { d: Diagnosis; country: CountryConfig }) {
  const chain = d.lead.reasons.includes('cadena')
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-extrabold leading-tight">
        {chain ? r.descartar.cadenaTitle : r.descartar.otroTitle}
      </h2>
      <p className="text-lg text-body">{chain ? r.descartar.cadenaBody : r.descartar.otroBody}</p>
      {chain ? (
        <ExternalLink
          href={withUtm(moduleUrl(country, 'precios'), 'descartar')}
          tier={d.lead.tier}
          cta="ventas"
          className="btn btn-primary w-full sm:w-auto"
        >
          {r.descartar.cadenaCta}
        </ExternalLink>
      ) : (
        <a
          href={`/blog/#${d.country.toLowerCase()}`}
          className="btn btn-primary w-full sm:w-auto"
          onClick={() => track('cta_click', { cta: 'guides', tier: d.lead.tier })}
        >
          {r.descartar.guidesCta}
        </a>
      )}
    </div>
  )
}

/** Ruteo final según el tier del lead. */
export function RouteSection({ d }: { d: Diagnosis }) {
  const country = getCountry(d.country)
  const tier = d.lead.tier
  return (
    <section
      aria-labelledby="route-reason"
      className="rounded-2xl border-2 border-primary-500 bg-white p-5 shadow-card sm:p-8"
    >
      <p id="route-reason" className="mb-5 text-sm text-muted">
        <span className="font-semibold">{copy.result.whyRoute}:</span>{' '}
        {d.lead.reasons.map((reason) => r.reasons[reason]).join(' ')}{' '}
        <span className="rounded-pill bg-night px-2 py-0.5 text-xs font-semibold text-white">
          {copy.tiers[tier]}
        </span>
      </p>
      {(tier === 'caliente' || tier === 'switcher') && <HotOrSwitcher d={d} country={country} />}
      {tier === 'nutrir' && <Nurture d={d} />}
      {tier === 'por-abrir' && <OpenBusiness d={d} />}
      {tier === 'descartar' && <Discard d={d} country={country} />}
    </section>
  )
}
