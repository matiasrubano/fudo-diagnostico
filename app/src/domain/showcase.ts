import type { Answers, BusinessType, CountryCode, PlaceProfile } from './types.js'

// ═══════════════════════════════════════════════════════════════════════════
//  VIDRIERA DE LA HOME Y DE LAS LANDINGS POR PAÍS
//  Qué local real del snapshot se muestra como "ticket de ejemplo" en cada país.
//  Solo se guarda el ID: todos los números salen del snapshot en cada request/build.
// ═══════════════════════════════════════════════════════════════════════════

/** Países con landing propia (/ar/, /mx/, /cl/, /co/). Brasil queda afuera: el contenido sigue en español. */
export const LANDING_COUNTRIES = ['AR', 'MX', 'CL', 'CO'] as const
export type LandingCountry = (typeof LANDING_COUNTRIES)[number]

export function isLandingCountry(value: unknown): value is LandingCountry {
  return typeof value === 'string' && (LANDING_COUNTRIES as readonly string[]).includes(value)
}

/** Local real que protagoniza el ticket de ejemplo. La home usa el de Argentina. */
export const FEATURED_PLACE: Record<CountryCode, string> = {
  AR: 'ar-el-campeon-de-la-pizza-lanus',
  MX: 'mx-reds-burger-shop-zapopan',
  CL: 'cl-davvero-pizzeria-nunoa',
  CO: 'co-el-social-tienda-mixta-medellin',
  BR: 'br-diavola-pizzaria-pinheiros',
}

const SAMPLE_TYPES: Record<string, BusinessType> = {
  pizzeria: 'pizzeria',
  bar: 'bar',
  cafeteria: 'cafeteria',
  taqueria: 'taqueria',
  hamburgueseria: 'hamburgueseria',
  'dark-kitchen': 'dark-kitchen',
}

/**
 * Respuestas de ejemplo con las que se arma el ticket de la vidriera: SIMULADAS
 * (el dueño real las contesta en las 4 preguntas). La UI las marca como tales.
 */
export function sampleAnswersFor(place: PlaceProfile): Answers {
  return {
    businessType: SAMPLE_TYPES[place.fields.businessType.value ?? ''] ?? 'restaurante',
    channels: ['salon', 'apps'],
    billing: 'manual',
    locals: '1',
  }
}

const DAY_PREFIX: Record<'viernes', RegExp> = { viernes: /^(vier|sex)/i }

/**
 * ¿El local figura abierto ese día a esa hora según su ficha? Lee líneas como "viernes: 07:00–00:00".
 * Un cierre pasada la medianoche (00:00, 02:00) cuenta como el mismo turno. null = no hay horario ese día.
 */
export function isOpenAt(
  lines: string[] | null,
  day: 'viernes',
  hour: number,
  minute: number,
): boolean | null {
  const line = lines?.find((l) => DAY_PREFIX[day].test(l.trim()))
  const match = line?.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/)
  if (!match) return null
  const [open, close] = [
    Number(match[1]) * 60 + Number(match[2]),
    Number(match[3]) * 60 + Number(match[4]),
  ]
  const now = hour * 60 + minute
  return close > open ? now >= open && now < close : now >= open || now < close
}

/** "viernes: 07:00–00:00" → "07:00–00:00" (para mostrar en el ticket). */
export function fridayHours(lines: string[] | null): string | null {
  const line = lines?.find((l) => DAY_PREFIX.viernes.test(l.trim()))
  return line?.replace(/^[^:]*:\s*/, '') ?? null
}
