import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { getCountry } from '../src/config/countries'
import { copy, copyFor } from '../src/content/copy'
import { diagnose } from '../src/domain/diagnose'
import { classifyLead } from '../src/domain/leadTier'
import {
  ASSUMPTIONS,
  COMMISSION_SOURCES,
  estimateMoneyLost,
  MAX_OVERRIDE,
} from '../src/domain/moneyLost'
import { buildRecommendations } from '../src/domain/recommendations'
import { scoreProfile } from '../src/domain/scoring'
import { systemGuide } from '../src/domain/switcher'
import { COUNTRY_CODES } from '../src/domain/types'
import { parseAnswers } from '../src/server/diagnosisService'
import { evidenceFor } from '../src/ui/evidence'
import { RouteSection } from '../src/ui/screens/Routes'
import { answers, IDS, place } from './helpers'

const IDS_MORE = { holaGuero: 'mx-tacos-hola-el-guero-cdmx', federal: IDS.federal }

async function money(
  id: string,
  a = answers(),
  country: (typeof COUNTRY_CODES)[number] = 'AR',
  over = {},
) {
  const p = await place(id)
  return estimateMoneyLost(p, a, scoreProfile(p, a), country, over)
}

describe('"tus números": pedidos por mes y ticket del dueño', () => {
  it('sin números propios, es la estimación por reseñas', async () => {
    const m = await money(IDS.campeon)
    expect(m.inputs.customOrders).toBe(false)
    expect(m.inputs.customTicket).toBe(false)
    expect(m.inputs.ordersPerMonth).toBe(m.inputs.estimatedOrdersPerMonth)
    expect(m.inputs.avgTicket).toBe(ASSUMPTIONS.avgTicket.AR)
  })

  it('con pedidos y ticket propios la cuenta se recalcula (ventas = pedidos × ticket × locales)', async () => {
    const base = await money(IDS.campeon, answers({ locals: '2-3' }))
    const own = await money(IDS.campeon, answers({ locals: '2-3' }), 'AR', {
      ordersPerMonth: 1000,
      avgTicket: 10000,
    })
    expect(own.inputs.customOrders && own.inputs.customTicket).toBe(true)
    expect(own.inputs.monthlySales).toBe(1000 * 10000 * ASSUMPTIONS.localsFactor['2-3'])
    expect(own.total).toBeLessThan(base.total)
    // la fuente de cada supuesto se marca: el del dueño dice "tu número"
    expect(own.assumptionsUsed.filter((u) => u.custom).map((u) => u.id)).toEqual([
      'orders',
      'ticket',
    ])
  })

  it('se puede cambiar solo uno de los dos', async () => {
    const m = await money(IDS.campeon, answers(), 'AR', { ordersPerMonth: 500 })
    expect(m.inputs.customOrders).toBe(true)
    expect(m.inputs.customTicket).toBe(false)
    expect(m.inputs.monthlySales).toBe(500 * ASSUMPTIONS.avgTicket.AR)
  })

  it('un número inválido (0, negativo, NaN, desbordado) se ignora y vale la estimación', async () => {
    const base = await money(IDS.campeon)
    for (const bad of [0, -5, Number.NaN, Number.POSITIVE_INFINITY, MAX_OVERRIDE + 1]) {
      const m = await money(IDS.campeon, answers(), 'AR', { ordersPerMonth: bad, avgTicket: bad })
      expect(m.total, String(bad)).toBe(base.total)
      expect(m.inputs.customOrders || m.inputs.customTicket).toBe(false)
    }
  })

  it('es pura: mismas entradas, mismo resultado, y no toca los supuestos', async () => {
    const before = JSON.stringify(ASSUMPTIONS)
    const a = await money(IDS.campeon, answers(), 'AR', { ordersPerMonth: 777 })
    const b = await money(IDS.campeon, answers(), 'AR', { ordersPerMonth: 777 })
    expect(a).toEqual(b)
    expect(JSON.stringify(ASSUMPTIONS)).toBe(before)
  })
})

describe('la cuenta es consistente con lo que se muestra', () => {
  it('cada línea es ventas × sus porcentajes (la merma = % × ventas mostradas)', async () => {
    const m = await money(IDS.campeon, answers({ billing: 'manual', locals: '2-3' }), 'AR', {
      ordersPerMonth: 2000,
      avgTicket: 12000,
    })
    const step = ASSUMPTIONS.roundTo.AR
    for (const line of m.lines) {
      const expected = line.factors.reduce((x, y) => x * y, m.inputs.monthlySales)
      expect(Math.abs(line.amount - expected), line.id).toBeLessThanOrEqual(step / 2)
    }
    const billing = m.lines.find((l) => l.id === 'billing')!
    expect(billing.factors).toEqual([ASSUMPTIONS.billingLoss.manual])
    expect(m.total).toBe(m.lines.reduce((s, l) => s + l.amount, 0))
  })

  it('la lista de supuestos usados coincide con las líneas que suman', async () => {
    // vende por apps, cobra a mano: apps + google + merma
    const manual = await money(IDS.campeon, answers({ billing: 'manual' }))
    const ids = manual.assumptionsUsed.map((u) => u.id)
    expect(ids).toEqual(
      expect.arrayContaining([
        'orders',
        'ticket',
        'appShare',
        'appCommission',
        'redirectableShare',
        'billingManual',
      ]),
    )
    expect(ids).not.toContain('billingTerminal')
    expect(ids).not.toContain('appShareDarkKitchen')

    // con sistema y canal propio no hay comisión ni merma: no se listan
    const own = await money(
      IDS.campeon,
      answers({ billing: 'otro-sistema', channels: ['apps', 'delivery-propio'] }),
    )
    const ownIds = own.assumptionsUsed.map((u) => u.id)
    expect(ownIds).not.toContain('appCommission')
    expect(ownIds).not.toContain('billingManual')
    expect(ownIds).not.toContain('billingTerminal')

    // dark kitchen: se usa el 90% de apps y no el 35%
    const dk = await money(
      IDS.darkKitchen,
      answers({ businessType: 'dark-kitchen', channels: ['apps'], billing: 'terminal' }),
      'CO',
    )
    const dkIds = dk.assumptionsUsed.map((u) => u.id)
    expect(dkIds).toContain('appShareDarkKitchen')
    expect(dkIds).not.toContain('appShare')
    expect(dkIds).toContain('billingTerminal')
  })

  it('el valor listado de cada supuesto es el que usó la cuenta', async () => {
    const m = await money(IDS.campeon, answers({ billing: 'terminal' }))
    const value = (id: string) => m.assumptionsUsed.find((u) => u.id === id)?.value
    expect(value('billingTerminal')).toBe(ASSUMPTIONS.billingLoss.terminal)
    expect(value('appCommission')).toBe(ASSUMPTIONS.appCommission)
    // la merma de la terminal es 0,8%: el texto no lo redondea a "1%"
    expect(
      new Intl.NumberFormat('es-AR', { style: 'percent', maximumFractionDigits: 1 }).format(0.008),
    ).toBe('0,8%')
  })

  it('el texto de las ventas no repite "×" y nombra el factor de locales', () => {
    const one = copy.money.steps.sales('4.000', '$ 15.000', '$ 60.000.000')
    const many = copy.money.steps.salesMulti(
      '4.000',
      '$ 15.000',
      '2,5',
      '2 o 3 locales',
      '$ 150.000.000',
    )
    expect(one).not.toMatch(/×\s*×/)
    expect(many).not.toMatch(/×\s*×/)
    expect(many).toContain('2,5 (2 o 3 locales)')
  })

  it('la comisión se cita con fuente en AR y MX; en CL, CO y BR no hay dato público', () => {
    expect(COMMISSION_SOURCES.AR?.label).toBe('iProfesional')
    expect(COMMISSION_SOURCES.AR?.date).toBe('14/05/2026')
    expect(COMMISSION_SOURCES.MX?.label).toContain('Uber Eats')
    for (const code of ['CL', 'CO', 'BR'] as const) expect(COMMISSION_SOURCES[code]).toBeUndefined()
    for (const code of COUNTRY_CODES) {
      const source = COMMISSION_SOURCES[code]
      if (source) {
        expect(source.url).toMatch(/^https:\/\//)
        expect(source.claim).toMatch(/\d+%/)
      }
    }
    expect(copy.money.assumptions.commissionNone('Colombia', '25%')).toBe(
      'Sin dato público en Colombia: usamos 25% (supuesto)',
    )
  })
})

describe('"Me paga la app (no cobro directo)"', () => {
  it('no penaliza la operación como cobrar a mano', async () => {
    const p = await place(IDS.darkKitchen)
    const base = { businessType: 'dark-kitchen' as const, channels: ['apps' as const] }
    const manual = scoreProfile(p, answers({ ...base, billing: 'manual' })).areas.operation.score!
    const appPays = scoreProfile(p, answers({ ...base, billing: 'app-paga' })).areas.operation
      .score!
    const system = scoreProfile(p, answers({ ...base, billing: 'otro-sistema' })).areas.operation
      .score!
    expect(appPays).toBeGreaterThan(manual)
    expect(appPays).toBeLessThanOrEqual(system)
  })

  it('no recomienda facturar ante el ente fiscal: recomienda conciliar las liquidaciones', async () => {
    const p = await place(IDS.darkKitchen)
    const a = answers({ businessType: 'dark-kitchen', channels: ['apps'], billing: 'app-paga' })
    const recs = buildRecommendations(
      { profile: p, answers: a, scorecard: scoreProfile(p, a), country: getCountry('CO') },
      Infinity,
    )
    const ids = recs.map((r) => r.id)
    expect(ids).not.toContain('ops-billing-manual')
    expect(ids).toContain('ops-app-pays')
    const rec = recs.find((r) => r.id === 'ops-app-pays')!
    expect(rec.title).toBe('Concilia lo que te liquidan las apps')
    expect(rec.action.kind).toBe('paid-module')
    expect(rec.action.url).toContain('fu.do/es-co/tu-gestion/')
    expect(`${rec.title} ${rec.body}`).not.toMatch(/DIAN/)
  })

  it('en la cuenta no hay merma "a mano"', async () => {
    const m = await money(
      IDS.darkKitchen,
      answers({ businessType: 'dark-kitchen', channels: ['apps'], billing: 'app-paga' }),
      'CO',
    )
    expect(m.lines.find((l) => l.id === 'billing')?.amount).toBe(0)
    expect(m.assumptionsUsed.map((u) => u.id)).not.toContain('billingManual')
  })

  it('la API acepta la respuesta nueva, taquería, hamburguesería y el sistema de "otro sistema"', () => {
    const base = { channels: ['apps'], locals: '1' }
    expect(parseAnswers({ ...base, businessType: 'taqueria', billing: 'app-paga' })).not.toBeNull()
    expect(
      parseAnswers({ ...base, businessType: 'hamburgueseria', billing: 'manual' }),
    ).not.toBeNull()
    const sys = parseAnswers({
      ...base,
      businessType: 'bar',
      billing: 'otro-sistema',
      currentSystem: 'maxirest',
    })
    expect(sys?.currentSystem).toBe('maxirest')
    // "¿Cuál?" solo vale con otro sistema, y un sistema desconocido se descarta
    expect(
      parseAnswers({ ...base, businessType: 'bar', billing: 'manual', currentSystem: 'maxirest' })
        ?.currentSystem,
    ).toBeUndefined()
    expect(
      parseAnswers({ ...base, businessType: 'bar', billing: 'otro-sistema', currentSystem: 'nope' })
        ?.currentSystem,
    ).toBeUndefined()
  })
})

describe('dark kitchen sin reseñas', () => {
  it('el área de reseñas no cuenta en la nota general y se explica', async () => {
    const p = await place(IDS.darkKitchen)
    const a = answers({ businessType: 'dark-kitchen', channels: ['apps'], billing: 'app-paga' })
    const card = scoreProfile(p, a)
    const reviews = card.areas.reviews
    expect(reviews.applicable).toBe(false)
    expect(reviews.score).toBeNull()
    expect(reviews.note).toBe('dark-kitchen-no-reviews')
    expect(copy.result.areaNote['dark-kitchen-no-reviews']).toContain(
      'normal en un negocio solo de apps',
    )
    // la nota general sale de las otras áreas (el peso se reparte), no queda en blanco
    expect(card.overall).not.toBeNull()
  })

  it('un local con tipo distinto y sin reseñas NO se trata así (es un dato que no leímos)', async () => {
    const p = await place(IDS.darkKitchen)
    const card = scoreProfile(p, answers({ businessType: 'restaurante' }))
    expect(card.areas.reviews.note).toBeUndefined()
    expect(card.areas.reviews.applicable).toBe(true)
  })

  it('el motivo de la ruta no dice "vendés con volumen" cuando el volumen es desconocido', async () => {
    const p = await place(IDS.darkKitchen)
    const lead = classifyLead(
      p,
      answers({ businessType: 'dark-kitchen', channels: ['apps'], billing: 'app-paga' }),
    )
    expect(lead.tier).toBe('caliente')
    expect(lead.reasons).toEqual(['nucleo-sin-sistema-volumen-desconocido'])
    for (const code of ['AR', 'CO'] as const) {
      const text = copyFor(code).route.reasons[lead.reasons[0]!]
      expect(text).toMatch(/No pudimos medir tu volumen/)
      expect(text).not.toMatch(/con volumen/)
    }
  })

  it('"Canal propio: No" dice "no lo marcaste", no "tu respuesta"', async () => {
    const p = await place(IDS.darkKitchen)
    const d = diagnose(p, answers({ businessType: 'dark-kitchen', channels: ['apps'] }))
    expect(evidenceFor('ownChannel', d).text).toBe('No lo marcaste')
  })
})

describe('si el delivery no se pudo leer, la recomendación no asume en qué apps vende', () => {
  it('marcó apps pero no vimos su local en ninguna: no nombra apps como si lo supiéramos', async () => {
    const p = await place(IDS_MORE.holaGuero)
    const a = answers({
      businessType: 'taqueria',
      channels: ['salon', 'apps'],
      billing: 'otro-sistema',
    })
    const rec = buildRecommendations(
      { profile: p, answers: a, scorecard: scoreProfile(p, a), country: getCountry('MX') },
      Infinity,
    ).find((r) => r.id === 'delivery-commission')!
    expect(rec.body).toContain('no pudimos ver en cuáles figura tu local')
    expect(rec.body).not.toMatch(/Rappi|DiDi/) // no inventa en qué apps está
    expect(rec.body).toContain('Uber Eats México, 13/03/2024') // la comisión, con la fuente de México
  })

  it('en Chile y Colombia no hay cifra publicada: la frase es general, sin inventar', async () => {
    const p = await place(IDS.davvero)
    const a = answers({ channels: ['apps'] })
    const rec = buildRecommendations(
      { profile: p, answers: a, scorecard: scoreProfile(p, a), country: getCountry('CL') },
      Infinity,
    ).find((r) => r.id === 'delivery-commission')!
    expect(rec.body).toContain('Cada app cobra una comisión por venta.')
    expect(rec.body).not.toMatch(/\d+%/)
  })
})

describe('"Con otro sistema" pregunta cuál y el bloque switcher lo nombra', () => {
  it('Soft Restaurant en México: nombra el sistema y enlaza la guía de cambio', async () => {
    const p = await place(IDS_MORE.holaGuero)
    const d = diagnose(
      p,
      answers({
        businessType: 'taqueria',
        channels: ['salon', 'apps'],
        billing: 'otro-sistema',
        currentSystem: 'soft-restaurant',
      }),
    )
    expect(d.lead.tier).toBe('switcher')
    const html = renderToStaticMarkup(createElement(RouteSection, { d }))
    expect(html).toContain('Vienes de Soft Restaurant')
    expect(html).toContain('/blog/cambiar-de-soft-restaurant/')
  })

  it('otro sistema sin guía: lo nombra, pero no inventa un enlace', async () => {
    const p = await place(IDS_MORE.holaGuero)
    const d = diagnose(
      p,
      answers({ channels: ['salon', 'apps'], billing: 'otro-sistema', currentSystem: 'maxirest' }),
    )
    const html = renderToStaticMarkup(createElement(RouteSection, { d }))
    expect(html).toContain('Vienes de Maxirest')
    expect(html).not.toContain('/blog/cambiar-de')
  })

  it('"Otro" no se nombra y sin respuesta queda el texto de siempre', async () => {
    const p = await place(IDS_MORE.holaGuero)
    for (const currentSystem of ['otro', undefined] as const) {
      const d = diagnose(
        p,
        answers({ channels: ['salon', 'apps'], billing: 'otro-sistema', currentSystem }),
      )
      const html = renderToStaticMarkup(createElement(RouteSection, { d }))
      expect(html).not.toContain('Vienes de')
      expect(html).toContain('Ya tienes un sistema')
    }
  })

  it('solo Soft Restaurant en MX tiene guía', () => {
    expect(systemGuide('soft-restaurant', 'MX')).toBe('cambiar-de-soft-restaurant')
    expect(systemGuide('soft-restaurant', 'AR')).toBeNull()
    expect(systemGuide('maxirest', 'AR')).toBeNull()
    expect(systemGuide(undefined, 'MX')).toBeNull()
  })

  it('las opciones de la P1 y la P3 suman lo que faltaba', () => {
    const q = copy.questions.items
    expect(q.businessType.options.taqueria).toBe('Taquería')
    expect(q.businessType.options.hamburgueseria).toBe('Hamburguesería')
    expect(q.billing.options['app-paga']).toBe('Me paga la app (no cobro directo)')
    expect(Object.values(q.currentSystem.options)).toEqual([
      'Soft Restaurant',
      'Maxirest',
      'Bistrosoft',
      'Poster',
      'Toteat',
      'Loyverse',
      'Otro',
    ])
  })
})
