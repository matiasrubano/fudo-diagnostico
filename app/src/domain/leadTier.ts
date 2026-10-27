import { sellsByApps } from './scoring'
import type { Answers, LeadTier, PlaceProfile } from './types'

// ═══════════════════════════════════════════════════════════════════════════
//  FILTRO DE LEADS  ·  umbrales del volumen proxy (reseñas de Google, gratis)
//  Segmento núcleo: 1–3 locales, con volumen y con delivery.
// ═══════════════════════════════════════════════════════════════════════════
export const VOLUME_THRESHOLDS = {
  /** menos reseñas que esto = volumen bajo */
  low: 100,
  /** desde esta cantidad = volumen alto */
  high: 1000,
}

export type Volume = 'bajo' | 'medio' | 'alto' | 'desconocido'

/** Por qué se eligió ese tier (ids de texto en copy.ts) */
export type LeadReason =
  | 'por-abrir'
  | 'fuera-de-segmento'
  | 'cadena'
  | 'nucleo-sin-sistema'
  | 'nucleo-con-sistema'
  | 'poco-volumen'
  | 'sin-delivery'

export interface LeadClassification {
  tier: LeadTier
  volume: Volume
  reasons: LeadReason[]
}

export function volumeOf(reviewCount: PlaceProfile['fields']['reviewCount']): Volume {
  // not_found = no sabemos: no lo tratamos como volumen bajo
  if (reviewCount.status !== 'found' || reviewCount.value === null) return 'desconocido'
  if (reviewCount.value < VOLUME_THRESHOLDS.low) return 'bajo'
  if (reviewCount.value >= VOLUME_THRESHOLDS.high) return 'alto'
  return 'medio'
}

/**
 * Reglas, en orden (la primera que aplica gana):
 *  1. "Todavía no abrí"                       → por-abrir  (Consultor de Nuevos Negocios)
 *  2. 4+ locales, o negocio fuera del rubro   → descartar  (no es autoservicio: se deriva a ventas)
 *  3. Núcleo = volumen (no bajo) + delivery:
 *       - ya usa otro sistema de gestión      → switcher
 *       - cobra a mano o solo con terminal    → caliente
 *  4. Todo lo demás                           → nutrir
 */
export function classifyLead(profile: PlaceProfile, answers: Answers): LeadClassification {
  const volume = volumeOf(profile.fields.reviewCount)

  if (answers.businessType === 'por-abrir') {
    return { tier: 'por-abrir', volume, reasons: ['por-abrir'] }
  }
  if (answers.locals === '4+') {
    return { tier: 'descartar', volume, reasons: ['cadena'] }
  }
  if (answers.businessType === 'otro') {
    return { tier: 'descartar', volume, reasons: ['fuera-de-segmento'] }
  }

  const hasDelivery = sellsByApps(profile, answers) || answers.channels.includes('delivery-propio')
  const hasVolume = volume !== 'bajo'

  if (hasVolume && hasDelivery) {
    return answers.billing === 'otro-sistema'
      ? { tier: 'switcher', volume, reasons: ['nucleo-con-sistema'] }
      : { tier: 'caliente', volume, reasons: ['nucleo-sin-sistema'] }
  }

  const reasons: LeadReason[] = []
  if (!hasVolume) reasons.push('poco-volumen')
  if (!hasDelivery) reasons.push('sin-delivery')
  return { tier: 'nutrir', volume, reasons }
}
