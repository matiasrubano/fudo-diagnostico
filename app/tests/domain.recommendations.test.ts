import { describe, expect, it } from 'vitest'
import { getCountry } from '../src/config/countries'
import { buildRecommendations, MAX_RECOMMENDATIONS } from '../src/domain/recommendations'
import { scoreProfile } from '../src/domain/scoring'
import type { Answers, CountryCode } from '../src/domain/types'
import { answers, IDS, place } from './helpers'

async function recs(id: string, country: CountryCode, a: Answers = answers(), max?: number) {
  const p = await place(id)
  return buildRecommendations(
    {
      profile: p,
      answers: a,
      scorecard: scoreProfile(p, a),
      country: getCountry(country),
    },
    max,
  )
}

describe('recomendaciones por reglas y por país', () => {
  it('AR: cobro a mano → ARCA y módulo en fu.do/es-ar', async () => {
    const list = await recs(IDS.piki, 'AR', answers({ billing: 'manual' }), Infinity)
    const billing = list.find((r) => r.id === 'ops-billing-manual')
    expect(billing).toBeDefined()
    expect(billing?.title).toContain('ARCA')
    expect(billing?.action.url).toContain('https://fu.do/es-ar/tus-cobros/')
    expect(billing?.action.kind).toBe('paid-module')
  })

  it('MX: mismo caso → SAT y módulo en fu.do/es-mx', async () => {
    const list = await recs(IDS.reds, 'MX', answers({ billing: 'manual' }))
    const billing = list.find((r) => r.id === 'ops-billing-manual')
    expect(billing?.title).toContain('SAT')
    expect(billing?.action.url).toContain('https://fu.do/es-mx/')
  })

  it('BR: usa la marca Deli y las URLs de deli.com.br', async () => {
    const list = await recs(IDS.diavola, 'BR', answers({ billing: 'manual' }))
    const billing = list.find((r) => r.id === 'ops-billing-manual')
    expect(billing?.action.label).toContain('Deli')
    expect(billing?.action.label).not.toContain('Fudo')
    expect(billing?.action.url).toContain('https://deli.com.br/pt-br/')
  })

  it('la cifra de comisión (iProfesional) aparece solo en AR, donde tiene fuente', async () => {
    const ar = await recs(IDS.campeon, 'AR')
    const mx = await recs(IDS.reds, 'MX')
    expect(ar.find((r) => r.id === 'delivery-commission')?.body).toContain('iProfesional')
    expect(mx.find((r) => r.id === 'delivery-commission')?.body).not.toContain('iProfesional')
  })

  it('cada recomendación enlaza a Fudo con UTM de atribución', async () => {
    const list = await recs(IDS.campeon, 'AR')
    expect(list.length).toBeGreaterThan(0)
    for (const r of list) {
      const url = new URL(r.action.url)
      expect(url.hostname).toMatch(/fu\.do$/)
      expect(url.searchParams.get('utm_source')).toBe('diagnostico')
      expect(url.searchParams.get('utm_campaign')).toBe(r.area)
    }
  })

  it('máximo 5, ordenadas de mayor a menor prioridad', async () => {
    const list = await recs(
      IDS.campeon,
      'AR',
      answers({ locals: '2-3', channels: ['salon', 'apps'] }),
    )
    expect(list.length).toBeLessThanOrEqual(MAX_RECOMMENDATIONS)
    const prios = list.map((r) => r.priority)
    expect(prios).toEqual([...prios].sort((a, b) => b - a))
  })

  it('horarios not_found pide verificar; no dice que faltan', async () => {
    const list = await recs(IDS.piki, 'AR', answers(), Infinity)
    const hours = list.find((r) => r.id === 'google-hours')
    expect(hours?.body).toContain('No pudimos leer')
  })

  it('un local sin problemas igual recibe un próximo paso', async () => {
    const list = await recs(
      IDS.federal,
      'AR',
      answers({ billing: 'otro-sistema', channels: ['salon', 'delivery-propio'] }),
    )
    expect(list.length).toBeGreaterThan(0)
  })
})
