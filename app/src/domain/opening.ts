import type { CountryCode } from './types.js'

// ═══════════════════════════════════════════════════════════════════════════
//  "ESTOY POR ABRIR"  ·  OTRA RUTA, NO UN DIAGNÓSTICO
//  Quien todavía no abrió no tiene presencia online que medir: se lo lleva directo al Consultor de
//  Nuevos Negocios y a la guía de trámites de su país. No pasa por diagnose(): sin local, sin notas, sin plata.
//  Las guías son artículos de app/content/blog/ (slug = nombre del archivo); el texto del enlace está en copy.ts.
// ═══════════════════════════════════════════════════════════════════════════

/** Consultor de Nuevos Negocios de Fudo (herramienta gratis de tools.fu.do) */
export const CONSULTOR_URL = 'https://tools.fu.do/abrir-un-restaurante'

/** Guías del blog que se muestran a quien va a abrir, por país: el comprobante fiscal que le va a tocar emitir */
export const OPENING_GUIDES: Record<CountryCode, string[]> = {
  AR: ['factura-electronica-restaurante-arca'], // ARCA
  MX: ['cfdi-4-restaurante-propinas'], // CFDI (SAT)
  CL: ['boleta-electronica-restaurante-sii'], // boleta electrónica (SII)
  CO: ['factura-electronica-pos-restaurante-dian'], // DIAN
  BR: [], // el blog no cubre Brasil en la demo
}

export const guidePath = (slug: string) => `/blog/${slug}/`
