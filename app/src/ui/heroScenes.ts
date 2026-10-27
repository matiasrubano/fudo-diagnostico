import { copy, copyFor } from '../content/copy'
import { FEATURED_PLACE } from '../domain/showcase'
import type { CountryCode, PlaceSummary } from '../domain/types'

/** Una escena del hero: "Viernes 21:30. Alguien busca «pizza en Lanús»." */
export interface HeroScene {
  /** id del local real del que sale la escena */
  placeId: string
  country: CountryCode | null
  /** "Viernes 21:30" */
  time: string
  /** "pizza en Lanús" */
  query: string
}

const COUNTRY_ORDER: CountryCode[] = ['AR', 'MX', 'CL', 'CO', 'BR']

/** Zona de la dirección si la calle la trae ("R. João Moura, 1080 - Pinheiros, São Paulo" -> "Pinheiros") */
export function zoneOf(place: Pick<PlaceSummary, 'addressLine' | 'city'>): string {
  const inStreet = place.addressLine.match(/ - ([^,]+),/)?.[1]?.trim()
  const zone = inStreet ?? place.city ?? ''
  return copy.hero.cityShort[zone] ?? zone
}

/** La escena de un local real: el rubro y la zona salen de su ficha; el texto, de copy.ts con la voz de su país. */
export function sceneOf(place: PlaceSummary): HeroScene | null {
  const zone = zoneOf(place)
  if (!zone) return null
  const type = place.businessType ?? 'restaurante'
  const v = copyFor(place.country).hero
  const noun = v.sceneNoun[type] ?? v.sceneNoun.restaurante!
  return {
    placeId: place.id,
    country: place.country,
    time: copy.hero.times[type] ?? copy.hero.times.restaurante!,
    query: v.sceneQuery(noun, zone),
  }
}

/**
 * Las escenas que rotan en el hero, armadas con los locales reales del snapshot (no hay ninguna escrita a mano):
 *  1. primero el país detectado (o el de la landing), empezando por su local destacado, el mismo del ticket de ejemplo;
 *  2. un local de cada uno de los otros países;
 *  3. después, un segundo local de cada país con un rubro distinto al ya elegido.
 * Hasta `max` escenas.
 */
export function buildHeroScenes(
  catalog: PlaceSummary[],
  first: CountryCode = 'AR',
  max = 10,
): HeroScene[] {
  const countries = [first, ...COUNTRY_ORDER.filter((c) => c !== first)]
  const byCountry = new Map<CountryCode, PlaceSummary[]>()
  for (const code of countries) {
    const list = catalog
      .filter((p) => p.country === code)
      .sort((a, b) => (b.reviewCount ?? -1) - (a.reviewCount ?? -1))
    // el destacado va primero: coincide con el ticket de ejemplo de la home
    const featured = list.findIndex((p) => p.id === FEATURED_PLACE[code])
    if (featured > 0) list.unshift(...list.splice(featured, 1))
    byCountry.set(code, list)
  }

  const scenes: HeroScene[] = []
  const used = new Map<CountryCode, Set<string>>()
  const add = (code: CountryCode, place: PlaceSummary) => {
    const scene = sceneOf(place)
    if (!scene) return false
    const nouns = used.get(code) ?? new Set<string>()
    nouns.add(place.businessType ?? '')
    used.set(code, nouns)
    scenes.push(scene)
    return true
  }
  for (const code of countries) {
    const top = byCountry.get(code)?.[0]
    if (top) add(code, top)
  }
  for (const code of countries) {
    if (scenes.length >= max) break
    const next = byCountry
      .get(code)
      ?.find((p) => !used.get(code)?.has(p.businessType ?? '') && sceneOf(p) !== null)
    if (next) add(code, next)
  }
  return scenes.slice(0, max)
}
