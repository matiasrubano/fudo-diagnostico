import type { Answers, AreaId, Field, PlaceProfile } from './types.js'

// ═══════════════════════════════════════════════════════════════════════════
//  PESOS Y UMBRALES  ·  para el cambio en vivo, tocá SOLO este bloque
//  Todo es simulado/propio de la demo: no es una métrica oficial de Google ni de Fudo.
//  Los textos que ve el usuario están en src/content/copy.ts (por id de área / chequeo).
// ═══════════════════════════════════════════════════════════════════════════

/** Peso de cada área en la nota general. Si un área no aplica (p. ej. no vende por delivery) se reparte entre las demás. */
export const AREA_WEIGHTS: Record<AreaId, number> = {
  google: 0.2, // ficha de Google completa
  reviews: 0.25, // rating y volumen de reseñas
  web: 0.15, // web propia e Instagram (solo presencia, no métricas)
  delivery: 0.2, // en cuántas apps está y si tiene canal propio
  operation: 0.2, // cobro, facturación y orden operativo (sale de tus respuestas)
}

/** Peso de cada chequeo DENTRO de su área (suman 100 por área; los "no sabemos" se descartan y el resto se reescala). */
export const CHECK_WEIGHTS = {
  google: { hours: 40, address: 20, category: 20, price: 20 },
  reviews: { rating: 50, volume: 50 },
  web: { website: 65, instagram: 35 },
  delivery: { apps: 55, ownChannel: 45 },
  operation: { billing: 60, channels: 25, locals: 15 },
} as const

export const THRESHOLDS = {
  /** Rating de Google → puntos (0–100) */
  rating: { excellent: 4.5, good: 4.0, fair: 3.5 },
  ratingPoints: { excellent: 100, good: 80, fair: 55, poor: 30 },
  /** Con menos reseñas que esto, el rating no es una señal creíble (ej.: 5,0 con 8 reseñas) */
  minReviewsToTrustRating: 20,
  ratingCapWhenFewReviews: 60,
  /** Cantidad de reseñas → puntos: [hasta pocas, hasta algunas, hasta muchas, hasta un montón, más] */
  reviewBands: [10, 50, 300, 1000] as const,
  reviewPoints: [10, 30, 55, 80, 100] as const,
  /** Puntos de la facturación declarada (pregunta 3) */
  billingPoints: { manual: 20, terminal: 50, 'otro-sistema': 85 },
  /** Puntos cuando todo está ordenado / cuando hay varios canales o locales sin un sistema que los junte */
  operationOk: 85,
  operationWithSystem: 70,
  operationNoSystemChannels: 30,
  operationNoSystemLocals: 25,
  /** Puntos por apps de delivery encontradas: 1 app, 2 o más */
  appsPoints: { one: 70, many: 100 },
  /** Si lo que pudimos leer pesa menos que esto dentro del área, no damos nota (mejor "sin datos suficientes" que un 100 engañoso) */
  minKnownShare: 0.5,
  /** Corte de nota general / por área para la etiqueta (muy bien, bien, a mejorar, urgente) */
  grade: { great: 80, good: 60, fair: 40 },
  /** Corte de cada chequeo para el semáforo */
  check: { ok: 80, warn: 50 },
}

// ═══════════════════════════════════════════════════════════════════════════

export type Grade = 'great' | 'good' | 'fair' | 'poor'
export type CheckStatus = 'ok' | 'warn' | 'bad' | 'unknown'

export interface Check {
  /** clave del texto en copy.ts */
  id: string
  weight: number
  /** 0–100, o null si no sabemos (el dato no se encontró) */
  score: number | null
  status: CheckStatus
}

export interface AreaScore {
  id: AreaId
  /** null = no aplica o no hay datos suficientes */
  score: number | null
  grade: Grade | null
  applicable: boolean
  checks: Check[]
}

export interface Scorecard {
  overall: number | null
  overallGrade: Grade | null
  areas: Record<AreaId, AreaScore>
}

export function gradeOf(score: number | null): Grade | null {
  if (score === null) return null
  const g = THRESHOLDS.grade
  return score >= g.great ? 'great' : score >= g.good ? 'good' : score >= g.fair ? 'fair' : 'poor'
}

function makeCheck(id: string, weight: number, score: number | null): Check {
  const t = THRESHOLDS.check
  const status: CheckStatus =
    score === null ? 'unknown' : score >= t.ok ? 'ok' : score >= t.warn ? 'warn' : 'bad'
  return { id, weight, score, status }
}

/** Promedio ponderado ignorando los chequeos desconocidos. null si no hay ninguno conocido. */
function weighted(checks: Check[]): number | null {
  const known = checks.filter((c) => c.score !== null)
  const total = known.reduce((sum, c) => sum + c.weight, 0)
  const all = checks.reduce((sum, c) => sum + c.weight, 0)
  if (total === 0 || total / all < THRESHOLDS.minKnownShare) return null
  return Math.round(known.reduce((sum, c) => sum + (c.score as number) * c.weight, 0) / total)
}

/**
 * Regla común de campos del snapshot: found → `whenFound`, absent → 0 (verificado que no existe),
 * not_found → null (no sabemos: NO se penaliza).
 */
function fromField<T>(f: Field<T>, whenFound: (value: T) => number): number | null {
  if (f.status === 'absent') return 0
  if (f.status === 'not_found' || f.value === null) return null
  return whenFound(f.value)
}

function area(id: AreaId, checks: Check[], applicable = true): AreaScore {
  const score = applicable ? weighted(checks) : null
  return { id, score, grade: gradeOf(score), applicable, checks }
}

// ─── Chequeos por área ───

export function ratingPoints(rating: number, reviewCount: number | null): number {
  const t = THRESHOLDS.rating
  const p = THRESHOLDS.ratingPoints
  let points =
    rating >= t.excellent
      ? p.excellent
      : rating >= t.good
        ? p.good
        : rating >= t.fair
          ? p.fair
          : p.poor
  if (reviewCount !== null && reviewCount < THRESHOLDS.minReviewsToTrustRating) {
    points = Math.min(points, THRESHOLDS.ratingCapWhenFewReviews)
  }
  return points
}

export function volumePoints(reviewCount: number): number {
  const bands = THRESHOLDS.reviewBands
  const i = bands.findIndex((limit) => reviewCount < limit)
  return THRESHOLDS.reviewPoints[i === -1 ? bands.length : i] as number
}

function googleArea(p: PlaceProfile): AreaScore {
  const w = CHECK_WEIGHTS.google
  const f = p.fields
  return area('google', [
    makeCheck(
      'hours',
      w.hours,
      fromField(f.openingHours, (h) => (h.length > 0 ? 100 : 0)),
    ),
    makeCheck(
      'address',
      w.address,
      fromField(f.address, (a) => (a.street ? 100 : 40)),
    ),
    makeCheck(
      'category',
      w.category,
      fromField(f.businessType, () => 100),
    ),
    makeCheck(
      'price',
      w.price,
      fromField(f.priceLevel, () => 100),
    ),
  ])
}

function reviewsArea(p: PlaceProfile): AreaScore {
  const w = CHECK_WEIGHTS.reviews
  const f = p.fields
  const count = f.reviewCount.value
  return area('reviews', [
    makeCheck(
      'rating',
      w.rating,
      fromField(f.rating, (r) => ratingPoints(r, count)),
    ),
    makeCheck('volume', w.volume, fromField(f.reviewCount, volumePoints)),
  ])
}

function webArea(p: PlaceProfile): AreaScore {
  const w = CHECK_WEIGHTS.web
  const f = p.fields
  return area('web', [
    makeCheck(
      'website',
      w.website,
      fromField(f.website, () => 100),
    ),
    makeCheck(
      'instagram',
      w.instagram,
      fromField(f.instagram, () => 100),
    ),
  ])
}

/** Cantidad de apps de delivery con link encontrado en el local */
export function appsFound(p: PlaceProfile): number {
  return Object.values(p.fields.delivery.value ?? {}).filter(Boolean).length
}

export function sellsByApps(p: PlaceProfile, a: Answers): boolean {
  return a.channels.includes('apps') || appsFound(p) > 0
}

function deliveryArea(p: PlaceProfile, a: Answers): AreaScore {
  const w = CHECK_WEIGHTS.delivery
  const t = THRESHOLDS.appsPoints
  const n = appsFound(p)
  const ownChannel = a.channels.includes('delivery-propio')
  const byApps = sellsByApps(p, a)
  const applicable = byApps || ownChannel || p.fields.deliveryOffered.value === true

  // Si dice que vende por apps pero no encontramos el link, no sabemos (null): no penalizamos
  const apps = n >= 2 ? t.many : n === 1 ? t.one : byApps ? null : 0
  return area(
    'delivery',
    [makeCheck('apps', w.apps, apps), makeCheck('ownChannel', w.ownChannel, ownChannel ? 100 : 0)],
    applicable,
  )
}

function operationArea(a: Answers): AreaScore {
  const w = CHECK_WEIGHTS.operation
  const t = THRESHOLDS
  const hasSystem = a.billing === 'otro-sistema'
  const manyChannels = a.channels.length > 1
  return area('operation', [
    makeCheck('billing', w.billing, t.billingPoints[a.billing]),
    makeCheck(
      'channels',
      w.channels,
      !manyChannels
        ? t.operationOk
        : hasSystem
          ? t.operationWithSystem
          : t.operationNoSystemChannels,
    ),
    makeCheck(
      'locals',
      w.locals,
      a.locals === '1'
        ? t.operationOk
        : hasSystem
          ? t.operationWithSystem
          : t.operationNoSystemLocals,
    ),
  ])
}

export function scoreProfile(profile: PlaceProfile, answers: Answers): Scorecard {
  const areas: Record<AreaId, AreaScore> = {
    google: googleArea(profile),
    reviews: reviewsArea(profile),
    web: webArea(profile),
    delivery: deliveryArea(profile, answers),
    operation: operationArea(answers),
  }
  const scored = Object.values(areas).filter((a) => a.score !== null)
  const totalWeight = scored.reduce((sum, a) => sum + AREA_WEIGHTS[a.id], 0)
  const overall =
    totalWeight === 0
      ? null
      : Math.round(
          scored.reduce((sum, a) => sum + (a.score as number) * AREA_WEIGHTS[a.id], 0) /
            totalWeight,
        )
  return { overall, overallGrade: gradeOf(overall), areas }
}
