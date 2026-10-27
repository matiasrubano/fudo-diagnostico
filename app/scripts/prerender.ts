// Paso final del build: convierte content/blog/*.md en HTML estático dentro de dist/,
// prerenderiza la home y genera sitemap.xml y llms.txt. Ver docs/adr/0004-blog-prerenderizado-geo.md
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { LANDING_COUNTRIES } from '../src/domain/showcase'
import { SnapshotProvider } from '../src/gateway/SnapshotProvider'
import { buildShowcase } from '../src/server/diagnosisService'
import type { GuideLink } from '../src/ui/screens/Home'
import {
  articlePath,
  parseArticle,
  renderArticlePage,
  renderBlogIndex,
  renderLlmsTxt,
  renderSitemap,
  type PageContext,
} from './blog'
import { homeMeta, landingLinks, landingMeta, landingPath, renderPage } from './pages'

const ROOT = process.cwd()
const DIST = join(ROOT, 'dist')
const BLOG_DIR = join(ROOT, 'content', 'blog')

// Dominio público: placeholder hasta que se confirme el deploy (se setea SITE_URL en Vercel)
const siteUrl = (process.env.SITE_URL ?? 'https://fudo-diagnostico.vercel.app').replace(/\/$/, '')

function write(relative: string, content: string): void {
  const file = join(DIST, relative)
  mkdirSync(join(file, '..'), { recursive: true })
  writeFileSync(file, content)
}

if (!existsSync(join(DIST, 'index.html')))
  throw new Error('Falta dist/index.html: corré `vite build` primero')

// 1) Artículos
const articles = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  .sort()
  .map((f) => parseArticle(readFileSync(join(BLOG_DIR, f), 'utf8'), f))

const slugs = new Set<string>()
for (const a of articles) {
  if (slugs.has(a.slug)) throw new Error(`slug repetido: ${a.slug}`)
  slugs.add(a.slug)
}
articles.sort((a, b) => a.country.localeCompare(b.country) || a.slug.localeCompare(b.slug))

// 2) El CSS que compiló Vite (con hash) se reutiliza en todas las páginas
const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf8')
const cssHref = indexHtml.match(/<link[^>]+rel="stylesheet"[^>]+href="(\/assets\/[^"]+\.css)"/)?.[1]
if (!cssHref) throw new Error('No encontré el CSS en dist/index.html')
const ctx: PageContext = { siteUrl, cssHref }

for (const a of articles) write(`blog/${a.slug}/index.html`, renderArticlePage(a, ctx))
write('blog/index.html', renderBlogIndex(articles, ctx))

// 3) Home y landings por país: el mismo árbol de React, renderizado a HTML estático con los datos reales del snapshot.
//    Cada una lleva su <head> propio (title, description, canonical, hreflang, JSON-LD). React se monta encima.
const template = indexHtml
const provider = new SnapshotProvider()
const guides: GuideLink[] = articles.map((a) => ({
  title: a.title,
  href: articlePath(a),
  country: a.country,
}))

writeFileSync(
  join(DIST, 'index.html'),
  renderPage(
    template,
    homeMeta(siteUrl),
    siteUrl,
    null,
    await buildShowcase(null, provider),
    guides,
  ),
)
for (const code of LANDING_COUNTRIES) {
  write(
    `${landingPath(code).slice(1)}index.html`,
    renderPage(
      template,
      landingMeta(code, siteUrl),
      siteUrl,
      code,
      await buildShowcase(code, provider),
      guides,
    ),
  )
}

// 4) sitemap, llms.txt y robots.txt (este viene de public/ con el dominio como placeholder)
const today = new Date().toISOString().slice(0, 10)
const landings = landingLinks(siteUrl)
write('sitemap.xml', renderSitemap(articles, siteUrl, today, landings))
write('llms.txt', renderLlmsTxt(articles, siteUrl, landings))
const robots = join(DIST, 'robots.txt')
if (existsSync(robots))
  writeFileSync(robots, readFileSync(robots, 'utf8').replaceAll('%SITE_URL%', siteUrl))

console.log(
  `prerender: ${articles.length} artículos, home, ${LANDING_COUNTRIES.length} landings por país, /blog/, sitemap.xml, llms.txt (${siteUrl})`,
)
