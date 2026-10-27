import type { CountryCode, CurrentSystem } from './types.js'

// Guías del blog para quien viene de un sistema concreto (slug = archivo de app/content/blog/).
// Solo hay una: Soft Restaurant en México. Para el resto de los sistemas no inventamos guías.
export const SYSTEM_GUIDES: Partial<Record<CurrentSystem, Partial<Record<CountryCode, string>>>> = {
  'soft-restaurant': { MX: 'cambiar-de-soft-restaurant' },
}

export function systemGuide(
  system: CurrentSystem | undefined,
  country: CountryCode,
): string | null {
  return (system && SYSTEM_GUIDES[system]?.[country]) || null
}
