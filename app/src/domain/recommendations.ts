import type { CountryConfig } from '../config/countries.js'
import { copyFor, type RecsCopy } from '../content/copy.js'
import { withUtm } from './links.js'
import { formatRating } from './numbers.js'
import { appsFound, type Scorecard } from './scoring.js'
import type { Answers, AreaId, CountryCode, PlaceProfile } from './types.js'

// ═══════════════════════════════════════════════════════════════════════════
//  RECOMENDACIONES POR REGLAS (sin LLM: decisión D3)
//  Cada regla = cuándo aplica + a qué módulo de Fudo lleva. El TEXTO (voseo en AR, tuteo en MX/CL/CO)
//  vive en src/content/copy.ts → `recs`. Para agregar una regla: sumá un objeto a RULES y su texto a copy.ts.
//  Los links salen de docs/research/fudo-tools.md.
// ═══════════════════════════════════════════════════════════════════════════

export type ActionKind = 'free-tool' | 'paid-module' | 'guide'

export interface Recommendation {
  id: string
  area: AreaId
  /** mayor = más arriba */
  priority: number
  title: string
  body: string
  action: { kind: ActionKind; label: string; url: string }
}

export interface RecContext {
  profile: PlaceProfile
  answers: Answers
  scorecard: Scorecard
  country: CountryConfig
}

/** Cuántas recomendaciones se muestran como máximo */
export const MAX_RECOMMENDATIONS = 5

// ─── Herramientas gratis de Fudo (tools.fu.do) ───
const TOOLS = {
  googleSpecialist: {
    label: 'Tu Especialista en Google',
    url: 'https://tools.fu.do/perfil-de-google',
  },
  reviewAnalyst: { label: 'Tu Analista de Reseñas', url: 'https://tools.fu.do/analizar-resenas' },
  fudoSitios: { label: 'Fudo Sitios', url: 'https://sitios.fu.do/' },
  cartaQr: { label: 'Carta QR', url: 'https://tools.fu.do/carta-qr' },
  menuExpert: { label: 'Tu Experto en Menú', url: 'https://tools.fu.do/optimizar-menu' },
  guideGoogle: {
    label: 'Guía: posicionamiento en Google',
    url: 'https://tools.fu.do/recursos/guia-para-mejorar-el-posicionamiento-de-tu-restaurante-en-google',
  },
  inventoryTemplate: {
    label: 'Plantilla de control de inventario',
    url: 'https://tools.fu.do/recursos/plantilla-de-control-de-inventario-gastronomico',
  },
  guideInstagram: {
    label: 'Guía: Instagram para restaurantes',
    url: 'https://tools.fu.do/recursos/instagram-para-restaurantes-recomendaciones-practicas-para-atraer-mas-clientes',
  },
  commissionsCalc: {
    label: 'Calculadora de comisiones',
    url: 'https://tools.fu.do/recursos/calculadora-de-comisiones-para-terminales',
  },
} as const

// ─── Módulos de producto: la ruta cambia por país (Brasil = Deli, en portugués) ───
type ModuleKey = 'gestion' | 'cobros' | 'delivery' | 'precios'
const MODULE_PATH: Record<ModuleKey, { es: string; pt: string }> = {
  gestion: { es: 'tu-gestion/', pt: 'sua-gestao/' },
  cobros: { es: 'tus-cobros/', pt: 'sua-gestao/' }, // Deli no lista una página de cobros: va a gestión
  delivery: { es: 'tu-delivery/', pt: 'delivery/' },
  precios: { es: 'precios/', pt: 'pre%C3%A7os/' },
}

export function moduleUrl(country: CountryConfig, key: ModuleKey): string {
  const path = MODULE_PATH[key][country.code === 'BR' ? 'pt' : 'es']
  return country.fudoSiteUrl + path
}

// ─── Textos que cambian por país ───
const BILLING_PITCH: Record<CountryCode, string> = {
  AR: 'Fudo es compatible con impresoras fiscales Epson y Hasar, y tiene el módulo de Facturación Electrónica para ARCA.',
  MX: 'Fudo tiene el módulo de Facturación Electrónica para emitir CFDI ante el SAT.',
  CL: 'Fudo tiene facturación electrónica para el SII (hay tutorial en su centro de ayuda).',
  CO: 'Fudo tiene el módulo de Facturación Electrónica para la DIAN.',
  BR: 'Deli emite notas fiscales (NFC-e) desde el Plano Pro.',
}

/** Único país con cifra de comisión publicada en nuestras fuentes (countries.json → iProfesional, 14/05/2026) */
const COMMISSION_FACT: Partial<Record<CountryCode, string>> = {
  AR: 'En Argentina la prensa informa comisiones de PedidosYa de 25% a 35% de la venta (iProfesional, 14/05/2026).',
}

/** Nombre corto del ente fiscal para títulos (en countries.json BR trae el nombre completo) */
const FISCAL_SHORT: Partial<Record<CountryCode, string>> = { BR: 'NFC-e' }

function appNames(ctx: RecContext): string {
  const names = ctx.country.deliveryApps.slice(0, 2).map((a) => a.name)
  return names.join(' y ')
}

interface Rule {
  id: string
  area: AreaId
  /** suma al puntaje de prioridad (los temas de dinero van primero) */
  bonus: number
  when: (ctx: RecContext) => boolean
  /** `t` = textos del país del local (voseo o tuteo, ver src/content/copy.ts → copyFor) */
  build: (ctx: RecContext, t: RecsCopy) => Pick<Recommendation, 'title' | 'body' | 'action'>
}

const free = (tool: { label: string; url: string }) => ({ kind: 'free-tool' as const, ...tool })
const guide = (g: { label: string; url: string }) => ({ kind: 'guide' as const, ...g })
const paid = (label: string, url: string) => ({ kind: 'paid-module' as const, label, url })

/** Primera frase de la recomendación de delivery: depende de los canales que marcó el dueño. */
function deliveryIntro(ctx: RecContext, t: RecsCopy['deliveryCommission']): string {
  const { channels } = ctx.answers
  const apps = `${appNames(ctx)}, entre otras`
  const salon = channels.includes('salon')
  const counter = channels.includes('mostrador')
  if (!channels.includes('apps')) return t.unmarked(appsFound(ctx.profile), apps)
  if (!salon && !counter) return t.onlyApps(apps)
  return t.withOthers(
    salon && counter ? t.where.both : salon ? t.where.salon : t.where.mostrador,
    apps,
  )
}

// Cada regla = cuándo aplica + a qué módulo lleva. Los textos están en src/content/copy.ts (copyFor(país).recs).
const RULES: Rule[] = [
  {
    id: 'google-hours',
    area: 'google',
    bonus: 10,
    when: ({ profile }) => profile.fields.openingHours.status !== 'found',
    build: ({ profile }, t) => ({
      title: t.googleHours.title,
      body:
        profile.fields.openingHours.status === 'absent'
          ? t.googleHours.bodyAbsent
          : t.googleHours.bodyUnknown,
      action: free(TOOLS.googleSpecialist),
    }),
  },
  {
    id: 'google-listing',
    area: 'google',
    bonus: 0,
    when: ({ scorecard }) => (scorecard.areas.google.score ?? 100) < 70,
    build: (_ctx, t) => ({
      title: t.googleListing.title,
      body: t.googleListing.body,
      action: free(TOOLS.googleSpecialist),
    }),
  },
  {
    id: 'reviews-few',
    area: 'reviews',
    bonus: 10,
    when: ({ profile }) => (profile.fields.reviewCount.value ?? Infinity) < 50,
    build: ({ profile }, t) => ({
      title: t.reviewsFew.title,
      body: t.reviewsFew.body(String(profile.fields.reviewCount.value ?? 'muy pocas')),
      action: guide(TOOLS.guideGoogle),
    }),
  },
  {
    id: 'reviews-rating',
    area: 'reviews',
    bonus: 10,
    when: ({ profile }) => (profile.fields.rating.value ?? 5) < 4.0,
    build: ({ profile, country }, t) => ({
      title: t.reviewsRating.title,
      body: t.reviewsRating.body(formatRating(profile.fields.rating.value ?? 0, country.code)),
      action: free(TOOLS.reviewAnalyst),
    }),
  },
  {
    id: 'web-missing',
    area: 'web',
    bonus: 5,
    when: ({ profile }) => profile.fields.website.status === 'absent',
    build: (_ctx, t) => ({
      title: t.webMissing.title,
      body: t.webMissing.body,
      action: free(TOOLS.fudoSitios),
    }),
  },
  {
    id: 'instagram-missing',
    area: 'web',
    bonus: 0,
    when: ({ profile }) => profile.fields.instagram.status === 'absent',
    build: (_ctx, t) => ({
      title: t.instagramMissing.title,
      body: t.instagramMissing.body,
      action: guide(TOOLS.guideInstagram),
    }),
  },
  {
    id: 'carta-qr',
    area: 'web',
    bonus: 0,
    when: ({ answers, profile }) =>
      answers.channels.includes('salon') && profile.fields.website.status === 'absent',
    build: (_ctx, t) => ({
      title: t.cartaQr.title,
      body: t.cartaQr.body,
      action: free(TOOLS.cartaQr),
    }),
  },
  {
    id: 'delivery-commission',
    area: 'delivery',
    bonus: 25,
    when: ({ profile, answers }) =>
      (answers.channels.includes('apps') || appsFound(profile) > 0) &&
      !answers.channels.includes('delivery-propio'),
    build: (ctx, t) => ({
      title: t.deliveryCommission.title,
      body: `${deliveryIntro(ctx, t.deliveryCommission)} ${COMMISSION_FACT[ctx.country.code] ?? t.deliveryCommission.commissionGeneric} ${t.deliveryCommission.closing}`,
      action: paid(`Tu Delivery (${ctx.country.productName})`, moduleUrl(ctx.country, 'delivery')),
    }),
  },
  {
    id: 'delivery-centralize',
    area: 'delivery',
    bonus: 15,
    when: ({ profile, answers }) => appsFound(profile) >= 2 && answers.billing !== 'otro-sistema',
    build: (ctx, t) => ({
      title: t.deliveryCentralize.title,
      body: t.deliveryCentralize.body(appsFound(ctx.profile)),
      action: paid(`Delivery Apps (${ctx.country.productName})`, moduleUrl(ctx.country, 'gestion')),
    }),
  },
  {
    id: 'delivery-one-app',
    area: 'delivery',
    bonus: 0,
    when: ({ profile }) => appsFound(profile) === 1,
    build: (ctx, t) => ({
      title: t.deliveryOneApp.title,
      body: t.deliveryOneApp.body(ctx.country.name, appNames(ctx)),
      action: free(TOOLS.commissionsCalc),
    }),
  },
  {
    id: 'ops-billing-manual',
    area: 'operation',
    bonus: 25,
    when: ({ answers }) => answers.billing === 'manual',
    build: (ctx, t) => ({
      title: t.opsBillingManual.title(
        FISCAL_SHORT[ctx.country.code] ?? ctx.country.fiscal.authority,
      ),
      body: t.opsBillingManual.body(BILLING_PITCH[ctx.country.code]),
      action: paid(`Tus Cobros (${ctx.country.productName})`, moduleUrl(ctx.country, 'cobros')),
    }),
  },
  {
    id: 'ops-terminal-only',
    area: 'operation',
    bonus: 10,
    when: ({ answers }) => answers.billing === 'terminal',
    build: (ctx, t) => ({
      title: t.opsTerminalOnly.title,
      body: t.opsTerminalOnly.body,
      action: paid(`Tu Gestión (${ctx.country.productName})`, moduleUrl(ctx.country, 'gestion')),
    }),
  },
  {
    id: 'ops-multi-local',
    area: 'operation',
    bonus: 15,
    when: ({ answers }) => answers.locals !== '1' && answers.billing !== 'otro-sistema',
    build: (ctx, t) => ({
      title: t.opsMultiLocal.title,
      body: t.opsMultiLocal.body,
      action: paid('Multi-local: hablar con ventas', moduleUrl(ctx.country, 'precios')),
    }),
  },
]

/** Recomendaciones ordenadas por impacto: la brecha de su área + el bonus de la regla. */
export function buildRecommendations(
  ctx: RecContext,
  max: number = MAX_RECOMMENDATIONS,
): Recommendation[] {
  const t = copyFor(ctx.country.code).recs
  const recs = RULES.filter((rule) => rule.when(ctx)).map((rule) => {
    const gap = 100 - (ctx.scorecard.areas[rule.area].score ?? 50)
    const built = rule.build(ctx, t)
    return {
      id: rule.id,
      area: rule.area,
      priority: gap + rule.bonus,
      ...built,
      action: { ...built.action, url: withUtm(built.action.url, rule.area) },
    }
  })
  recs.sort((a, b) => b.priority - a.priority)

  if (recs.length === 0) {
    // Nada para corregir: igual dejamos un próximo paso útil
    return [
      {
        id: 'all-good',
        area: 'reviews',
        priority: 0,
        title: t.allGood.title,
        body: t.allGood.body,
        action: { ...free(TOOLS.reviewAnalyst), url: withUtm(TOOLS.reviewAnalyst.url, 'reviews') },
      },
    ]
  }
  return recs.slice(0, max)
}

// Se exporta para que otros módulos (p. ej. el ruteo "nutrir") elijan descargables sin duplicar links.
export const FREE_RESOURCES = {
  google: TOOLS.guideGoogle,
  reviews: TOOLS.reviewAnalyst,
  web: TOOLS.guideInstagram,
  delivery: TOOLS.commissionsCalc,
  operation: TOOLS.inventoryTemplate,
} as const satisfies Record<AreaId, { label: string; url: string }>
