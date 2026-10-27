import { isCountryCode, type CountryCode } from '../domain/types.js'

/** País que se asume si no sabemos desde dónde entra el dueño (la demo nació en Argentina) */
export const DEFAULT_COUNTRY: CountryCode = 'AR'

/**
 * País desde el que entra el dueño, para adaptar la home (voz, escena, ejemplos).
 *  1. `?country=XX`: lo fuerza (para probar y para compartir un link de otro país)
 *  2. la cabecera x-vercel-ip-country de Vercel
 *  3. Argentina
 * Es solo una preferencia de presentación: el país de cada diagnóstico sale de la dirección del local.
 */
export function detectCountry(headers: Headers, override?: string | null): CountryCode {
  const forced = override?.toUpperCase()
  if (isCountryCode(forced)) return forced
  const fromIp = headers.get('x-vercel-ip-country')?.toUpperCase()
  return isCountryCode(fromIp) ? fromIp : DEFAULT_COUNTRY
}
