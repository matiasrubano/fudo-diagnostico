// Home y landings por país prerenderizadas: <head> específico (title, description, canonical, hreflang, OG, JSON-LD)
// + el mismo árbol de React que monta la app, en HTML estático. Funciones puras; scripts/prerender.ts escribe en dist/.
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getCountry } from '../src/config/countries'
import { copy, copyFor } from '../src/content/copy'
import { LANDING_COUNTRIES, type LandingCountry } from '../src/domain/showcase'
import type { ShowcaseResponse } from '../src/server/diagnosisService'
import { landingFacts, type GuideLink } from '../src/ui/screens/Home'
import { PAGE_DATA_ID, serializePageData, type PageData } from '../src/ui/pageData'
import { StaticPage } from '../src/ui/StaticPage'
import { esc, type LandingLink } from './blog'

const LOCALE: Record<LandingCountry, string> = {
  AR: 'es-AR',
  MX: 'es-MX',
  CL: 'es-CL',
  CO: 'es-CO',
}

export const landingPath = (code: LandingCountry) => `/${code.toLowerCase()}/`

export interface HeadMeta {
  title: string
  description: string
  /** "/" o "/ar/" */
  path: string
  /** valor de <html lang> */
  lang: string
  jsonLd: unknown[]
}

function ldJson(data: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

export function homeMeta(siteUrl: string): HeadMeta {
  return {
    title: copy.seo.homeTitle,
    description: copy.seo.homeDescription,
    path: '/',
    lang: 'es',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: copy.seo.appName,
        url: `${siteUrl}/`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: 'es',
        description: copy.seo.appDescription,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        areaServed: LANDING_COUNTRIES.map((code) => ({
          '@type': 'Country',
          name: getCountry(code).name,
        })),
        audience: {
          '@type': 'Audience',
          audienceType:
            'Dueños de restaurantes, bares y pizzerías de Argentina, México, Chile y Colombia',
        },
      },
    ],
  }
}

/** Title, description y JSON-LD de /ar/, /mx/, /cl/, /co/: salen de copyFor(país).landing + countries.json */
export function landingMeta(code: LandingCountry, siteUrl: string): HeadMeta {
  const v = copyFor(code).landing
  const facts = landingFacts(code)
  const url = siteUrl + landingPath(code)
  return {
    title: v.title(facts, v.fiscalPhrase),
    description: v.description(facts),
    path: landingPath(code),
    lang: LOCALE[code],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: `${copy.seo.appName} en ${facts.country}`,
        url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: LOCALE[code],
        description: v.description(facts),
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        areaServed: { '@type': 'Country', name: facts.country },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: v.breadcrumbHome, item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: facts.country, item: url },
        ],
      },
    ],
  }
}

/** hreflang entre la home (x-default) y las 4 landings; cada página se lista a sí misma */
export function alternates(siteUrl: string): { hreflang: string; href: string }[] {
  return [
    { hreflang: 'x-default', href: `${siteUrl}/` },
    ...LANDING_COUNTRIES.map((code) => ({
      hreflang: LOCALE[code],
      href: siteUrl + landingPath(code),
    })),
  ]
}

/** El bloque de <head> que reemplaza lo que hay entre <!--head:start--> y <!--head:end--> de index.html */
export function renderHead(meta: HeadMeta, siteUrl: string): string {
  const url = siteUrl + meta.path
  const ogLocale = meta.lang === 'es' ? 'es_AR' : meta.lang.replace('-', '_')
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    '<meta name="robots" content="index, follow, max-snippet:-1" />',
    ...alternates(siteUrl).map(
      (a) => `<link rel="alternate" hreflang="${esc(a.hreflang)}" href="${esc(a.href)}" />`,
    ),
    '<meta property="og:type" content="website" />',
    `<meta property="og:locale" content="${esc(ogLocale)}" />`,
    `<meta property="og:site_name" content="${esc(copy.seo.appName)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    '<meta name="twitter:card" content="summary" />',
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    ...meta.jsonLd.map(ldJson),
  ].join('\n    ')
}

/**
 * Convierte la plantilla (dist/index.html) en la home o en una landing: head propio, lang,
 * el árbol de React ya renderizado dentro de #root y los datos embebidos para que React arranque con lo mismo.
 */
export function renderPage(
  template: string,
  meta: HeadMeta,
  siteUrl: string,
  country: LandingCountry | null,
  showcase: ShowcaseResponse,
  guides: GuideLink[],
): string {
  const data: PageData = { country, showcase, guides }
  const root = renderToStaticMarkup(createElement(StaticPage, { country, showcase, guides }))
  const html = template
    .replace(/<!--head:start-->[\s\S]*?<!--head:end-->/, renderHead(meta, siteUrl))
    .replace('<html lang="es">', `<html lang="${esc(meta.lang)}">`)
    .replace(
      '<div id="root"><!--prerender:home--></div>',
      () =>
        `<div id="root">${root}</div>\n    <script type="application/json" id="${PAGE_DATA_ID}">${serializePageData(data)}</script>`,
    )
    .replaceAll('%SITE_URL%', siteUrl)
  if (!html.includes(`id="${PAGE_DATA_ID}"`))
    throw new Error('Falta <div id="root"> en la plantilla')
  return html
}

/** Datos para sitemap.xml y llms.txt */
export function landingLinks(siteUrl: string): LandingLink[] {
  return LANDING_COUNTRIES.map((code) => ({
    code,
    country: getCountry(code).name,
    path: landingPath(code),
    title: landingMeta(code, siteUrl).title,
  }))
}
