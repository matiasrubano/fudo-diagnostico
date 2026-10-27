import { describe, expect, it } from 'vitest'
import { AREA_WEIGHTS, ratingPoints, scoreProfile, volumePoints } from '../src/domain/scoring'
import { answers, IDS, place } from './helpers'

describe('scoring', () => {
  it('los pesos de las áreas suman 1', () => {
    const total = Object.values(AREA_WEIGHTS).reduce((a, b) => a + b, 0)
    expect(total).toBeCloseTo(1, 5)
  })

  it('un local bien posicionado con sistema saca nota alta', async () => {
    const card = scoreProfile(
      await place(IDS.federal),
      answers({ businessType: 'bar', billing: 'otro-sistema', channels: ['salon', 'apps'] }),
    )
    expect(card.overall).toBeGreaterThanOrEqual(70)
    expect(card.areas.reviews.grade).toBe('great')
    expect(card.areas.web.score).toBeGreaterThanOrEqual(65)
  })

  it('un local con mala presencia saca nota baja', async () => {
    const card = scoreProfile(
      await place(IDS.piki),
      answers({ channels: ['salon'], billing: 'manual' }),
    )
    expect(card.overall).toBeLessThan(50)
    expect(card.overallGrade).toMatch(/fair|poor/)
  })

  it('not_found no penaliza: los horarios que no encontramos quedan como "unknown"', async () => {
    const piki = await place(IDS.piki)
    expect(piki.fields.openingHours.status).toBe('not_found')
    const hours = scoreProfile(piki, answers()).areas.google.checks.find((c) => c.id === 'hours')
    expect(hours?.score).toBeNull()
    expect(hours?.status).toBe('unknown')
  })

  it('absent sí penaliza: web verificada como inexistente da 0 en ese chequeo', async () => {
    const campeon = await place(IDS.campeon)
    expect(campeon.fields.website.status).toBe('absent')
    const web = scoreProfile(campeon, answers()).areas.web.checks.find((c) => c.id === 'website')
    expect(web?.score).toBe(0)
    expect(web?.status).toBe('bad')
  })

  it('5,0 con 8 reseñas no es una señal creíble: el rating se topa', async () => {
    expect(ratingPoints(5, 8)).toBeLessThan(ratingPoints(5, 500))
    const card = scoreProfile(await place(IDS.taqueria), answers())
    const rating = card.areas.reviews.checks.find((c) => c.id === 'rating')
    expect(rating?.score).toBe(60)
  })

  it('el volumen de reseñas sube por tramos', () => {
    expect(volumePoints(3)).toBeLessThan(volumePoints(100))
    expect(volumePoints(100)).toBeLessThan(volumePoints(2000))
    expect(volumePoints(2000)).toBe(100)
  })

  it('delivery no aplica si no vende por delivery, y no cuenta en la nota general', async () => {
    const ladina = await place(IDS.ladina)
    const card = scoreProfile(ladina, answers({ businessType: 'bar', channels: ['salon'] }))
    expect(card.areas.delivery.applicable).toBe(false)
    expect(card.areas.delivery.score).toBeNull()
    expect(card.overall).not.toBeNull()
  })

  it('operación depende de las respuestas: sistema > terminal > a mano', async () => {
    const p = await place(IDS.reds)
    const score = (billing: 'manual' | 'terminal' | 'otro-sistema') =>
      scoreProfile(p, answers({ billing })).areas.operation.score as number
    expect(score('otro-sistema')).toBeGreaterThan(score('terminal'))
    expect(score('terminal')).toBeGreaterThan(score('manual'))
  })

  it('la dark kitchen sin ficha de Google igual recibe nota (campos desconocidos se descartan)', async () => {
    const card = scoreProfile(
      await place(IDS.darkKitchen),
      answers({ businessType: 'dark-kitchen', channels: ['apps'] }),
    )
    expect(card.areas.reviews.score).toBeNull()
    expect(card.overall).not.toBeNull()
  })
})
