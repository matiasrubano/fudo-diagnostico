import { useState, type FormEvent } from 'react'
import { getCountry } from '../../config/countries'
import { copy, copyFor, type LandingFacts } from '../../content/copy'
import { ASSUMPTIONS } from '../../domain/moneyLost'
import { LANDING_COUNTRIES, type LandingCountry } from '../../domain/showcase'
import type { CountryCode, PlaceSummary } from '../../domain/types'
import type { ShowcaseResponse } from '../../server/diagnosisService'
import { ProvenanceBadge } from '../components/ProvenanceBadge'
import { ScreenTitle } from '../components/ScreenTitle'
import { Ticket } from '../components/Ticket'
import { formatDate, formatMoney, formatNumber, formatPrice, formatRating } from '../format'

export interface GuideLink {
  title: string
  href: string
  country: CountryCode
}

export interface HomeProps {
  /** null = la home; si no, la landing de ese país (/ar/, /mx/, /cl/, /co/) */
  country: LandingCountry | null
  /** solo en la home (country = null): país detectado por IP. Adapta la voz, la escena, los ejemplos y el link a su landing */
  detected?: LandingCountry | null
  showcase: ShowcaseResponse | null
  showcaseError?: boolean
  guides: GuideLink[]
  initialQuery: string
  loading: boolean
  error: string | null
  onSearch: (query: string, byExample?: boolean) => void
  /** abre el diagnóstico completo de un local de la demo, con respuestas de ejemplo (simuladas) */
  onOpenSample: (placeId: string, country: CountryCode | null) => void
  /** "¿Todavía no abriste?": lleva a la ruta de quien está por abrir (sin diagnóstico) */
  onOpening: () => void
}

/** Ejemplos tocables de la home: los locales del país del dueño primero, después los de los demás (hasta 6) */
export function exampleChips(first: CountryCode): string[] {
  const order: CountryCode[] = [
    first,
    ...(['AR', 'MX', 'CL', 'CO', 'BR'] as const).filter((c) => c !== first),
  ]
  return order.flatMap((c) => copy.hero.examples[c]).slice(0, 6)
}

export function landingFacts(code: CountryCode): LandingFacts {
  const c = getCountry(code)
  return {
    country: c.name,
    apps: c.deliveryApps.map((a) => a.name),
    authority: c.fiscal.authority,
    currencyCode: c.currency.code,
  }
}

function SearchBlock({
  country,
  initialQuery,
  loading,
  error,
  examples,
  onSearch,
  onOpening,
}: Pick<HomeProps, 'initialQuery' | 'loading' | 'error' | 'onSearch' | 'onOpening'> & {
  country: CountryCode | null
  examples: string[]
}) {
  const v = copyFor(country).hero
  const [query, setQuery] = useState(initialQuery)
  const [touched, setTouched] = useState(false)
  const tooShort = touched && query.trim().length < 2

  function submit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (query.trim().length >= 2) onSearch(query.trim())
  }

  return (
    <>
      <form onSubmit={submit} className="mt-8" noValidate>
        <label htmlFor="place-query" className="mb-2 block text-sm font-semibold text-white">
          {copy.hero.searchLabel}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="place-query"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={v.placeholder}
            aria-invalid={tooShort}
            aria-describedby={tooShort || error ? 'search-error' : undefined}
            maxLength={80}
            className="input flex-1 border-transparent"
          />
          <button type="submit" disabled={loading} className="btn btn-brand sm:min-w-[170px]">
            {loading ? copy.hero.searching : copy.hero.searchButton}
          </button>
        </div>
        {(tooShort || error) && (
          <p
            id="search-error"
            role="alert"
            className="mt-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-danger"
          >
            {tooShort ? v.tooShort : error}
          </p>
        )}
      </form>

      <p className="mt-5 text-sm text-on-night-muted">
        {copyFor(country).opening.prompt}{' '}
        <a
          href="#por-abrir"
          onClick={(event) => {
            event.preventDefault()
            onOpening()
          }}
          className="inline-flex min-h-touch items-center font-semibold text-white underline underline-offset-4"
        >
          {copyFor(country).opening.link}
        </a>
      </p>

      {examples.length > 0 && (
        <div className="mt-2">
          <p className="mb-2 text-sm text-on-night-muted">{v.examplesLabel}</p>
          <ul className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <li key={example}>
                <button
                  type="button"
                  className="chip-night"
                  disabled={loading}
                  onClick={() => {
                    setQuery(example)
                    onSearch(example, true)
                  }}
                >
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

function Steps() {
  return (
    <section aria-labelledby="steps-title" className="py-12">
      <h2 id="steps-title" className="text-3xl font-extrabold">
        {copy.home.stepsTitle}
      </h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {copy.home.steps.map((step) => (
          <li key={step.n} className="card">
            <p className="font-mono text-3xl font-bold text-primary-text">{step.n}</p>
            <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
            <p className="mt-1 text-body">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function CountryCards() {
  return (
    <section aria-labelledby="countries-title" className="pb-12">
      <h2 id="countries-title" className="text-3xl font-extrabold">
        {copy.countriesNav.title}
      </h2>
      <p className="mt-1 text-muted">{copy.countriesNav.lead}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LANDING_COUNTRIES.map((code) => {
          const c = getCountry(code)
          return (
            <li key={code}>
              <a
                href={`/${code.toLowerCase()}/`}
                className="card block h-full transition-shadow hover:shadow-float"
              >
                <span className="block text-xl font-bold">{c.name}</span>
                <span className="mt-1 block text-sm text-muted">
                  {c.deliveryApps
                    .slice(0, 2)
                    .map((a) => a.name)
                    .join(' · ')}{' '}
                  · {c.fiscal.authority} · {c.currency.code}
                </span>
                <span className="mt-3 inline-flex min-h-touch items-center text-sm font-semibold text-blue-700 underline">
                  {copy.countriesNav.link(c.name)}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Guides({ guides, country }: { guides: GuideLink[]; country: LandingCountry | null }) {
  const list = country ? guides.filter((g) => g.country === country) : guides
  const title = country
    ? copyFor(country).landing.guidesTitle(getCountry(country).name)
    : copy.guides.title
  return (
    <section aria-labelledby="guides-title" className="pb-4">
      <h2 id="guides-title" className="text-3xl font-extrabold">
        {title}
      </h2>
      {list.length > 0 && (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {list.map((g) => (
            <li key={g.href}>
              <a
                href={g.href}
                className="card flex min-h-touch items-center font-semibold text-blue-700 underline"
              >
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4">
        <a
          href={country ? `/blog/#${country.toLowerCase()}` : '/blog/'}
          className="inline-flex min-h-touch items-center font-semibold underline"
        >
          {copy.guides.all}
        </a>
      </p>
    </section>
  )
}

function LandingFactsBlock({ country }: { country: LandingCountry }) {
  const c = getCountry(country)
  const v = copyFor(country).landing
  const plan = c.fudoPlans[0]
  const f = landingFacts(country)
  return (
    <section aria-labelledby="facts-title" className="py-12">
      <h2 id="facts-title" className="text-3xl font-extrabold">
        {v.factsTitle(c.name)}
      </h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        <li className="card">{v.factApps(f.apps.join(', '))}</li>
        <li className="card">
          {v.factFiscal(c.fiscal.authority, c.fiscal.system)}{' '}
          <a
            href={c.fiscal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-700 underline"
          >
            {c.fiscal.authority}
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
        <li className="card">
          {v.factMoney(
            v.currencyName,
            c.currency.code,
            formatMoney(ASSUMPTIONS.avgTicket[country], country),
          )}
        </li>
        {plan && (
          <li className="card">
            {v.factPlan(
              plan.name,
              formatPrice(plan.priceMonthly, country),
              formatDate(plan.capturedAt),
            )}{' '}
            <a
              href={plan.source}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-700 underline"
            >
              fu.do
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </li>
        )}
      </ul>
    </section>
  )
}

function PlacesList({
  country,
  places,
  onOpenSample,
}: {
  country: LandingCountry
  places: PlaceSummary[]
  onOpenSample: HomeProps['onOpenSample']
}) {
  const v = copyFor(country).landing
  if (places.length === 0) return null
  return (
    <section aria-labelledby="places-title" className="pb-12">
      <h2 id="places-title" className="text-3xl font-extrabold">
        {v.placesTitle(getCountry(country).name)}
      </h2>
      <p className="mt-1 text-muted">{v.placesIntro}</p>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {places.map((p) => (
          <li key={p.id} className="card flex flex-col gap-3">
            <div>
              <h3 className="break-words text-xl font-bold leading-tight">{p.name}</h3>
              <p className="mt-0.5 break-words text-sm text-muted">{p.addressLine}</p>
              <p className="mt-1 font-mono text-sm font-medium tabular-nums">
                {p.rating !== null ? (
                  <>
                    <span aria-hidden="true" className="text-warning-text">
                      ★
                    </span>{' '}
                    <span className="sr-only">Rating </span>
                    {formatRating(p.rating, country)}
                    {p.reviewCount !== null && ` · ${formatNumber(p.reviewCount, country)} reseñas`}
                  </>
                ) : (
                  <span className="font-sans text-muted">{copy.confirm.noRating}</span>
                )}
              </p>
              <div className="mt-2">
                <ProvenanceBadge provenance={p.provenance} />
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary mt-auto w-full"
              onClick={() => onOpenSample(p.id, p.country)}
            >
              {copy.proof.cta}
              <span className="sr-only"> de {p.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Home (country = null) y landings por país. Se renderiza igual en el navegador y en el prerender (HTML estático):
 * la escena del hero, el ticket de ejemplo real y los bloques por país salen de los mismos datos.
 */
export function Home(props: HomeProps) {
  const { country, showcase, onOpenSample } = props
  // La home prerenderizada es la de Argentina (SEO); en el navegador se adapta al país detectado
  const detected = country ? null : (props.detected ?? null)
  const voiceCountry = country ?? detected
  const featured = showcase?.featured ?? null
  const v = copyFor(voiceCountry)
  const guides = detected
    ? [...props.guides].sort(
        (a, b) => Number(b.country === detected) - Number(a.country === detected),
      )
    : props.guides

  const place = featured?.place
  const noun =
    copy.hero.queryNoun[place?.fields.businessType.value ?? ''] ?? copy.hero.queryNoun.restaurante!
  const city = place?.fields.address.value?.city
  const query = place && city ? copy.hero.query(noun as string, city) : copy.hero.queryFallback
  const apps = country
    ? landingFacts(country).apps.slice(0, 2)
    : detected && detected !== 'AR'
      ? landingFacts(detected).apps.slice(0, 2)
      : []
  const examples = country
    ? (showcase?.places ?? []).slice(0, 3).map((p) => p.name)
    : exampleChips(detected ?? 'AR')
  const versionCountry = country ? null : (detected ?? 'AR')

  return (
    <>
      <section className="bg-night bg-hero text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-14 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:pb-20 lg:pt-16">
          <div>
            {country ? (
              <>
                <ScreenTitle
                  eyebrow={copy.hero.eyebrow}
                  eyebrowClassName="mb-3 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-on-night-accent"
                  titleClassName="font-display text-[28px] font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[40px]"
                >
                  {v.landing.title(landingFacts(country), v.landing.fiscalPhrase)}
                </ScreenTitle>
                <p className="mt-5 font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
                  <span className="font-mono text-on-night-accent">{copy.hero.time}</span>{' '}
                  {copy.hero.scene(query)}{' '}
                  <span className="text-on-night-muted">{copy.hero.question}</span>
                </p>
              </>
            ) : (
              <ScreenTitle
                eyebrow={copy.hero.eyebrow}
                eyebrowClassName="mb-3 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-on-night-accent"
                titleClassName="font-display text-[34px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[54px]"
              >
                <span className="font-mono text-on-night-accent">{copy.hero.time}</span>{' '}
                {copy.hero.scene(query)}
                <span className="mt-3 block text-2xl font-bold text-on-night-muted sm:text-3xl lg:text-[34px]">
                  {copy.hero.question}
                </span>
              </ScreenTitle>
            )}
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-on-night-muted">
              {v.hero.subtitle(apps)}
            </p>
            <SearchBlock
              country={voiceCountry}
              initialQuery={props.initialQuery}
              loading={props.loading}
              error={props.error}
              examples={examples}
              onSearch={props.onSearch}
              onOpening={props.onOpening}
            />
            {versionCountry && (
              <p className="mt-2">
                <a
                  href={`/${versionCountry.toLowerCase()}/`}
                  className="inline-flex min-h-touch items-center text-sm font-semibold text-white underline underline-offset-4"
                >
                  {copy.hero.versionFor(getCountry(versionCountry).name)}
                </a>
              </p>
            )}
            <ul className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {v.hero.trust.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm font-medium text-white">
                  <span aria-hidden="true" className="mt-0.5 text-on-night-accent">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto w-full max-w-[460px] lg:mx-0 lg:justify-self-end">
            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-on-night-accent">
              {copy.proof.eyebrow}
            </p>
            <h2 className="mb-4 font-display text-2xl font-extrabold leading-tight text-white">
              {copy.proof.title}
            </h2>
            {featured ? (
              <>
                <p className="mb-3 text-sm font-medium text-on-night-muted">
                  {copy.proof.source(formatDate(featured.place.capturedAt))}
                </p>
                <Ticket d={featured} sample />
                <p className="mt-5 text-sm text-on-night-muted">{copy.proof.intro(city ?? '')}</p>
                <button
                  type="button"
                  className="btn btn-brand mt-4 w-full"
                  onClick={() => onOpenSample(featured.place.id, featured.country)}
                >
                  {copy.proof.cta}
                </button>
              </>
            ) : (
              <p
                role="status"
                className="rounded-xl border border-white/30 p-6 text-sm text-on-night-muted"
              >
                {props.showcaseError ? copy.home.ticketError : copy.home.loadingTicket}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {country ? (
          <>
            <LandingFactsBlock country={country} />
            <PlacesList
              country={country}
              places={showcase?.places ?? []}
              onOpenSample={onOpenSample}
            />
          </>
        ) : (
          <>
            <Steps />
            <CountryCards />
          </>
        )}
        <Guides guides={guides} country={country} />
        {country && (
          <section aria-labelledby="others-title" className="pb-4 pt-8">
            <h2 id="others-title" className="text-2xl font-extrabold">
              {v.landing.otherCountries}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {LANDING_COUNTRIES.filter((code) => code !== country).map((code) => (
                <li key={code}>
                  <a href={`/${code.toLowerCase()}/`} className="chip">
                    {getCountry(code).name}
                  </a>
                </li>
              ))}
              <li>
                <a href="/" className="chip">
                  {v.landing.breadcrumbHome}
                </a>
              </li>
            </ul>
          </section>
        )}
      </div>
    </>
  )
}
