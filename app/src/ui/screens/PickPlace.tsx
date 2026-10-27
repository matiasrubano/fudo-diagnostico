import { copy } from '../../content/copy'
import type { PlaceSummary } from '../../domain/types'
import type { SearchResponse } from '../../server/diagnosisService'
import { ProvenanceBadge } from '../components/ProvenanceBadge'
import { ScreenTitle } from '../components/ScreenTitle'
import { formatRating, initialOf } from '../format'

function PlaceCard({
  place,
  action,
  onPick,
}: {
  place: PlaceSummary
  action: string
  onPick: (place: PlaceSummary) => void
}) {
  return (
    <li className="card flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        {/* Sin fotos (Place Photos se factura aparte): avatar con la inicial */}
        <div
          aria-hidden="true"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-night font-display text-2xl font-extrabold text-white"
        >
          {initialOf(place.name)}
        </div>
        <div className="min-w-0">
          <h2 className="break-words text-xl font-bold leading-tight">{place.name}</h2>
          <p className="mt-0.5 break-words text-sm text-muted">{place.addressLine}</p>
          <p className="mt-1 text-sm font-medium">
            {place.rating !== null ? (
              <>
                <span aria-hidden="true" className="text-warning-text">
                  ★
                </span>{' '}
                <span className="sr-only">Rating </span>
                {formatRating(place.rating)}
                {place.reviewCount !== null && ` · ${copy.confirm.reviews(place.reviewCount)}`}
              </>
            ) : (
              <span className="text-muted">{copy.confirm.noRating}</span>
            )}
          </p>
          <div className="mt-2">
            <ProvenanceBadge provenance={place.provenance} />
          </div>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary w-full sm:w-auto"
        onClick={() => onPick(place)}
      >
        {action}
      </button>
    </li>
  )
}

export function PickPlace({
  query,
  response,
  onPick,
  onBack,
}: {
  query: string
  response: SearchResponse
  onPick: (place: PlaceSummary, fromSuggestion: boolean) => void
  onBack: () => void
}) {
  const { results, suggestions, notFound } = response

  if (notFound) {
    return (
      <section>
        <ScreenTitle>{copy.notFound.title(query)}</ScreenTitle>
        <p className="mt-4 text-lg text-muted">{copy.notFound.body}</p>
        <p className="mb-3 mt-6 text-sm font-semibold">{copy.notFound.pick}</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onPick(s, true)}
                className="option flex-col items-start gap-0 !py-3"
              >
                <span className="font-semibold">{s.name}</span>
                <span className="text-sm font-normal text-muted">
                  {s.city} · {s.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-secondary mt-8" onClick={onBack}>
          {copy.confirm.back}
        </button>
      </section>
    )
  }

  const many = results.length > 1
  return (
    <section>
      <ScreenTitle>{many ? copy.confirm.titleMany : copy.confirm.titleOne}</ScreenTitle>
      <ul className="mt-8 space-y-4">
        {results.map((r) => (
          <PlaceCard
            key={r.id}
            place={r}
            action={many ? copy.confirm.pick : copy.confirm.yes}
            onPick={(selected) => onPick(selected, false)}
          />
        ))}
      </ul>
      <button type="button" className="btn btn-secondary mt-6" onClick={onBack}>
        {copy.confirm.back}
      </button>
    </section>
  )
}
