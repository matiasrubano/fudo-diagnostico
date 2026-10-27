// Blog prerenderizado: de content/blog/*.md a HTML estático (se ejecuta después de `vite build`).
// Este archivo solo tiene funciones puras (parsear y armar HTML/JSON-LD); scripts/prerender.ts las usa y escribe en dist/.
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { marked } from 'marked'
import { parse as parseYaml } from 'yaml'
import { copy } from '../src/content/copy'
import { tokens } from '../src/theme/tokens'
import { Header, SimpleFooter } from '../src/ui/components/Layout'

export type BlogCountry = 'AR' | 'MX' | 'CL' | 'CO'
export const BLOG_COUNTRIES: { code: BlogCountry; name: string }[] = [
  { code: 'AR', name: 'Argentina' },
  { code: 'MX', name: 'México' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
]

export interface Article {
  title: string
  slug: string
  country: BlogCountry
  lang: string
  description: string
  keyword: string
  question: string
  /** YYYY-MM-DD */
  updatedAt: string
  author: string
  status: string
  faq: { q: string; a: string }[]
  sources: { label: string; url: string }[]
  verifyNotes: string[]
  cta: { text: string }
  /** HTML ya renderizado desde el markdown */
  html: string
}

const REQUIRED = [
  'title',
  'slug',
  'country',
  'lang',
  'description',
  'keyword',
  'question',
  'updatedAt',
  'author',
  'status',
  'faq',
  'sources',
  'verifyNotes',
  'cta',
] as const

/** Lee un .md con frontmatter YAML. Si falta un campo, falla el build con el nombre del archivo. */
export function parseArticle(source: string, file: string): Article {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error(`${file}: falta el frontmatter YAML`)
  const meta = parseYaml(match[1] as string) as Record<string, unknown>
  for (const key of REQUIRED) {
    if (meta[key] === undefined || meta[key] === null) throw new Error(`${file}: falta "${key}"`)
  }
  if (!BLOG_COUNTRIES.some((c) => c.code === meta.country)) {
    throw new Error(`${file}: country "${String(meta.country)}" no es AR, MX, CL ni CO`)
  }
  // YAML sin comillas convierte 2026-10-26 en Date
  const updatedAt =
    meta.updatedAt instanceof Date
      ? meta.updatedAt.toISOString().slice(0, 10)
      : String(meta.updatedAt)
  const article = {
    ...(meta as unknown as Omit<Article, 'html' | 'updatedAt'>),
    updatedAt,
    html: marked.parse(match[2] as string, { async: false }),
  }
  return article
}

export function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** JSON-LD dentro de <script>: se escapa "<" para que nada cierre el tag. */
function ldJson(data: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

export function formatDateEs(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export const articlePath = (a: Pick<Article, 'slug'>) => `/blog/${a.slug}/`

export interface PageContext {
  siteUrl: string
  /** href del CSS compilado por Vite (con hash), tomado de dist/index.html */
  cssHref: string
}

const FONTS_HREF = tokens.font.googleFontsHref

interface PageParts {
  title: string
  description: string
  path: string
  lang: string
  type: 'website' | 'article'
  jsonLd: unknown[]
  body: string
  ctx: PageContext
}

/** Documento HTML completo: meta específica, canonical, OG/Twitter, JSON-LD y el CSS de la app. */
function page(p: PageParts): string {
  const url = p.ctx.siteUrl + p.path
  const ogLocale = p.lang.replace('-', '_')
  return `<!doctype html>
<html lang="${esc(p.lang)}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}" />
<link rel="canonical" href="${esc(url)}" />
<meta name="robots" content="index, follow, max-snippet:-1" />
<meta property="og:type" content="${p.type}" />
<meta property="og:title" content="${esc(p.title)}" />
<meta property="og:description" content="${esc(p.description)}" />
<meta property="og:url" content="${esc(url)}" />
<meta property="og:locale" content="${esc(ogLocale)}" />
<meta property="og:site_name" content="${esc(copy.brand.name)}" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${esc(p.title)}" />
<meta name="twitter:description" content="${esc(p.description)}" />
<meta name="theme-color" content="#0F1B4E" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="stylesheet" href="${esc(FONTS_HREF)}" />
<link rel="stylesheet" href="${esc(p.ctx.cssHref)}" />
${p.jsonLd.map(ldJson).join('\n')}
</head>
<body class="bg-surface">
${siteHeader()}
${p.body}
${siteFooter()}
</body>
</html>
`
}

/** Mismo header y pie que la app (componentes React renderizados a HTML estático): una sola marca en todo el sitio. */
function siteHeader(): string {
  return renderToStaticMarkup(createElement(Header))
}

function siteFooter(): string {
  return renderToStaticMarkup(
    createElement(SimpleFooter, {
      note: 'Las guías son borradores de demo, con fuentes citadas y pendientes de verificación; no reemplazan a un contador ni a un abogado.',
    }),
  )
}

// ─── Página de artículo ───

export function renderArticlePage(a: Article, ctx: PageContext): string {
  const url = ctx.siteUrl + articlePath(a)
  const country = BLOG_COUNTRIES.find((c) => c.code === a.country)?.name ?? a.country
  const pageTitle = `${a.title} | ${copy.brand.name}`

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    inLanguage: a.lang,
    // No llevamos fecha de primera publicación aparte: es un borrador de demo
    datePublished: a.updatedAt,
    dateModified: a.updatedAt,
    author: { '@type': 'Organization', name: a.author },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: a.keyword,
  }
  // Google dejó de mostrar el rich result de FAQ (2026); se mantiene por los LLM y porque la FAQ está visible abajo.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: a.lang,
    mainEntity: a.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${ctx.siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Guías', item: `${ctx.siteUrl}/blog/` },
      { '@type': 'ListItem', position: 3, name: a.title, item: url },
    ],
  }

  const verify = a.verifyNotes.length
    ? `<aside class="mt-10 rounded-xl border-2 border-[#AC8F00] bg-[#FFF1B8] p-5" aria-labelledby="verify-title">
<h2 id="verify-title" class="text-xl font-extrabold text-warning-text">Pendiente de verificación</h2>
<p class="mt-1 text-sm text-warning-text">Esto es un borrador (${esc(a.status)}). Antes de publicarlo hay que confirmar:</p>
<ul class="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink">${a.verifyNotes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
</aside>`
    : ''

  const faq = `<section class="mt-10" aria-labelledby="faq-title">
<h2 id="faq-title" class="text-[28px] font-extrabold leading-tight">Preguntas frecuentes</h2>
<div class="mt-4 space-y-5">${a.faq
    .map(
      (f) =>
        `<div><h3 class="text-lg font-bold">${esc(f.q)}</h3><p class="mt-1 text-body">${esc(f.a)}</p></div>`,
    )
    .join('')}</div>
</section>`

  const sources = `<section class="mt-10" aria-labelledby="sources-title">
<h2 id="sources-title" class="text-[28px] font-extrabold leading-tight">Fuentes</h2>
<ul class="mt-3 list-disc space-y-1.5 pl-6 text-[15px]">${a.sources
    .map(
      (s) =>
        `<li><a class="font-medium text-blue-500 underline underline-offset-2 hover:text-blue-700" href="${esc(s.url)}" rel="noopener noreferrer">${esc(s.label)}</a></li>`,
    )
    .join('')}</ul>
</section>`

  const cta = `<aside class="mt-10 rounded-2xl bg-night p-6 text-white" aria-labelledby="cta-title">
<h2 id="cta-title" class="font-display text-2xl font-extrabold text-white">Mirá cómo está tu local</h2>
<p class="mt-2 text-blue-100">${esc(a.cta.text)}</p>
<a href="/" class="btn mt-4 bg-white text-ink hover:bg-cream">Hacer el diagnóstico gratis</a>
</aside>`

  const body = `<main class="mx-auto max-w-3xl px-4 pb-8 pt-6 sm:pt-10">
<nav aria-label="Breadcrumb" class="text-sm text-muted">
<ol class="flex flex-wrap items-center gap-x-2"><li><a class="inline-flex min-h-touch items-center underline" href="/">Inicio</a></li><li aria-hidden="true">›</li><li><a class="inline-flex min-h-touch items-center underline" href="/blog/#${a.country.toLowerCase()}">Guías de ${esc(country)}</a></li></ol>
</nav>
<article>
<header>
<p class="eyebrow mb-2">${esc(country)}</p>
<h1 class="text-[32px] font-extrabold leading-[1.1] sm:text-5xl">${esc(a.title)}</h1>
<p class="mt-3 text-sm text-muted">Por ${esc(a.author)} · Actualizado el <time datetime="${esc(a.updatedAt)}">${formatDateEs(a.updatedAt)}</time> · Borrador de demo</p>
</header>
<div class="prose-fudo mt-6">
${a.html}
</div>
${faq}
${sources}
${verify}
</article>
${cta}
</main>`

  return page({
    title: pageTitle,
    description: a.description,
    path: articlePath(a),
    lang: a.lang,
    type: 'article',
    jsonLd: [articleLd, faqLd, breadcrumbLd],
    body,
    ctx,
  })
}

// ─── Índice /blog/ ───

export function renderBlogIndex(articles: Article[], ctx: PageContext): string {
  const title = `Guías para dueños de restaurantes de Argentina, México, Chile y Colombia | ${copy.brand.name}`
  const description =
    'Guías con fuentes oficiales sobre facturación electrónica, comisiones de apps de delivery y presencia en Google para restaurantes, por país.'
  const sections = BLOG_COUNTRIES.map(({ code, name }) => {
    const list = articles.filter((a) => a.country === code)
    if (list.length === 0) return ''
    return `<section id="${code.toLowerCase()}" class="mt-10 scroll-mt-4" aria-labelledby="h-${code}">
<h2 id="h-${code}" class="text-3xl font-extrabold">${esc(name)}</h2>
<ul class="mt-4 space-y-4">${list
      .map(
        (a) =>
          `<li class="card"><h3 class="text-xl font-bold leading-snug"><a class="underline-offset-2 hover:underline" href="${articlePath(a)}">${esc(a.title)}</a></h3><p class="mt-2 text-body">${esc(a.description)}</p><p class="mt-2 text-sm text-muted">Actualizado el ${formatDateEs(a.updatedAt)}</p></li>`,
      )
      .join('')}</ul>
</section>`
  }).join('\n')

  const body = `<main class="mx-auto max-w-3xl px-4 pb-8 pt-8 sm:pt-12">
<nav aria-label="Breadcrumb" class="text-sm text-muted"><a class="inline-flex min-h-touch items-center underline" href="/">Inicio</a> › Guías</nav>
<p class="eyebrow mb-2 mt-2">Guías</p>
<h1 class="text-[32px] font-extrabold leading-[1.1] sm:text-5xl">Guías para dueños de restaurantes</h1>
<p class="mt-4 text-lg text-muted">Respuestas directas a las dudas que más se repiten, con fuentes oficiales y fecha. Son borradores de la demo: cada una dice qué falta verificar.</p>
${sections}
</main>`

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guías para dueños de restaurantes',
    description,
    inLanguage: 'es',
    url: `${ctx.siteUrl}/blog/`,
    hasPart: articles.map((a) => ({
      '@type': 'Article',
      headline: a.title,
      url: ctx.siteUrl + articlePath(a),
    })),
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${ctx.siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Guías', item: `${ctx.siteUrl}/blog/` },
    ],
  }
  return page({
    title,
    description,
    path: '/blog/',
    lang: 'es',
    type: 'website',
    jsonLd: [collectionLd, breadcrumbLd],
    body,
    ctx,
  })
}

// ─── sitemap.xml, llms.txt ───

export interface LandingLink {
  /** "AR" */
  code: string
  country: string
  /** "/ar/" */
  path: string
  title: string
}

export function renderSitemap(
  articles: Article[],
  siteUrl: string,
  today: string,
  landings: LandingLink[] = [],
): string {
  const urls = [
    { loc: `${siteUrl}/`, lastmod: today },
    ...landings.map((l) => ({ loc: siteUrl + l.path, lastmod: today })),
    {
      loc: `${siteUrl}/blog/`,
      lastmod:
        articles
          .map((a) => a.updatedAt)
          .sort()
          .at(-1) ?? today,
    },
    ...articles.map((a) => ({ loc: siteUrl + articlePath(a), lastmod: a.updatedAt })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`
}

/** Formato de la propuesta llmstxt.org (no es un estándar; Google dice que no lo usa). */
export function renderLlmsTxt(
  articles: Article[],
  siteUrl: string,
  landings: LandingLink[] = [],
): string {
  const lines = [
    `# ${copy.brand.name} para restaurantes`,
    '',
    '> Herramienta gratuita que diagnostica la presencia online de un restaurante (ficha de Google, reseñas, web, apps de delivery y operación) y estima cuánta plata se le escapa por mes. Demo de entrevista: los datos de los locales son reales y fechados; la plata perdida y la cuenta precargada son simulados.',
    '',
    '## Herramienta',
    '',
    `- [Diagnóstico gratis](${siteUrl}/): buscá tu local y recibí una nota por área, recomendaciones y una estimación de la plata que se escapa`,
    '',
  ]
  if (landings.length > 0) {
    lines.push('## Diagnóstico por país', '')
    for (const l of landings) lines.push(`- [${l.country}](${siteUrl + l.path}): ${l.title}`)
    lines.push('')
  }
  for (const { code, name } of BLOG_COUNTRIES) {
    const list = articles.filter((a) => a.country === code)
    if (list.length === 0) continue
    lines.push(`## Guías: ${name}`, '')
    for (const a of list) {
      lines.push(`- [${a.title}](${siteUrl + articlePath(a)}): ${a.description}`)
    }
    lines.push('')
  }
  lines.push(
    '## Notas',
    '',
    '- Las guías son borradores de demo, con fuentes citadas y una lista de lo pendiente de verificar al final de cada una.',
  )
  return lines.join('\n') + '\n'
}
