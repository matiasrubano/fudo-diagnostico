import { appsFound, type Scorecard } from './scoring.js'
import { volumeOf, type Volume } from './leadTier.js'
import type { Answers, CountryCode, PlaceProfile } from './types.js'

// ═══════════════════════════════════════════════════════════════════════════
//  "CUÁNTA PLATA SE TE ESCAPA POR MES"  ·  ESTIMACIÓN SIMULADA
//  No es un dato real ni una promesa: es una cuenta con supuestos visibles.
//  La UI muestra cada supuesto en "¿Cómo calculamos esto?". Cambiá los números acá.
// ═══════════════════════════════════════════════════════════════════════════
export const ASSUMPTIONS = {
  /** Pedidos por mes y por local según el volumen proxy (reseñas). SUPUESTO de la demo. */
  ordersPerMonth: { bajo: 400, medio: 1500, alto: 4000, desconocido: 1000 } satisfies Record<
    Volume,
    number
  >,
  /** Ticket promedio por pedido, en moneda local. SUPUESTO de la demo (editable por país). */
  avgTicket: { AR: 15000, MX: 200, CL: 9000, CO: 40000, BR: 70 } satisfies Record<
    CountryCode,
    number
  >,
  /** Multiplicador por cantidad de locales. */
  localsFactor: { '1': 1, '2-3': 2.5, '4+': 4 },
  /** Parte de los pedidos que entra por apps de delivery (si vende por apps). SUPUESTO. */
  appShare: 0.35,
  /** Parte de los pedidos que entra por apps cuando es dark kitchen (solo vende por apps). SUPUESTO. */
  appShareDarkKitchen: 0.9,
  /** Comisión de las apps sobre la venta. Es un SUPUESTO (el piso de lo publicado); la fuente de cada país está en COMMISSION_SOURCES. */
  appCommission: 0.25,
  /** De los pedidos por apps, cuántos se podrían pasar a un canal propio (sin comisión). SUPUESTO conservador. */
  redirectableShare: 0.15,
  /** Ventas que no llegan por tener la ficha de Google incompleta, al 0% de la nota de Google. SUPUESTO. */
  googleGapLoss: 0.04,
  /** Merma por cobro/facturación a mano (errores, descuadres, tiempo), como % de las ventas. SUPUESTO. */
  billingLoss: { manual: 0.015, terminal: 0.008, 'otro-sistema': 0, 'app-paga': 0 },
  /** El rango que mostramos alrededor de la estimación (la cuenta es gruesa). */
  range: { low: 0.6, high: 1.4 },
  /** Se redondea el monto a este múltiplo, para no aparentar precisión que no hay. */
  roundTo: { AR: 1000, MX: 100, CL: 1000, CO: 10000, BR: 10 } satisfies Record<CountryCode, number>,
}

/** Lo que se sabe en público sobre la comisión de las apps en un país, con fuente y fecha (no inventamos cifras). */
export interface CommissionSource {
  /** lo que dice la fuente, sin interpretar */
  claim: string
  label: string
  /** dd/mm/aaaa */
  date: string
  url: string
}

/**
 * Fuentes de la comisión por país. Solo hay dato público en AR y MX (docs/research/paises.md y geo-blog.md);
 * en CL, CO y BR la UI dice "sin dato público en <país>: usamos X% (supuesto)".
 */
export const COMMISSION_SOURCES: Partial<Record<CountryCode, CommissionSource>> = {
  AR: {
    claim:
      'la prensa informa comisiones de PedidosYa de 25% a 35% de la venta (Rappi declara hasta 25%)',
    label: 'iProfesional',
    date: '14/05/2026',
    url: 'https://www.iprofesional.com/negocios/454816-mas-pedidos-y-cargos-de-hasta-35-por-cento-la-presion-del-delivery-sobre-comercios-y-repartidores',
  },
  MX: {
    claim: 'Uber Eats publicó planes de comisión de 25% a 30% de la venta',
    label: 'Uber Eats México',
    date: '13/03/2024',
    url: 'https://www.uber.com/es-MX/newsroom/uber-eats-comisiones-para-pymes-mexico',
  },
}

/** Los números propios del dueño: pisan la estimación por reseñas (opcionales, de a uno) */
export interface MoneyOverrides {
  ordersPerMonth?: number
  avgTicket?: number
}

/** Tope de lo que se acepta como "pedidos por mes" o "ticket": evita desbordes y números absurdos */
export const MAX_OVERRIDE = 1_000_000_000

/** Un número del dueño sirve si es finito y positivo; si no, se usa la estimación. */
function usable(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= MAX_OVERRIDE
}

export interface MoneyLine {
  /** clave del texto en copy.ts */
  id: 'apps' | 'google' | 'billing'
  /** ya redondeado: el total es la suma de estos montos */
  amount: number
  /** los multiplicadores de las ventas, en orden: monto ≈ ventas × f1 × f2 × … (para mostrar la cuenta tal cual se hizo) */
  factors: number[]
}

/** Un supuesto que la cuenta usó de verdad (la UI lista solo estos, así la lista coincide con la cuenta) */
export interface UsedAssumption {
  id:
    | 'orders'
    | 'ticket'
    | 'appShare'
    | 'appShareDarkKitchen'
    | 'appCommission'
    | 'redirectableShare'
    | 'googleGapLoss'
    | 'billingManual'
    | 'billingTerminal'
  /** pedidos y ticket en números; el resto, en fracción (0,35 = 35%) */
  value: number
  /** true si es un número del dueño y no el supuesto de la demo */
  custom?: boolean
}

export interface MoneyEstimate {
  /** siempre true: el número es una estimación simulada */
  simulated: true
  country: CountryCode
  total: number
  low: number
  high: number
  lines: MoneyLine[]
  /** los supuestos que usó la cuenta, en el orden en que se aplican */
  assumptionsUsed: UsedAssumption[]
  /** insumos intermedios, para mostrar la cuenta paso a paso */
  inputs: {
    volume: Volume
    ordersPerMonth: number
    avgTicket: number
    localsFactor: number
    monthlySales: number
    appShare: number
    /** parte de las ventas que se puede recuperar de las apps = comisión (solo si hay pedidos por apps) */
    appCommission: number
    /** true = el dueño puso sus propios pedidos / su propio ticket */
    customOrders: boolean
    customTicket: boolean
    /** lo que da la estimación por reseñas, para poder volver a ella */
    estimatedOrdersPerMonth: number
    estimatedAvgTicket: number
  }
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

/**
 * Función pura: mismas entradas, mismo resultado. `overrides` = los números del dueño ("Pedidos por mes" y
 * "Ticket promedio" de la sección "¿Cómo calculamos esto?"): la UI la vuelve a llamar en cada tecla.
 * Lo que se muestra sale de acá: ventas = pedidos × ticket × locales, y cada línea = ventas × sus porcentajes.
 */
export function estimateMoneyLost(
  profile: PlaceProfile,
  answers: Answers,
  scorecard: Scorecard,
  country: CountryCode,
  overrides: MoneyOverrides = {},
): MoneyEstimate {
  const a = ASSUMPTIONS
  const volume = volumeOf(profile.fields.reviewCount)
  const estimatedOrders = a.ordersPerMonth[volume]
  const estimatedTicket = a.avgTicket[country]
  const customOrders = usable(overrides.ordersPerMonth)
  const customTicket = usable(overrides.avgTicket)
  const ordersPerMonth = customOrders ? (overrides.ordersPerMonth as number) : estimatedOrders
  const avgTicket = customTicket ? (overrides.avgTicket as number) : estimatedTicket
  const localsFactor = a.localsFactor[answers.locals]
  const monthlySales = ordersPerMonth * avgTicket * localsFactor

  // 1) Comisión de apps que se podría ahorrar pasando parte de los pedidos a un canal propio
  const sellsByApps = answers.channels.includes('apps') || appsFound(profile) > 0
  const appShare = sellsByApps
    ? answers.businessType === 'dark-kitchen'
      ? a.appShareDarkKitchen
      : a.appShare
    : 0
  const hasOwnChannel = answers.channels.includes('delivery-propio')
  const appsFactors = [appShare, a.appCommission, a.redirectableShare]
  const apps = hasOwnChannel ? 0 : monthlySales * appsFactors.reduce((x, y) => x * y, 1)

  // 2) Ventas que no llegan por una ficha de Google incompleta (si no sabemos la nota, no inventamos)
  const googleScore = scorecard.areas.google.score
  const googleFactors = [a.googleGapLoss, googleScore === null ? 0 : (100 - googleScore) / 100]
  const google = monthlySales * googleFactors.reduce((x, y) => x * y, 1)

  // 3) Merma por cobro/facturación a mano
  const billingFactors = [a.billingLoss[answers.billing]]
  const billing = monthlySales * billingFactors[0]!

  const step = a.roundTo[country]
  const lines: MoneyLine[] = [
    { id: 'apps', amount: roundTo(apps, step), factors: hasOwnChannel ? [0] : appsFactors },
    { id: 'google', amount: roundTo(google, step), factors: googleFactors },
    { id: 'billing', amount: roundTo(billing, step), factors: billingFactors },
  ]
  const total = lines.reduce((sum, l) => sum + l.amount, 0)
  const used: UsedAssumption[] = [
    { id: 'orders', value: ordersPerMonth, custom: customOrders },
    { id: 'ticket', value: avgTicket, custom: customTicket },
  ]
  if (apps > 0) {
    used.push(
      {
        id: answers.businessType === 'dark-kitchen' ? 'appShareDarkKitchen' : 'appShare',
        value: appShare,
      },
      { id: 'appCommission', value: a.appCommission },
      { id: 'redirectableShare', value: a.redirectableShare },
    )
  }
  if (google > 0) used.push({ id: 'googleGapLoss', value: a.googleGapLoss })
  if (billing > 0) {
    used.push({
      id: answers.billing === 'manual' ? 'billingManual' : 'billingTerminal',
      value: billingFactors[0]!,
    })
  }
  return {
    simulated: true,
    country,
    total,
    low: roundTo(total * a.range.low, step),
    high: roundTo(total * a.range.high, step),
    lines,
    assumptionsUsed: used,
    inputs: {
      volume,
      ordersPerMonth,
      avgTicket,
      localsFactor,
      monthlySales,
      appShare,
      appCommission: a.appCommission,
      customOrders,
      customTicket,
      estimatedOrdersPerMonth: estimatedOrders,
      estimatedAvgTicket: estimatedTicket,
    },
  }
}
