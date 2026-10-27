import { sellsByApps } from './scoring.js'
import type { Answers, LeadTier, PlaceProfile } from './types.js'

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
  | 'fuera-de-segmento'
  | 'cadena'
  | 'nucleo-sin-sistema'
  | 'nucleo-con-sistema'
  /** igual que los anteriores, pero sin reseñas que leer: no se dice "vendés con volumen" cuando no lo sabemos */
  | 'nucleo-sin-sistema-volumen-desconocido'
  | 'nucleo-con-sistema-volumen-desconocido'
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
 *  ("Todavía no abrí" no pasa por acá: es otra ruta, sin diagnóstico. Ver src/domain/opening.ts)
 *  1. 4+ locales, o negocio fuera del rubro   → descartar  (no es autoservicio: se deriva a ventas)
 *  2. Núcleo = volumen (no bajo) + delivery:
 *       - ya usa otro sistema de gestión      → switcher
 *       - cobra a mano o solo con terminal    → caliente
 *  3. Todo lo demás                           → nutrir
 */
export function classifyLead(profile: PlaceProfile, answers: Answers): LeadClassification {
  const volume = volumeOf(profile.fields.reviewCount)

  if (answers.locals === '4+') {
    return { tier: 'descartar', volume, reasons: ['cadena'] }
  }
  if (answers.businessType === 'otro') {
    return { tier: 'descartar', volume, reasons: ['fuera-de-segmento'] }
  }

  const hasDelivery = sellsByApps(profile, answers) || answers.channels.includes('delivery-propio')
  const hasVolume = volume !== 'bajo'

  if (hasVolume && hasDelivery) {
    const unknown = volume === 'desconocido' ? '-volumen-desconocido' : ''
    return answers.billing === 'otro-sistema'
      ? { tier: 'switcher', volume, reasons: [`nucleo-con-sistema${unknown}` as LeadReason] }
      : { tier: 'caliente', volume, reasons: [`nucleo-sin-sistema${unknown}` as LeadReason] }
  }

  const reasons: LeadReason[] = []
  if (!hasVolume) reasons.push('poco-volumen')
  if (!hasDelivery) reasons.push('sin-delivery')
  return { tier: 'nutrir', volume, reasons }
}
