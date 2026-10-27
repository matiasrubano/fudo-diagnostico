import { describe, expect, it } from 'vitest'
import { DEFAULT_COUNTRY, detectCountry } from '../src/server/geo'

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
