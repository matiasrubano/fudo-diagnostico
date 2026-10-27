import { describe, expect, it } from 'vitest'
import { copy } from '../src/content/copy'
import { COUNTRY_CODES } from '../src/domain/types'
import { SnapshotProvider } from '../src/gateway/SnapshotProvider'
import { searchPlaces } from '../src/server/diagnosisService'
import { DEFAULT_COUNTRY, detectCountry } from '../src/server/geo'
import { exampleChips } from '../src/ui/screens/Home'

describe('detectCountry (/api/geo)', () => {
  it('lee x-vercel-ip-country', () => {
    expect(detectCountry(new Headers({ 'x-vercel-ip-country': 'mx' }))).toBe('MX')
    expect(detectCountry(new Headers({ 'x-vercel-ip-country': 'CL' }))).toBe('CL')
    expect(detectCountry(new Headers({ 'x-vercel-ip-country': 'BR' }))).toBe('BR')
  })

  it('por defecto Argentina: sin cabecera o con un país fuera de la demo', () => {
    expect(DEFAULT_COUNTRY).toBe('AR')
    expect(detectCountry(new Headers())).toBe('AR')
    expect(detectCountry(new Headers({ 'x-vercel-ip-country': 'US' }))).toBe('AR')
  })

  it('?country= lo fuerza (en desarrollo) y gana sobre la IP; uno inválido se ignora', () => {
    const ip = new Headers({ 'x-vercel-ip-country': 'CO' })
    expect(detectCountry(new Headers(), 'MX')).toBe('MX')
    expect(detectCountry(ip, 'cl')).toBe('CL')
    expect(detectCountry(ip, 'XX')).toBe('CO')
  })
})

describe('ejemplos tocables de la home por país', () => {
  it('el país detectado va primero y son 6 como mucho', () => {
    expect(exampleChips('MX').slice(0, 3)).toEqual(copy.hero.examples.MX)
    expect(exampleChips('CO')[0]).toBe('El Social')
    for (const code of COUNTRY_CODES) expect(exampleChips(code).length).toBeLessThanOrEqual(6)
    expect(exampleChips('AR')).toEqual([
      'Piki',
      'El Campeón',
      "Red's Burger",
      'Hola El Güero',
      'Ladina',
      'Davvero',
    ])
  })

  it('cada ejemplo encuentra exactamente un local real de su país', async () => {
    const provider = new SnapshotProvider()
    for (const code of COUNTRY_CODES) {
      for (const chip of copy.hero.examples[code]) {
        const res = await searchPlaces(chip, {}, provider)
        expect(res.results.length, chip).toBe(1)
        expect(res.results[0]?.country, chip).toBe(code)
      }
    }
  })
})
