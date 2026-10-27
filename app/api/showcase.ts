import { isLandingCountry } from '../src/domain/showcase.js'
import { buildShowcase } from '../src/server/diagnosisService.js'
import { json } from '../src/server/http.js'

// GET /api/showcase?country=AR|MX|CL|CO   (sin country = la home)
// Devuelve el ticket de ejemplo de un local real del snapshot y la lista de locales reales de la demo.
async function handler(request: Request): Promise<Response> {
  const country = new URL(request.url).searchParams.get('country')?.toUpperCase() ?? null
  if (country !== null && !isLandingCountry(country)) return json({ error: 'País no válido' }, 400)
  try {
    return json(await buildShowcase(country))
  } catch (error) {
    console.error('[api/showcase]', error instanceof Error ? error.message : error)
    return json({ error: 'No pudimos cargar el ejemplo ahora.' }, 502)
  }
}

export const GET = handler
