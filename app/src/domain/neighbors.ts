import type { CountryCode, PlaceSummary, Provenance } from './types.js'

// ═══════════════════════════════════════════════════════════════════════════
//  COMPARACIÓN CON VECINOS  ·  función pura, sin I/O
//  Compara un local con los OTROS locales reales del catálogo de la demo del mismo país.
//  Solo usa datos reales del snapshot (rating y cantidad de reseñas, con su procedencia):
//  no inventa promedios de mercado. Si no hay pares con datos, devuelve null y la UI no muestra nada.
// ═══════════════════════════════════════════════════════════════════════════

export interface NeighborPeer {
  id: string
  name: string
  city: string | null
  businessType: string | null
  rating: number | null
  reviewCount: number | null
  /** misma ciudad que el local comparado */
  sameCity: boolean
  /** mismo tipo de negocio (pizzería, bar…) */
  sameType: boolean
  provenance: Provenance
}

export interface Range {
  min: number
  max: number
  /** mediana de los pares (sin contar al local) */
  median: number
  /** cuántos pares tienen este dato */
  count: number
}

export interface NeighborComparison {
  country: CountryCode
  /** el local que se compara (siempre visible en la lista) */
  you: {
    id: string
    name: string
    city: string | null
    rating: number | null
    reviewCount: number | null
  }
  /** pares ordenados de más a menos reseñas (los que no tienen reseñas, al final) */
  peers: NeighborPeer[]
  reviews: Range | null
  rating: Range | null
  /** puesto del local entre él y sus pares por reseñas (1 = el que más tiene); null si no tiene el dato */
  reviewsRank: { position: number; outOf: number } | null
  ratingRank: { position: number; outOf: number } | null
  sameCityCount: number
  sameTypeCount: number
}

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? (sorted[mid] as number)
    : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2
}

function rangeOf(values: number[]): Range | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  return {
    min: sorted[0] as number,
    max: sorted[sorted.length - 1] as number,
    median: median(sorted),
    count: sorted.length,
  }
}

/** 1 = el valor más alto. Empates comparten puesto (el mejor). */
function rankOf(
  value: number | null,
  peers: (number | null)[],
): { position: number; outOf: number } | null {
  if (value === null) return null
  const known = peers.filter((v): v is number => v !== null)
  return { position: 1 + known.filter((v) => v > value).length, outOf: known.length + 1 }
}

function norm(text: string | null): string {
  return (text ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

/**
 * Compara `place` con los demás locales de `catalog` del mismo país.
 * Un par entra si tiene rating o reseñas (uno sin ninguno de los dos no aporta nada).
 * Devuelve null si el local no tiene país o no hay ningún par.
 */
export function compareWithNeighbors(
  place: PlaceSummary,
  catalog: PlaceSummary[],
): NeighborComparison | null {
  if (!place.country) return null
  const peers: NeighborPeer[] = catalog
    .filter(
      (p) =>
        p.id !== place.id &&
        p.country === place.country &&
        (p.rating !== null || p.reviewCount !== null),
    )
    .map((p) => ({
      id: p.id,
      name: p.name,
      city: p.city,
      businessType: p.businessType,
      rating: p.rating,
      reviewCount: p.reviewCount,
      sameCity: !!place.city && norm(p.city) === norm(place.city),
      sameType: !!place.businessType && norm(p.businessType) === norm(place.businessType),
      provenance: p.provenance,
    }))
    .sort(
      (a, b) => (b.reviewCount ?? -1) - (a.reviewCount ?? -1) || a.name.localeCompare(b.name, 'es'),
    )
  if (peers.length === 0) return null

  const peerReviews = peers.map((p) => p.reviewCount)
  const peerRatings = peers.map((p) => p.rating)
  const known = (values: (number | null)[]) => values.filter((v): v is number => v !== null)
  return {
    country: place.country,
    you: {
      id: place.id,
      name: place.name,
      city: place.city,
      rating: place.rating,
      reviewCount: place.reviewCount,
    },
    peers,
    reviews: rangeOf(known(peerReviews)),
    rating: rangeOf(known(peerRatings)),
    reviewsRank: rankOf(place.reviewCount, peerReviews),
    ratingRank: rankOf(place.rating, peerRatings),
    sameCityCount: peers.filter((p) => p.sameCity).length,
    sameTypeCount: peers.filter((p) => p.sameType).length,
  }
}
