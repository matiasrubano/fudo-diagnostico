import { describe, expect, it } from 'vitest'
import { getCountry } from '../src/config/countries'
import { copyFor, type LandingFacts } from '../src/content/copy'
import { buildRecommendations } from '../src/domain/recommendations'
import { scoreProfile } from '../src/domain/scoring'
import { LANDING_COUNTRIES } from '../src/domain/showcase'
import type { CountryCode } from '../src/domain/types'
import { SnapshotProvider } from '../src/gateway/SnapshotProvider'
import { answers, IDS, place } from './helpers'

/** Formas verbales de voseo que no pueden aparecer en las voces con tuteo */
const VOSEO =
  /\b(vos|vendés|cobrás|facturás|tenés|querés|podés|usás|dejás|pasate|mandame|elegí|completá|reforzá|armá|dejá|conseguí|entendé|juntá|conectá|leé|revisá|mirá|tocá|sacale|hacé|sumá|pensá|creala|revisala|marcá|escribí)\b/i

function leaves(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value)
  else if (typeof value === 'function') {
    try {
      const result = (value as (...args: string[]) => unknown)(
        'Ejemplo',
        'Ejemplo',
        'Ejemplo',
        'Ejemplo',
      )
      if (typeof result === 'string') out.push(result)
    } catch {
      /* funciones que piden un objeto: se prueban aparte */
    }
  } else if (Array.isArray(value)) value.forEach((v) => leaves(v, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => leaves(v, out))
  return out
}

function facts(code: CountryCode): LandingFacts {
  const c = getCountry(code)
  return {
    country: c.name,
    apps: c.deliveryApps.map((a) => a.name),
    authority: c.fiscal.authority,
    currencyCode: c.currency.code,
  }
}

describe('voz por país: voseo en AR, tuteo en MX, CL y CO', () => {
  it('AR (y el base sin país) hablan de vos', () => {
    expect(copyFor('AR').voice).toBe('voseo')
    expect(copyFor(null).voice).toBe('voseo')
    expect(copyFor('AR').questions.billingTitle).toBe('¿Cómo cobrás y facturás hoy?')
    expect(copyFor('AR').ticket.areaQuestion.operation).toBe('¿Cobrás y facturás sin errores?')
  })

  it.each(['MX', 'CL', 'CO'] as const)('%s habla de tú', (code) => {
    const v = copyFor(code)
    expect(v.voice).toBe('tuteo')
    expect(v.questions.billingTitle).toBe('¿Cómo cobras y facturas hoy?')
    expect(v.questions.localsTitle).toBe('¿Cuántos locales tienes?')
    expect(v.ticket.areaQuestion.operation).toBe('¿Cobras y facturas sin errores?')
    expect(v.recs.googleHours.title).toBe('Completa tus horarios en Google')
  })

  it.each(['MX', 'CL', 'CO', 'BR'] as const)(
    '%s: ningún texto de la voz tiene formas de voseo',
    (code) => {
      const found = leaves(copyFor(code)).filter((t) => VOSEO.test(t))
      expect(found).toEqual([])
    },
  )

  it('lo que un país no pisa se hereda del base', () => {
    const mx = copyFor('MX')
    const ar = copyFor('AR')
    expect(mx.route.modal.title).toBe(ar.route.modal.title)
    expect(mx.ticket.areaQuestion.google).toBe('¿Te encuentran?')
    expect(mx.ticket.areaQuestion.reviews).toBe('¿Te eligen?')
  })

  it('las áreas de la comanda hablan en lenguaje de dueño (el id interno no cambia)', () => {
    const q = copyFor('AR').ticket.areaQuestion
    expect(q).toEqual({
      google: '¿Te encuentran?',
      reviews: '¿Te eligen?',
      web: '¿Te pueden pedir sin comisión?',
      delivery: '¿Estás en las apps que usa tu barrio?',
      operation: '¿Cobrás y facturás sin errores?',
    })
  })

  it('las recomendaciones generadas respetan la voz del país del local', async () => {
    const all = await new SnapshotProvider().suggest()
    for (const summary of all) {
      const p = await place(summary.id)
      const code = p.country ?? 'AR'
      const a = answers({ billing: 'manual', channels: ['salon', 'apps'], locals: '2-3' })
      const recs = buildRecommendations(
        { profile: p, answers: a, scorecard: scoreProfile(p, a), country: getCountry(code) },
        Infinity,
      )
      const text = recs.map((r) => `${r.title} ${r.body}`).join(' ')
      if (code === 'AR') continue
      expect(text, `${summary.id} (${code})`).not.toMatch(VOSEO)
    }
    // y en Argentina sí es voseo
    const campeon = await place(IDS.campeon)
    const a = answers({ billing: 'manual' })
    const ar = buildRecommendations({
      profile: campeon,
      answers: a,
      scorecard: scoreProfile(campeon, a),
      country: getCountry('AR'),
    })
    expect(ar.map((r) => r.title).join(' ')).toMatch(/Dejá de cobrar/)
  })

  it('MX: la recomendación de delivery usa tuteo y los nombres locales (DiDi Food, Rappi)', async () => {
    const p = await place(IDS.reds)
    const a = answers({ channels: ['apps'] })
    const rec = buildRecommendations(
      { profile: p, answers: a, scorecard: scoreProfile(p, a), country: getCountry('MX') },
      Infinity,
    ).find((r) => r.id === 'delivery-commission')
    expect(rec?.body).toContain('Hoy vendes solo por apps (DiDi Food y Rappi')
  })
})

describe('landings: title, H1 y description con apps, ente fiscal y moneda de countries.json', () => {
  it.each(LANDING_COUNTRIES)('%s', (code) => {
    const f = facts(code)
    const v = copyFor(code).landing
    const title = v.title(f, v.fiscalPhrase)
    const description = v.description(f)
    expect(title).toContain(f.country)
    expect(title).toContain(f.apps[0]!)
    expect(title).toContain(f.apps[1]!)
    // el ente fiscal del país (ARCA, SAT, SII, DIAN) aparece en el title y en la description
    expect(title).toContain(f.authority)
    expect(description).toContain(f.authority)
    expect(description).toContain(f.currencyCode)
    expect(description.length).toBeLessThanOrEqual(175)
    expect(v.currencyName).toMatch(/^pesos /)
  })

  it('AR coincide con el ejemplo del pedido', () => {
    const f = facts('AR')
    const v = copyFor('AR').landing
    expect(v.title(f, v.fiscalPhrase)).toBe(
      'Diagnóstico gratis para tu restaurante en Argentina: Google Maps, PedidosYa, Rappi y factura ARCA',
    )
  })
})
