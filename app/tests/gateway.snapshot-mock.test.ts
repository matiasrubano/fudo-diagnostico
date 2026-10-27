import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { PlaceNotFoundError } from '../src/gateway/PlaceDataProvider'
import { MockProvider } from '../src/gateway/MockProvider'
import { defaultSnapshotDir, SnapshotProvider } from '../src/gateway/SnapshotProvider'
import { geoBiasFromHeaders, searchPlaces } from '../src/server/diagnosisService'

describe('SnapshotProvider (sobre los JSON reales)', () => {
  const provider = new SnapshotProvider()

  it('carga los 13 locales del snapshot', async () => {
    const files = readdirSync(defaultSnapshotDir()).filter(
      (f) => f.endsWith('.json') && f !== 'index.json',
    )
    expect(files).toHaveLength(13)
    expect(await provider.suggest()).toHaveLength(13)
  })

  it('busca sin importar tildes ni mayúsculas', async () => {
    const results = await provider.search('CAMPEON pizza')
    expect(results[0]?.id).toBe('ar-el-campeon-de-la-pizza-lanus')
  })

  it('busca por ciudad: "pizzeria lanus" devuelve las pizzerías de Lanús', async () => {
    const ids = (await provider.search('pizzeria lanus')).map((r) => r.id)
    expect(ids).toEqual(
      expect.arrayContaining([
        'ar-pizzeria-las-palmas-lanus',
        'ar-pizzeria-piki-lanus',
        'ar-el-campeon-de-la-pizza-lanus',
      ]),
    )
  })

  it('un nombre que no está devuelve vacío (la UI muestra sugerencias)', async () => {
    expect(await provider.search('Parrilla Don Ramon')).toEqual([])
  })

  it('el país sesgado por IP va primero a igualdad de relevancia', async () => {
    const mx = await provider.suggest({ country: 'MX' })
    expect(mx.slice(0, 4).every((s) => s.country === 'MX')).toBe(true)
  })

  it('getDetails devuelve el esquema completo con procedencia por campo', async () => {
    const p = await provider.getDetails('ar-pizzeria-piki-lanus')
    expect(p.country).toBe('AR')
    expect(p.origin).toBe('snapshot')
    expect(p.fields.name.provenance.real).toBe(true)
    expect(p.fields.name.provenance.capturedAt).toBe('2026-10-26')
  })

  it('respeta not_found vs absent del snapshot', async () => {
    const piki = await provider.getDetails('ar-pizzeria-piki-lanus')
    expect(piki.fields.openingHours.status).toBe('not_found')
    expect(piki.fields.website.status).toBe('absent')
  })

  it('un id inexistente lanza PlaceNotFoundError', async () => {
    await expect(provider.getDetails('no-existe')).rejects.toBeInstanceOf(PlaceNotFoundError)
  })

  it('cada archivo tiene su país derivado de la dirección', async () => {
    for (const s of await provider.suggest()) {
      expect(s.country).toBe(s.id.slice(0, 2).toUpperCase())
    }
  })

  it('apunta a la carpeta data/snapshots del proyecto', () => {
    expect(defaultSnapshotDir()).toBe(join(process.cwd(), 'data', 'snapshots'))
  })
})

describe('MockProvider', () => {
  const mock = new MockProvider()

  it('busca y devuelve datos ficticios, nunca marcados como reales', async () => {
    const [first] = await mock.search('mock pizzeria')
    expect(first?.provenance.real).toBe(false)
    const details = await mock.getDetails('mock-pizzeria-ar')
    expect(details.origin).toBe('mock')
    expect(details.fields.name.provenance.real).toBe(false)
  })

  it('un id inexistente lanza PlaceNotFoundError', async () => {
    await expect(mock.getDetails('x')).rejects.toBeInstanceOf(PlaceNotFoundError)
  })
})

describe('servicio de búsqueda', () => {
  it('sin resultados devuelve notFound + sugerencias reales', async () => {
    const res = await searchPlaces('Parrilla Don Ramon', {}, new SnapshotProvider())
    expect(res.notFound).toBe(true)
    expect(res.results).toEqual([])
    expect(res.suggestions).toHaveLength(13)
  })

  it('la IP solo sesga: lee x-vercel-ip-country y descarta países fuera de la demo', () => {
    expect(geoBiasFromHeaders(new Headers({ 'x-vercel-ip-country': 'mx' })).country).toBe('MX')
    expect(geoBiasFromHeaders(new Headers({ 'x-vercel-ip-country': 'US' })).country).toBeUndefined()
    expect(geoBiasFromHeaders(new Headers()).lat).toBeUndefined()
  })
})
