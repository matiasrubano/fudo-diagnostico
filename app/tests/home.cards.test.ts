import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { copy, copyFor } from '../src/content/copy'
import { FEATURED_PLACE, LANDING_COUNTRIES } from '../src/domain/showcase'
import { COUNTRY_CODES } from '../src/domain/types'
import { SnapshotProvider } from '../src/gateway/SnapshotProvider'
import { buildShowcase } from '../src/server/diagnosisService'
import { buildHeroScenes, sceneOf, zoneOf } from '../src/ui/heroScenes'
import { homeMeta, landingMeta, renderPage } from '../scripts/pages'

const SITE = 'https://ejemplo.test'
const template = readFileSync(join(process.cwd(), 'index.html'), 'utf8')
const provider = new SnapshotProvider()
const noop = () => undefined

describe('escenas del hero: salen de los locales reales del snapshot', async () => {
  const catalog = await provider.suggest()

  it('cada escena corresponde a un local real y su zona sale de su dirección', () => {
    const scenes = buildHeroScenes(catalog, 'AR')
    expect(scenes.length).toBeGreaterThanOrEqual(5)
    expect(scenes.length).toBeLessThanOrEqual(10)
    for (const scene of scenes) {
      const place = catalog.find((p) => p.id === scene.placeId)!
      expect(place, scene.placeId).toBeTruthy()
      expect(scene.query.endsWith(zoneOf(place)), scene.query).toBe(true)
    }
    expect(new Set(scenes.map((s) => s.placeId)).size).toBe(scenes.length)
  })

  it('la escena del país detectado va primero, con su local destacado (el del ticket de ejemplo)', () => {
    for (const code of COUNTRY_CODES) {
      const first = buildHeroScenes(catalog, code)[0]!
      expect(first.placeId, code).toBe(FEATURED_PLACE[code])
      expect(first.country).toBe(code)
    }
    expect(sceneOf(catalog.find((p) => p.id === FEATURED_PLACE.AR)!)?.query).toBe('pizza en Lanús')
    expect(sceneOf(catalog.find((p) => p.id === FEATURED_PLACE.MX)!)?.query).toBe(
      'hamburguesas en Zapopan',
    )
  })

  it('hay escenas de los 5 países, y solo de ciudades de la demo', () => {
    const scenes = buildHeroScenes(catalog, 'MX')
    expect(new Set(scenes.map((s) => s.country))).toEqual(new Set(COUNTRY_CODES))
    const queries = scenes.map((s) => s.query).join(' | ')
    expect(queries).toContain('pizza en Lanús')
    expect(queries).toContain('café en Providencia')
    expect(queries).toContain('comida casera en Bogotá')
    expect(queries).toContain('pizzaria em Pinheiros') // el cliente de Brasil escribe en portugués
    expect(queries).toMatch(/tacos en CDMX/)
  })

  it('el día y la hora cambian según el rubro y vienen de copy.ts', () => {
    const times = new Set(buildHeroScenes(catalog, 'AR').map((s) => s.time))
    expect(times.size).toBeGreaterThan(2)
    for (const time of times) expect(Object.values(copy.hero.times)).toContain(time)
  })

  it('sin locales no hay escenas (la UI usa la de respaldo de copy.ts)', () => {
    expect(buildHeroScenes([], 'AR')).toEqual([])
    expect(copy.hero.fallbackScene.query).toBeTruthy()
  })
})

describe('home y landings: tarjetas reales en lugar del buscador', () => {
  it('la home prerenderizada no tiene buscador y trae las 13 tarjetas con su badge de captura', async () => {
    const showcase = await buildShowcase(null, provider)
    const html = renderPage(template, homeMeta(SITE), SITE, null, showcase, [])
    expect(html).not.toMatch(/type="search"|place-query/)
    expect(html).toContain('Elegí un local real de la demo')
    expect(html).toContain('En producción, acá buscás tu propio local con Google Places')
    expect(html).toContain('DATA_SOURCE=places')
    expect(html.match(/real · capturado el 26\/10\/2026/g)!.length).toBeGreaterThanOrEqual(13)
    expect((html.match(/Diagnosticar este local/g) ?? []).length).toBe(13)
    expect(html).toContain('Todavía no abriste?')
    // el H1 es uno solo y conserva la keyword aunque la escena sea decorativa
    expect(html.match(/<h1/g)).toHaveLength(1)
    expect(html).toMatch(/<h1[^>]*>(?:(?!<\/h1>)[\s\S])*Diagnóstico gratis para restaurantes/)
    // la escena rotativa es decorativa
    expect(html).toContain('aria-hidden="true" aria-live="off" class="hero-scene')
    expect(html).toContain('pizza en Lanús')
  })

  it('el orden de los países empieza por el de la landing y los grupos son por país', async () => {
    for (const code of LANDING_COUNTRIES) {
      const showcase = await buildShowcase(code, provider)
      const html = renderPage(template, landingMeta(code, SITE), SITE, code, showcase, [])
      expect(html, code).not.toMatch(/type="search"|place-query/)
      const groups = [...html.matchAll(/Locales de ([^<]+)<\/h3>/g)].map((m) => m[1])
      expect(groups.length).toBeGreaterThanOrEqual(4)
      expect(groups[0], code).toBe(
        { AR: 'Argentina', MX: 'México', CL: 'Chile', CO: 'Colombia' }[code],
      )
      expect(html).toContain('Diagnosticar este local')
    }
  })

  it('el copy ya no manda a escribir el nombre del local', () => {
    const all = JSON.stringify([copy, ...COUNTRY_CODES.map((c) => copyFor(c))], (_k, v) =>
      typeof v === 'function' ? undefined : v,
    )
    expect(all).not.toMatch(/Nombre de tu local|Buscá tu local|busca el tuyo|Escrib[ií] el nombre/)
  })

  it('las tarjetas son botones de verdad y el texto largo no desborda', async () => {
    const showcase = await buildShowcase(null, provider)
    const html = renderToStaticMarkup(
      createElement((await import('../src/ui/screens/Home')).Home, {
        country: null,
        showcase,
        guides: [],
        onPickPlace: noop,
        onOpenSample: noop,
        onOpening: noop,
      }),
    )
    expect(html).toMatch(
      /<button type="button" class="btn btn-primary[^"]*"[^>]*>Diagnosticar este local/,
    )
    expect(html).toContain('break-words')
  })
})
