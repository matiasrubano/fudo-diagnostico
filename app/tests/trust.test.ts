import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { copy } from '../src/content/copy'
import { diagnose } from '../src/domain/diagnose'
import { formatNumber, formatRating } from '../src/domain/numbers'
import { SnapshotProvider } from '../src/gateway/SnapshotProvider'
import { buildShowcase, runDiagnosis } from '../src/server/diagnosisService'
import { Footer, Header } from '../src/ui/components/Layout'
import { Neighbors } from '../src/ui/components/Neighbors'
import { RouteSection } from '../src/ui/screens/Routes'
import { Home } from '../src/ui/screens/Home'
import { parseArticle, renderArticlePage, renderLlmsTxt } from '../scripts/blog'
import { renderDebugShell, renderNotFound, renderPage, homeMeta } from '../scripts/pages'
import { answers, IDS, place } from './helpers'

const SITE = 'https://ejemplo.test'
const template = readFileSync(join(process.cwd(), 'index.html'), 'utf8')
const provider = new SnapshotProvider()
const noop = () => undefined

describe('confianza: sin jerga interna', () => {
  it('el resultado no muestra el rótulo del tier (Caliente, Switcher, Nutrir, Descartar)', async () => {
    const tiers = new Set<string>()
    for (const billing of ['manual', 'otro-sistema'] as const) {
      const d = diagnose(await place(IDS.campeon), answers({ billing }))
      tiers.add(d.lead.tier)
      const text = renderToStaticMarkup(createElement(RouteSection, { d })).replace(/<[^>]+>/g, ' ')
      expect(text).not.toMatch(/\b(Caliente|Switcher|Nutrir|Descartar|Por abrir)\b/)
    }
    expect(tiers).toEqual(new Set(['caliente', 'switcher']))
  })

  it('el pie y el encabezado no enlazan a /debug (la ruta queda, noindex)', () => {
    const html = renderToStaticMarkup(
      createElement('div', null, createElement(Header), createElement(Footer)),
    )
    expect(html).not.toContain('/debug')
    expect(html).not.toContain('Panel de eventos')
  })

  it('/debug/ tiene su propio HTML: título propio, noindex y sin canonical de la home', () => {
    const html = renderDebugShell(template)
    expect(html).toContain(`<title>${copy.debug.documentTitle}</title>`)
    expect(html).toContain('name="robots" content="noindex')
    expect(html).not.toContain('rel="canonical"')
    expect(html).toContain('<script type="module"') // la app arranca igual
  })

  it('la 404 es una página real: noindex, sin la app y con salida a la home y a las guías', () => {
    const html = renderNotFound(template)
    expect(html).toContain('name="robots" content="noindex')
    expect(html).toContain(copy.notFoundPage.title)
    expect(html).toContain('href="/"')
    expect(html).toContain('href="/blog/"')
    expect(html).not.toContain('<script type="module"')
    expect(html).not.toContain('rel="canonical"')
  })
})

describe('marca del país en el pie legal (B-12)', () => {
  it('Brasil dice Deli y deli.com.br; los demás, Fudo y fu.do', () => {
    const br = renderToStaticMarkup(createElement(Footer, { country: 'BR' }))
    expect(br).toContain('Deli')
    expect(br).toContain('deli.com.br')
    expect(br).not.toMatch(/Fudo|fu\.do/)
    const ar = renderToStaticMarkup(createElement(Footer, { country: 'AR' }))
    expect(ar).toContain('Fudo')
    expect(ar).toContain('fu.do')
  })
})

describe('separador de miles y decimales por país', () => {
  it('1.600 en AR/CL/CO, 1,600 en MX; rating con coma o con punto', () => {
    expect(formatNumber(1600, 'AR')).toBe('1.600')
    expect(formatNumber(1600, 'CL')).toBe('1.600')
    expect(formatNumber(1600, 'CO')).toBe('1.600')
    expect(formatNumber(1600, 'MX')).toBe('1,600')
    expect(formatRating(4.4, 'AR')).toBe('4,4')
    expect(formatRating(4.4, 'MX')).toBe('4.4')
  })

  it('la lista de resultados y el ticket usan el mismo formato para el mismo local', async () => {
    const res = await provider.search('Hola El Güero')
    expect(res[0]?.reviewCount).toBe(1600)
    expect(copy.confirm.reviews(formatNumber(1600, 'MX'))).toBe('1,600 reseñas')
  })
})

describe('el nombre y la etiqueta "tú" no quedan pegados', () => {
  it('"Tacos Hola El Güero" y su etiqueta se separan con un espacio', async () => {
    const d = await runDiagnosis(
      'mx-tacos-hola-el-guero-cdmx',
      answers({ businessType: 'taqueria' }),
      provider,
    )
    const html = renderToStaticMarkup(createElement(Neighbors, { n: d.neighbors!, country: 'MX' }))
    expect(html).toMatch(/Güero<\/span> <span[^>]*>tú<\/span>/)
    expect(html.replace(/<[^>]+>/g, '')).not.toContain('Güerotú')
  })
})

describe('la home explica de dónde salen los datos del ticket de ejemplo', () => {
  it('"Datos públicos de la ficha de Google, capturados el 26/10/2026 para esta demo"', async () => {
    const showcase = await buildShowcase(null, provider)
    const html = renderPage(template, homeMeta(SITE), SITE, null, showcase, [])
    expect(html).toContain(
      'Datos públicos de la ficha de Google, capturados el 26/10/2026 para esta demo',
    )
  })

  it('el link a la versión del país, y la voz del país detectado', async () => {
    const showcase = await buildShowcase('MX', provider)
    const html = renderToStaticMarkup(
      createElement(Home, {
        country: null,
        detected: 'MX',
        showcase,
        guides: [],
        initialQuery: '',
        loading: false,
        error: null,
        onSearch: noop,
        onOpenSample: noop,
        onOpening: noop,
      }),
    )
    expect(html).toContain('Ver la versión para México')
    expect(html).toContain('href="/mx/"')
    expect(html).toContain('hamburguesas en Zapopan') // escena del hero con un local real de MX
    expect(html).toContain('prueba con') // tuteo
    expect(html).not.toMatch(/Probá|Escribí/)
    // los ejemplos de México van primero
    expect(html.indexOf('Red&#x27;s Burger')).toBeGreaterThan(-1)
    expect(html.indexOf('Red&#x27;s Burger')).toBeLessThan(html.indexOf('Piki'))
  })
})

describe('SEO del blog (B-8, B-10, B-11)', () => {
  const dir = join(process.cwd(), 'content', 'blog')
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  const articles = files.map((f) => parseArticle(readFileSync(join(dir, f), 'utf8'), f))

  it('ninguna fuente apunta al host del SAT que no resuelve', () => {
    for (const f of files) {
      expect(readFileSync(join(dir, f), 'utf8'), f).not.toContain('wwwmatnp.sat.gob.mx')
    }
  })

  it('el JSON-LD Article trae publisher (este sitio, no Fudo)', () => {
    const html = renderArticlePage(articles[0]!, { siteUrl: SITE, cssHref: '/assets/x.css' })
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1]!.replace(/\\u003c/g, '<')) as Record<string, unknown>)
      .find((j) => j['@type'] === 'Article') as {
      publisher?: { '@type': string; name: string; url: string }
    }
    expect(ld.publisher?.['@type']).toBe('Organization')
    expect(ld.publisher?.url).toBe(SITE)
    expect(ld.publisher?.name).toContain('no oficial')
  })

  it('llms.txt lista el índice /blog/', () => {
    expect(renderLlmsTxt(articles, SITE, [])).toContain(`${SITE}/blog/`)
  })
})

describe('datos reales: el diagnóstico de cada local del snapshot no rompe con las respuestas nuevas', () => {
  it('los 13 locales con "me paga la app" y "otro sistema" salen con nota y sin errores', async () => {
    for (const s of await provider.suggest()) {
      for (const billing of ['app-paga', 'otro-sistema'] as const) {
        const d = await runDiagnosis(
          s.id,
          answers({
            businessType: 'restaurante',
            channels: ['apps'],
            billing,
            ...(billing === 'otro-sistema' ? { currentSystem: 'toteat' as const } : {}),
          }),
          provider,
        )
        expect(d.scorecard.overall, s.id).not.toBeNull()
        expect(d.money.total).toBe(d.money.lines.reduce((x, l) => x + l.amount, 0))
      }
    }
  })
})
