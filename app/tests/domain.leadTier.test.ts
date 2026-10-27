import { describe, expect, it } from 'vitest'
import { classifyLead, volumeOf } from '../src/domain/leadTier'
import { answers, IDS, place } from './helpers'

describe('leadTier: las 5 rutas', () => {
  it('caliente: 1 local, volumen alto, delivery y cobra a mano', async () => {
    const lead = classifyLead(await place(IDS.campeon), answers({ billing: 'manual' }))
    expect(lead.tier).toBe('caliente')
    expect(lead.volume).toBe('alto')
  })

  it('switcher: dentro del núcleo pero ya usa otro sistema', async () => {
    const lead = classifyLead(
      await place(IDS.reds),
      answers({ businessType: 'restaurante', billing: 'otro-sistema', locals: '2-3' }),
    )
    expect(lead.tier).toBe('switcher')
  })

  it('nutrir: poco volumen (3 reseñas) aunque venda por apps', async () => {
    const lead = classifyLead(await place(IDS.piki), answers({ billing: 'manual' }))
    expect(lead.tier).toBe('nutrir')
    expect(lead.reasons).toContain('poco-volumen')
  })

  it('nutrir: buen volumen pero sin delivery', async () => {
    const lead = classifyLead(
      await place(IDS.ladina),
      answers({ businessType: 'bar', channels: ['salon'] }),
    )
    expect(lead.tier).toBe('nutrir')
    expect(lead.reasons).toContain('sin-delivery')
  })

  it('descartar: 4 o más locales (no es autoservicio, se deriva a ventas)', async () => {
    const lead = classifyLead(await place(IDS.campeon), answers({ locals: '4+' }))
    expect(lead.tier).toBe('descartar')
    expect(lead.reasons).toEqual(['cadena'])
  })

  it('descartar: negocio fuera del rubro', async () => {
    const lead = classifyLead(await place(IDS.campeon), answers({ businessType: 'otro' }))
    expect(lead.tier).toBe('descartar')
  })

  it('volumen desconocido (not_found) no cuenta como bajo: la dark kitchen con apps es caliente', async () => {
    const dk = await place(IDS.darkKitchen)
    expect(volumeOf(dk.fields.reviewCount)).toBe('desconocido')
    const lead = classifyLead(dk, answers({ businessType: 'dark-kitchen', channels: ['apps'] }))
    expect(lead.tier).toBe('caliente')
  })
})
