import { describe, expect, it } from 'vitest'
import { ASSUMPTIONS, estimateMoneyLost } from '../src/domain/moneyLost'
import { scoreProfile } from '../src/domain/scoring'
import { answers, IDS, place } from './helpers'

async function estimate(id: string, a = answers(), country: 'AR' | 'MX' = 'AR') {
  const p = await place(id)
  return estimateMoneyLost(p, a, scoreProfile(p, a), country)
}

describe('plata que se escapa por mes', () => {
  it('siempre se declara como estimación simulada', async () => {
    expect((await estimate(IDS.campeon)).simulated).toBe(true)
  })

  it('el total es la suma de sus partes y el rango lo rodea', async () => {
    const m = await estimate(IDS.campeon)
    expect(m.total).toBe(m.lines.reduce((s, l) => s + l.amount, 0))
    expect(m.low).toBeLessThanOrEqual(m.total)
    expect(m.high).toBeGreaterThanOrEqual(m.total)
    expect(m.total).toBeGreaterThan(0)
  })

  it('la cuenta se puede reconstruir a mano con los supuestos', async () => {
    const m = await estimate(IDS.campeon, answers({ billing: 'manual', channels: ['apps'] }))
    const sales = ASSUMPTIONS.ordersPerMonth.alto * ASSUMPTIONS.avgTicket.AR
    expect(m.inputs.monthlySales).toBe(sales)
    const apps = m.lines.find((l) => l.id === 'apps')?.amount as number
    const expected =
      sales * ASSUMPTIONS.appShare * ASSUMPTIONS.appCommission * ASSUMPTIONS.redirectableShare
    expect(Math.abs(apps - expected)).toBeLessThanOrEqual(ASSUMPTIONS.roundTo.AR / 2)
  })

  it('con canal propio no cuenta comisión recuperable', async () => {
    const m = await estimate(IDS.campeon, answers({ channels: ['apps', 'delivery-propio'] }))
    expect(m.lines.find((l) => l.id === 'apps')?.amount).toBe(0)
  })

  it('con sistema de gestión no hay merma por cobro a mano', async () => {
    const m = await estimate(IDS.campeon, answers({ billing: 'otro-sistema' }))
    expect(m.lines.find((l) => l.id === 'billing')?.amount).toBe(0)
  })

  it('más locales, más plata en juego', async () => {
    const one = await estimate(IDS.campeon, answers({ locals: '1' }))
    const many = await estimate(IDS.campeon, answers({ locals: '2-3' }))
    expect(many.total).toBeGreaterThan(one.total)
  })

  it('usa la moneda del país: el mismo perfil en MX da un monto en otra escala', async () => {
    const ar = await estimate(IDS.reds, answers(), 'AR')
    const mx = await estimate(IDS.reds, answers(), 'MX')
    expect(mx.country).toBe('MX')
    expect(mx.total).toBeLessThan(ar.total)
    expect(mx.total % ASSUMPTIONS.roundTo.MX).toBe(0)
  })
})
