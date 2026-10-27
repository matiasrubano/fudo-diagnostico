import { describe, expect, it } from 'vitest'
import { SnapshotProvider } from '../src/gateway/SnapshotProvider'
import { geoBiasFromHeaders, searchPlaces } from '../src/server/diagnosisService'

// Búsqueda honesta: "¿Es este?" solo con una coincidencia real. Casos de la devolución de los dueños simulados.
const provider = new SnapshotProvider()
const search = (q: string, country?: string) =>
  searchPlaces(q, geoBiasFromHeaders(new Headers(), country), provider)

describe('búsqueda honesta', () => {
  it('"Café Lumbre" no existe: no se ofrece Casa Salvo Café como si fuera ese local', async () => {
    const res = await search('Café Lumbre')
    expect(res.notFound).toBe(true)
    expect(res.results).toEqual([])
    expect(res.suggestions.length).toBe(13)
  })

  it('"Pizzería Don Rubén Lanús" no existe: sin resultado y con sugerencias solo de Argentina, nombradas por la ciudad', async () => {
    const res = await search('Pizzería Don Rubén Lanús')
    expect(res.notFound).toBe(true)
    expect(res.priorityCountry).toBe('AR')
    expect(res.onlyPriority).toBe(true)
    expect(res.suggestions.length).toBeGreaterThan(0)
    expect(res.suggestions.every((s) => s.country === 'AR')).toBe(true)
  })

  it('"El Campeón de la Pizza" encuentra solo El Campeón (no Diavola, que también tiene "pizza")', async () => {
    const res = await search('El Campeón de la Pizza')
    expect(res.notFound).toBe(false)
    expect(res.results.map((r) => r.id)).toEqual(['ar-el-campeon-de-la-pizza-lanus'])
  })

  it('"Tacos Hola El Güero, Ciudad de México" encuentra solo ese local', async () => {
    const res = await search('Tacos Hola El Güero, Ciudad de México')
    expect(res.results.map((r) => r.id)).toEqual(['mx-tacos-hola-el-guero-cdmx'])
  })

  it('"Come Como en Casa Bogotá" encuentra solo la dark kitchen de Bogotá', async () => {
    const res = await search('Come Como en Casa Bogotá')
    expect(res.results.map((r) => r.id)).toEqual(['co-come-como-en-casa-dark-kitchen-bogota'])
  })

  it('una sola palabra que falta alcanza para no ofrecer el local (nombre + ciudad no se mezclan)', async () => {
    expect((await search('Casa Salvo Lanús')).notFound).toBe(true)
    expect((await search('El Campeón Bogotá')).notFound).toBe(true)
  })

  it('las búsquedas parciales de siempre siguen andando (chips y ciudad)', async () => {
    for (const [q, id] of [
      ['Piki', 'ar-pizzeria-piki-lanus'],
      ['El Campeón', 'ar-el-campeon-de-la-pizza-lanus'],
      ["Red's Burger", 'mx-reds-burger-shop-zapopan'],
      ['Davvero', 'cl-davvero-pizzeria-nunoa'],
      ['Ladina', 'mx-ladina-bar-roma-norte'],
      ['Diavola', 'br-diavola-pizzaria-pinheiros'],
      ['Hola El Güero', 'mx-tacos-hola-el-guero-cdmx'],
      ['Casa Salvo', 'cl-casa-salvo-cafe-providencia'],
      ['El Social', 'co-el-social-tienda-mixta-medellin'],
      ['Come Como en Casa', 'co-come-como-en-casa-dark-kitchen-bogota'],
    ] as const) {
      expect(
        (await search(q)).results.map((r) => r.id),
        q,
      ).toEqual([id])
    }
    const lanus = (await search('pizzeria lanus')).results.map((r) => r.id)
    expect(lanus).toHaveLength(3)
  })

  it('sin ciudad en la búsqueda, las sugerencias van con el país detectado primero (IP o landing)', async () => {
    const mx = await search('Café Lumbre', 'MX')
    expect(mx.priorityCountry).toBe('MX')
    expect(mx.onlyPriority).toBe(false)
    expect(mx.suggestions.slice(0, 4).every((s) => s.country === 'MX')).toBe(true)
    const header = await searchPlaces(
      'Café Lumbre',
      geoBiasFromHeaders(new Headers({ 'x-vercel-ip-country': 'CL' })),
      provider,
    )
    expect(header.priorityCountry).toBe('CL')
    expect(header.suggestions[0]?.country).toBe('CL')
    // sin país detectado: no hay prioridad
    expect((await search('Café Lumbre')).priorityCountry).toBeNull()
  })

  it('si la búsqueda nombra una ciudad del snapshot, el país de la IP no la pisa', async () => {
    const res = await search('Pizzería Don Rubén Lanús', 'MX')
    expect(res.priorityCountry).toBe('AR')
    expect(res.suggestions.every((s) => s.country === 'AR')).toBe(true)
  })

  it('un override de país inválido cae a la IP', () => {
    const headers = new Headers({ 'x-vercel-ip-country': 'CO' })
    expect(geoBiasFromHeaders(headers, 'XX').country).toBe('CO')
    expect(geoBiasFromHeaders(headers, 'mx').country).toBe('MX')
  })
})
