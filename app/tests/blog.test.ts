import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  parseArticle,
  renderArticlePage,
  renderBlogIndex,
  renderLlmsTxt,
  renderSitemap,
} from '../scripts/blog'

const DIR = join(process.cwd(), 'content', 'blog')
const articles = readdirSync(DIR)
  .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  .map((f) => parseArticle(readFileSync(join(DIR, f), 'utf8'), f))
const ctx = { siteUrl: 'https://ejemplo.test', cssHref: '/assets/index-abc.css' }

describe('blog prerenderizado', () => {
  it('hay artículos y todos se parsean con el frontmatter completo', () => {
    expect(articles.length).toBeGreaterThanOrEqual(1)
    for (const a of articles) {
      expect(a.faq.length).toBeGreaterThan(0)
      expect(a.sources.length).toBeGreaterThan(0)
      expect(a.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('un frontmatter incompleto falla con el nombre del archivo', () => {
    expect(() => parseArticle('---\ntitle: x\n---\ncuerpo', 'roto.md')).toThrow(/roto\.md/)
    expect(() => parseArticle('sin frontmatter', 'roto.md')).toThrow(/frontmatter/)
  })

  it('cada página trae el texto del artículo, meta específica y JSON-LD en el HTML', () => {
    for (const a of articles) {
      const html = renderArticlePage(a, ctx)
      expect(html).toContain(`<title>${a.title.replace(/&/g, '&amp;')}`)
      expect(html).toContain(`rel="canonical" href="https://ejemplo.test/blog/${a.slug}/"`)
      expect(html).toContain('property="og:title"')
      expect(html).toContain('name="twitter:card"')
      expect(html).toContain(`<html lang="${a.lang}">`)
      expect(html).toContain('"@type":"Article"')
      expect(html).toContain('"@type":"FAQPage"')
      expect(html).toContain('"@type":"BreadcrumbList"')
      expect(html).toContain('"datePublished"')
      expect(html).toContain('"dateModified"')
      // el cuerpo del markdown ya está renderizado dentro del HTML, sin JS
      expect(html).toContain('<div class="prose-fudo')
      expect(html).toContain('Preguntas frecuentes')
      expect(html).toContain(a.faq[0]!.q.slice(0, 20).replace(/&/g, '&amp;'))
      for (const s of a.sources) expect(html).toContain(s.url.replace(/&/g, '&amp;'))
      // CTA al diagnóstico
      expect(html).toContain('href="/"')
    }
  })

  it('la caja "Pendiente de verificación" aparece solo si hay verifyNotes', () => {
    const a = articles[0]!
    expect(renderArticlePage(a, ctx)).toContain('Pendiente de verificación')
    expect(renderArticlePage({ ...a, verifyNotes: [] }, ctx)).not.toContain(
      'Pendiente de verificación',
    )
  })

  it('el índice, el sitemap y llms.txt listan todos los artículos', () => {
    const index = renderBlogIndex(articles, ctx)
    const sitemap = renderSitemap(articles, ctx.siteUrl, '2026-10-26')
    const llms = renderLlmsTxt(articles, ctx.siteUrl)
    for (const a of articles) {
      expect(index).toContain(`href="/blog/${a.slug}/"`)
      expect(sitemap).toContain(`<loc>https://ejemplo.test/blog/${a.slug}/</loc>`)
      expect(llms).toContain(`https://ejemplo.test/blog/${a.slug}/`)
    }
    expect(sitemap).toContain('<loc>https://ejemplo.test/</loc>')
    expect(llms.startsWith('# ')).toBe(true)
  })

  it('el JSON-LD no puede cerrar el <script> aunque el texto traiga "<"', () => {
    const a = { ...articles[0]!, faq: [{ q: 'x', a: '</script><b>hola' }] }
    const html = renderArticlePage(a, ctx)
    expect(html).not.toContain('</script><b>')
  })
})
