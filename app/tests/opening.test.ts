import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { copyFor } from '../src/content/copy'
import { CONSULTOR_URL, guidePath, OPENING_GUIDES } from '../src/domain/opening'
import { COUNTRY_CODES } from '../src/domain/types'
import { parseAnswers } from '../src/server/diagnosisService'
import { PorAbrir } from '../src/ui/screens/PorAbrir'

const noop = () => undefined
const html = (country: (typeof COUNTRY_CODES)[number]) =>
  renderToStaticMarkup(createElement(PorAbrir, { country, onOpenLocal: noop }))

describe('"Estoy por abrir" es otra ruta, no un diagnóstico', () => {
  it('cada guía existe en el blog y tiene su texto de enlace', () => {
    for (const code of COUNTRY_CODES) {
      for (const slug of OPENING_GUIDES[code]) {
        expect(existsSync(join(process.cwd(), 'content', 'blog', `${slug}.md`)), slug).toBe(true)
        expect(copyFor(code).opening.guides[slug], slug).toBeTruthy()
      }
    }
  })

  it('CL → boleta del SII, AR → ARCA, MX → CFDI, CO → DIAN', () => {
    expect(OPENING_GUIDES.CL).toEqual(['boleta-electronica-restaurante-sii'])
    expect(OPENING_GUIDES.AR).toEqual(['factura-electronica-restaurante-arca'])
    expect(OPENING_GUIDES.MX).toEqual(['cfdi-4-restaurante-propinas'])
    expect(OPENING_GUIDES.CO).toEqual(['factura-electronica-pos-restaurante-dian'])
  })

  it('la pantalla pone el Consultor primero y después la guía del país', () => {
    const cl = html('CL')
    const consultor = cl.indexOf('tools.fu.do/abrir-un-restaurante')
    const guide = cl.indexOf(guidePath('boleta-electronica-restaurante-sii'))
    expect(CONSULTOR_URL).toContain('tools.fu.do/abrir-un-restaurante')
    expect(consultor).toBeGreaterThan(-1)
    expect(guide).toBeGreaterThan(consultor)
    expect(cl).toContain('SII')
  })

  it('no muestra diagnóstico, plata ni ticket de ningún local', () => {
    for (const code of ['AR', 'MX', 'CL', 'CO'] as const) {
      const text = html(code).replace(/<[^>]+>/g, ' ')
      expect(text).not.toMatch(/\/100|se te escapa|comanda de diagn|Nota general|\$\s?\d/i)
    }
  })

  it('la API de diagnóstico ya no acepta "todavía no abrí" como respuesta', () => {
    const base = { channels: ['salon'], billing: 'manual', locals: '1' }
    expect(parseAnswers({ ...base, businessType: 'por-abrir' })).toBeNull()
    expect(parseAnswers({ ...base, businessType: 'pizzeria' })).not.toBeNull()
  })

  it('la voz de MX/CL/CO usa tuteo en el enlace de la home', () => {
    expect(copyFor('AR').opening.link).toBe('Mirá qué conviene tener listo antes de abrir')
    expect(copyFor('MX').opening.link).toBe('Mira qué conviene tener listo antes de abrir')
  })
})
