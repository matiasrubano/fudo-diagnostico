import { detectCountry } from '../src/server/geo.js'
import { json } from '../src/server/http.js'

// GET /api/geo[?country=AR|MX|CL|CO|BR]
// Devuelve { country }: el país desde el que entra el dueño (x-vercel-ip-country; AR por defecto).
// `?country=` lo fuerza, para probar en desarrollo o compartir la home de otro país.
async function handler(request: Request): Promise<Response> {
  const forced = new URL(request.url).searchParams.get('country')
  return json({ country: detectCountry(request.headers, forced) })
}

export const GET = handler
