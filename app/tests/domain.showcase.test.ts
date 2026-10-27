import { describe, expect, it } from 'vitest'
import {
  FEATURED_PLACE,
  fridayHours,
  isLandingCountry,
  isOpenAt,
  LANDING_COUNTRIES,
  sampleAnswersFor,
} from '../src/domain/showcase'
import { SnapshotProvider } from '../src/gateway/SnapshotProvider'
import { buildShowcase } from '../src/server/diagnosisService'
import { IDS, place } from './helpers'

const provider = new SnapshotProvider()

describe('vidriera: ticket de ejemplo con un local real', () => {
  it('cada país con landing tiene un local destacado que existe en el snapshot', async () => {
    for (const country of LANDING_COUNTRIES) {
      const p = await place(FEATURED_PLACE[country])
      expect(p.country).toBe(country)
    }
  })

  it('la escena "viernes 21:30" es cierta: todos los destacados figuran abiertos a esa hora', async () => {
    for (const country of LANDING_COUNTRIES) {
      const p = await place(FEATURED_PLACE[country])
      expect(isOpenAt(p.fields.openingHours.value, 'viernes', 21, 30)).toBe(true)
    }
  })

  it('isOpenAt entiende cierres pasada la medianoche y devuelve null sin horario', () => {
    const lines = ['viernes: 16:00–02:00']
    expect(isOpenAt(lines, 'viernes', 21, 30)).toBe(true)
    expect(isOpenAt(['viernes: 09:00–21:00'], 'viernes', 21, 30)).toBe(false)
    expect(isOpenAt(['lunes: 09:00–21:00'], 'viernes', 21, 30)).toBeNull()
    expect(isOpenAt(null, 'viernes', 21, 30)).toBeNull()
    expect(fridayHours(lines)).toBe('16:00–02:00')
  })

  it('las respuestas de ejemplo salen del tipo real del local', async () => {
    expect(sampleAnswersFor(await place(IDS.campeon)).businessType).toBe('pizzeria')
    expect(sampleAnswersFor(await place(IDS.reds)).businessType).toBe('restaurante')
  })

  it('buildShowcase(AR): el ticket sale del snapshot (4,2 · 6.167 reseñas) y trae los locales de AR', async () => {
    const s = await buildShowcase('AR', provider)
    expect(s.featured?.place.id).toBe(IDS.campeon)
    expect(s.featured?.place.fields.rating.value).toBe(4.2)
    expect(s.featured?.place.fields.reviewCount.value).toBe(6167)
    expect(s.featured?.neighbors?.peers.length).toBeGreaterThan(0)
    expect(s.places.every((p) => p.country === 'AR')).toBe(true)
    expect(s.places[0]!.reviewCount).toBeGreaterThanOrEqual(s.places[1]!.reviewCount ?? 0)
  })

  it('buildShowcase(null) es la home: destacado de Argentina y locales de todos los países', async () => {
    const s = await buildShowcase(null, provider)
    expect(s.country).toBeNull()
    expect(s.featured?.country).toBe('AR')
    expect(new Set(s.places.map((p) => p.country)).size).toBeGreaterThan(1)
  })

  it('isLandingCountry rechaza Brasil y valores raros', () => {
    expect(isLandingCountry('MX')).toBe(true)
    expect(isLandingCountry('BR')).toBe(false)
    expect(isLandingCountry('mx')).toBe(false)
  })
})
