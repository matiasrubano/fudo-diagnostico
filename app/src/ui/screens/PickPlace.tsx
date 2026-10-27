import { getCountry } from '../../config/countries'
import { copy, copyFor } from '../../content/copy'
import type { PlaceSummary } from '../../domain/types'
import type { SearchResponse } from '../../server/diagnosisService'
import { ProvenanceBadge } from '../components/ProvenanceBadge'
import { ScreenTitle } from '../components/ScreenTitle'
import { formatNumber, formatRating, initialOf } from '../format'
import { NO_CLICKS, useSettled } from '../useSettled'

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
                {formatRating(place.rating, place.country ?? 'AR')}
                {place.reviewCount !== null &&
                  ` · ${copy.confirm.reviews(formatNumber(place.reviewCount, place.country ?? 'AR'))}`}
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
  onOpening,
}: {
  query: string
  response: SearchResponse
  onPick: (place: PlaceSummary, fromSuggestion: boolean) => void
  onBack: () => void
  /** "¿Todavía no abriste?": otra ruta, sin diagnóstico */
  onOpening: () => void
}) {
  const { results, suggestions, notFound, priorityCountry, onlyPriority } = response
  const { settled, guard } = useSettled()

  if (notFound) {
    const v = copyFor(priorityCountry).notFound
    const first = priorityCountry
      ? suggestions.filter((s) => s.country === priorityCountry)
      : suggestions
    const others = priorityCountry ? suggestions.filter((s) => s.country !== priorityCountry) : []
    const groups = [
      {
        title: priorityCountry ? v.pickIn(getCountry(priorityCountry).name) : v.pickAny,
        places: first,
      },
      ...(others.length > 0 && !onlyPriority ? [{ title: v.pickOthers, places: others }] : []),
    ]
    return (
      <section>
        <ScreenTitle>{v.title(query)}</ScreenTitle>
        <p className="mt-4 text-lg text-muted">{v.body(suggestions.length)}</p>
        <button type="button" className="btn btn-secondary mt-6" onClick={onBack}>
          {copy.confirm.back}
        </button>
        <p className="mt-6 text-muted">
          {copyFor(priorityCountry).opening.prompt}{' '}
          <button
            type="button"
            onClick={onOpening}
            className="inline-flex min-h-touch items-center font-semibold text-blue-700 underline"
          >
            {copyFor(priorityCountry).opening.link}
          </button>
        </p>
        {groups.map((group) => (
          <div key={group.title} className="mt-8">
            <h2 className="mb-3 text-base font-bold">{group.title}</h2>
            <ul className="grid gap-2 sm:grid-cols-2" style={settled ? undefined : NO_CLICKS}>
              {group.places.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={guard(() => onPick(s, true))}
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
          </div>
        ))}
      </section>
    )
  }

  const many = results.length > 1
  return (
    <section>
      <ScreenTitle>{many ? copy.confirm.titleMany : copy.confirm.titleOne}</ScreenTitle>
      <ul className="mt-8 space-y-4" style={settled ? undefined : NO_CLICKS}>
        {results.map((r) => (
          <PlaceCard
            key={r.id}
            place={r}
            action={many ? copy.confirm.pick : copy.confirm.yes}
            onPick={guard((selected: PlaceSummary) => onPick(selected, false))}
          />
        ))}
      </ul>
      <button type="button" className="btn btn-secondary mt-6" onClick={onBack}>
        {copy.confirm.back}
      </button>
    </section>
  )
}
