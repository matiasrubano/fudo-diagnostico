import { appsFound, type Scorecard } from './scoring'
import { volumeOf, type Volume } from './leadTier'
import type { Answers, CountryCode, PlaceProfile } from './types'

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
  /** Comisión de las apps sobre la venta. AR: nota de iProfesional (14/05/2026) cita 25%–35% (PedidosYa) y hasta 25% (Rappi). En el resto de los países es un SUPUESTO. */
  appCommission: 0.25,
  /** De los pedidos por apps, cuántos se podrían pasar a un canal propio (sin comisión). SUPUESTO conservador. */
  redirectableShare: 0.15,
  /** Ventas que no llegan por tener la ficha de Google incompleta, al 0% de la nota de Google. SUPUESTO. */
  googleGapLoss: 0.04,
  /** Merma por cobro/facturación a mano (errores, descuadres, tiempo), como % de las ventas. SUPUESTO. */
  billingLoss: { manual: 0.015, terminal: 0.008, 'otro-sistema': 0 },
  /** El rango que mostramos alrededor de la estimación (la cuenta es gruesa). */
  range: { low: 0.6, high: 1.4 },
  /** Se redondea el monto a este múltiplo, para no aparentar precisión que no hay. */
  roundTo: { AR: 1000, MX: 100, CL: 1000, CO: 10000, BR: 10 } satisfies Record<CountryCode, number>,
}

export interface MoneyLine {
  /** clave del texto en copy.ts */
  id: 'apps' | 'google' | 'billing'
  amount: number
}

export interface MoneyEstimate {
  /** siempre true: el número es una estimación simulada */
  simulated: true
  country: CountryCode
  total: number
  low: number
  high: number
  lines: MoneyLine[]
  /** insumos intermedios, para mostrar la cuenta paso a paso */
  inputs: {
    volume: Volume
    ordersPerMonth: number
    avgTicket: number
    localsFactor: number
    monthlySales: number
    appShare: number
  }
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

export function estimateMoneyLost(
  profile: PlaceProfile,
  answers: Answers,
  scorecard: Scorecard,
  country: CountryCode,
): MoneyEstimate {
  const a = ASSUMPTIONS
  const volume = volumeOf(profile.fields.reviewCount)
  const ordersPerMonth = a.ordersPerMonth[volume]
  const avgTicket = a.avgTicket[country]
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
  const apps = hasOwnChannel ? 0 : monthlySales * appShare * a.appCommission * a.redirectableShare

  // 2) Ventas que no llegan por una ficha de Google incompleta (si no sabemos la nota, no inventamos)
  const googleScore = scorecard.areas.google.score
  const google =
    googleScore === null ? 0 : monthlySales * a.googleGapLoss * ((100 - googleScore) / 100)

  // 3) Merma por cobro/facturación a mano
  const billing = monthlySales * a.billingLoss[answers.billing]

  const step = a.roundTo[country]
  const lines: MoneyLine[] = [
    { id: 'apps', amount: roundTo(apps, step) },
    { id: 'google', amount: roundTo(google, step) },
    { id: 'billing', amount: roundTo(billing, step) },
  ]
  const total = lines.reduce((sum, l) => sum + l.amount, 0)
  return {
    simulated: true,
    country,
    total,
    low: roundTo(total * a.range.low, step),
    high: roundTo(total * a.range.high, step),
    lines,
    inputs: { volume, ordersPerMonth, avgTicket, localsFactor, monthlySales, appShare },
  }
}
