import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getCountry } from '../src/config/countries'
import { LANDING_COUNTRIES } from '../src/domain/showcase'
import { SnapshotProvider } from '../src/gateway/SnapshotProvider'
import { buildShowcase } from '../src/server/diagnosisService'
import { renderLlmsTxt, renderSitemap } from '../scripts/blog'
import { homeMeta, landingLinks, landingMeta, renderPage } from '../scripts/pages'

const SITE = 'https://ejemplo.test'
const template = readFileSync(join(process.cwd(), 'index.html'), 'utf8')
const provider = new SnapshotProvider()
const guides = [{ title: 'Guía de prueba', href: '/blog/guia/', country: 'AR' as const }]

describe('landings por país prerenderizadas', () => {
  it.each(LANDING_COUNTRIES)(
    '%s: head propio, hreflang, JSON-LD y contenido real en el HTML',
    async (code) => {
      const country = getCountry(code)
      const showcase = await buildShowcase(code, provider)
      const html = renderPage(template, landingMeta(code, SITE), SITE, code, showcase, guides)

      // title / description específicos con apps, ente fiscal y moneda del país (countries.json)
      expect(html).toContain(`<title>Diagnóstico gratis para tu restaurante en ${country.name}`)
      expect(html).toContain(country.fiscal.authority)
      expect(html).toContain(country.currency.code)
      expect(html).toContain(country.deliveryApps[0]!.name)
      expect(html).toContain(`rel="canonical" href="${SITE}/${code.toLowerCase()}/"`)
      expect(html).toContain(`<html lang="${country.language}">`)
      // hreflang: x-default a la home y las 4 landings
      expect(html).toContain(`hreflang="x-default" href="${SITE}/"`)
      for (const c of LANDING_COUNTRIES) {
        expect(html).toContain(
          `hreflang="${getCountry(c).language}" href="${SITE}/${c.toLowerCase()}/"`,
        )
      }
      // JSON-LD
      expect(html).toContain('"@type":"WebApplication"')
      expect(html).toContain('"@type":"BreadcrumbList"')
      // un h1 y el contenido (ticket del local real + locales de la demo) ya están en el HTML, sin JS
      expect(html.match(/<h1/g)).toHaveLength(1)
      expect(html).toContain('Comanda de diagnóstico')
      for (const p of showcase.places) expect(html).toContain(p.name.replace(/'/g, '&#x27;'))
      // datos embebidos para que React arranque con lo mismo
      expect(html).toContain('id="page-data"')
      expect(html).not.toContain('%SITE_URL%')
      expect(html).not.toContain('<!--head:start-->')
    },
  )

  it('la home lleva x-default, WebApplication y el ticket de El Campeón (4,2 · 6.167)', async () => {
    const showcase = await buildShowcase(null, provider)
    const html = renderPage(template, homeMeta(SITE), SITE, null, showcase, guides)
    expect(html).toContain('rel="canonical" href="https://ejemplo.test/"')
    expect(html).toContain('"@type":"WebApplication"')
    expect(html).toContain('El Campeón De La Pizza')
    expect(html).toContain('6.167')
    expect(html).toContain('Alguien busca “pizza en Lanús”.')
  })

  it('sitemap.xml y llms.txt listan las 4 landings', () => {
    const landings = landingLinks(SITE)
    const sitemap = renderSitemap([], SITE, '2026-10-27', landings)
    const llms = renderLlmsTxt([], SITE, landings)
    for (const code of LANDING_COUNTRIES) {
      expect(sitemap).toContain(`<loc>${SITE}/${code.toLowerCase()}/</loc>`)
      expect(llms).toContain(`${SITE}/${code.toLowerCase()}/`)
    }
  })
})
