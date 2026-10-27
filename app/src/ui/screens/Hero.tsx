import { useState, type FormEvent } from 'react'
import { copy } from '../../content/copy'
import { ScreenTitle } from '../components/ScreenTitle'

export function Hero({
  initialQuery,
  loading,
  error,
  onSearch,
}: {
  initialQuery: string
  loading: boolean
  error: string | null
  onSearch: (query: string, byExample?: boolean) => void
}) {
  const [query, setQuery] = useState(initialQuery)
  const [touched, setTouched] = useState(false)
  const tooShort = touched && query.trim().length < 2

  function submit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (query.trim().length >= 2) onSearch(query.trim())
  }

  return (
    <section>
      <ScreenTitle eyebrow={copy.hero.eyebrow}>{copy.hero.title}</ScreenTitle>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{copy.hero.subtitle}</p>

      <form onSubmit={submit} className="mt-8" noValidate>
        <label htmlFor="place-query" className="mb-2 block text-sm font-semibold">
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
            placeholder={copy.hero.searchPlaceholder}
            aria-invalid={tooShort}
            aria-describedby={tooShort || error ? 'search-error' : undefined}
            className="input flex-1"
          />
          <button type="submit" disabled={loading} className="btn btn-primary sm:min-w-[170px]">
            {loading ? copy.hero.searching : copy.hero.searchButton}
          </button>
        </div>
        {(tooShort || error) && (
          <p id="search-error" role="alert" className="mt-2 text-sm font-medium text-danger">
            {tooShort ? copy.hero.tooShort : error}
          </p>
        )}
      </form>

      <div className="mt-6">
        <p className="mb-2 text-sm text-muted">{copy.hero.examplesLabel}</p>
        <ul className="flex flex-wrap gap-2">
          {copy.hero.examples.map((example) => (
            <li key={example}>
              <button
                type="button"
                className="chip"
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

      <ul className="mt-10 grid gap-3 sm:grid-cols-3">
        {copy.hero.trust.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm font-medium">
            <span aria-hidden="true" className="mt-0.5 text-success">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
