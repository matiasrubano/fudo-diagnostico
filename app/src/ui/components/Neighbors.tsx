import { getCountry } from '../../config/countries'
import { copy, copyFor } from '../../content/copy'
import type { NeighborComparison } from '../../domain/neighbors'
import type { CountryCode } from '../../domain/types'
import { formatDate, formatNumber, formatRating } from '../format'
import { Badge } from './ProvenanceBadge'

interface Entry {
  id: string
  name: string
  city: string | null
  rating: number | null
  reviewCount: number | null
  you: boolean
  sameCity: boolean
  sameType: boolean
}

/** Posición 0–100 en una escala logarítmica (las reseñas van de 3 a 12.000: lineal no se lee). */
function logPosition(value: number, min: number, max: number): number {
  const lo = Math.log10(min + 1)
  const hi = Math.log10(max + 1)
  return hi === lo ? 50 : ((Math.log10(value + 1) - lo) / (hi - lo)) * 100
}

/**
 * "Cómo estás contra otros locales de la demo en <país>": rango real de reseñas y rating de los otros
 * locales del snapshot del mismo país. Si no hay pares, el componente padre no lo renderiza.
 */
export function Neighbors({ n, country }: { n: NeighborComparison; country: CountryCode }) {
  const v = copyFor(country).neighbors
  const countryName = getCountry(country).name
  const own = n.you
  const entries: Entry[] = [
    ...n.peers.map((p) => ({ ...p, you: false })),
    {
      id: own.id,
      name: own.name,
      city: own.city,
      rating: own.rating,
      reviewCount: own.reviewCount,
      you: true,
      sameCity: false,
      sameType: false,
    },
  ].sort((a, b) => (b.reviewCount ?? -1) - (a.reviewCount ?? -1))

  const withReviews = entries.filter((e) => e.reviewCount !== null)
  const min = Math.min(...withReviews.map((e) => e.reviewCount as number))
  const max = Math.max(...withReviews.map((e) => e.reviewCount as number))
  const fmt = (x: number) => formatNumber(x, country)
  const capturedAt = n.peers[0]?.provenance.capturedAt

  return (
    <section aria-labelledby="neighbors-title" className="card">
      <div className="flex flex-wrap items-center gap-2">
        {capturedAt && <Badge kind="real" label={copy.neighbors.badge(formatDate(capturedAt))} />}
      </div>
      <h2 id="neighbors-title" className="mt-2 text-2xl font-extrabold leading-tight">
        {v.title(countryName)}
      </h2>
      <p className="mt-1 text-muted">{v.intro(n.peers.length)}</p>

      <ul className="mt-4 space-y-1.5">
        {n.reviewsRank && own.reviewCount !== null ? (
          <li className="font-medium">
            {v.reviewsRank(n.reviewsRank.position, n.reviewsRank.outOf, fmt(own.reviewCount))}
          </li>
        ) : (
          <li className="font-medium">{v.noOwnData}</li>
        )}
        {n.ratingRank && own.rating !== null && (
          <li>
            {v.ratingRank(n.ratingRank.position, n.ratingRank.outOf, formatRating(own.rating))}
          </li>
        )}
        {n.reviews && (
          <li className="text-muted">{v.reviewsRange(fmt(n.reviews.min), fmt(n.reviews.max))}</li>
        )}
        {n.rating && (
          <li className="text-muted">
            {v.ratingRange(formatRating(n.rating.min), formatRating(n.rating.max))}
          </li>
        )}
        {n.sameCityCount > 0 && own.city && (
          <li className="text-muted">{v.sameCityNote(n.sameCityCount, own.city)}</li>
        )}
      </ul>

      {withReviews.length > 1 && (
        <figure className="mt-5" aria-hidden="true">
          <div className="relative mx-2 h-8">
            <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-line" />
            {withReviews.map((e) => (
              <span
                key={e.id}
                className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                  e.you
                    ? 'z-10 h-5 w-5 border-ink bg-primary-500'
                    : 'h-3.5 w-3.5 border-white bg-night'
                }`}
                style={{ left: `${logPosition(e.reviewCount as number, min, max)}%` }}
              />
            ))}
          </div>
          <figcaption className="mx-2 mt-1 font-mono text-xs text-muted">
            <span className="flex justify-between">
              <span>{fmt(min)}</span>
              <span>{fmt(max)}</span>
            </span>
            <span className="mt-0.5 block text-center">{v.scale}</span>
          </figcaption>
        </figure>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-line">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">
                {copy.neighbors.colLocal}
              </th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                {copy.neighbors.colRating}
              </th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                {copy.neighbors.colReviews}
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr
                key={e.id}
                className={`border-t border-line align-top ${e.you ? 'bg-primary-50 font-semibold' : ''}`}
              >
                <td className="px-3 py-2">
                  <span className="break-words">{e.name}</span>
                  {e.you && (
                    <span className="ml-2 rounded-pill bg-night px-2 py-0.5 text-xs font-semibold text-white">
                      {v.you}
                    </span>
                  )}
                  <span className="block text-xs font-normal text-muted">
                    {[
                      e.city,
                      e.sameCity && copy.neighbors.sameCity,
                      e.sameType && copy.neighbors.sameType,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-mono tabular-nums">
                  {e.rating !== null ? formatRating(e.rating) : copy.neighbors.noData}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-mono tabular-nums">
                  {e.reviewCount !== null ? fmt(e.reviewCount) : copy.neighbors.noData}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">{v.note}</p>
    </section>
  )
}
