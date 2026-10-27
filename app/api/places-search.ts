import { geoBiasFromHeaders, searchPlaces } from '../src/server/diagnosisService.js'
import { json } from '../src/server/http.js'

// GET /api/places-search?q=<texto>
// Devuelve { results, suggestions, notFound }. El proveedor de datos y las keys nunca salen de acá.
async function handler(request: Request): Promise<Response> {
  const q = new URL(request.url).searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return json({ error: 'Escribí al menos 2 letras' }, 400)
  try {
    return json(await searchPlaces(q.slice(0, 100), geoBiasFromHeaders(request.headers)))
  } catch (error) {
    console.error('[api/places-search]', error instanceof Error ? error.message : error)
    return json({ error: 'No pudimos buscar ahora. Probá de nuevo en un rato.' }, 502)
  }
}

export const GET = handler
