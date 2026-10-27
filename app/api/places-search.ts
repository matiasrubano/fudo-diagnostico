import { geoBiasFromHeaders, searchPlaces } from '../src/server/diagnosisService.js'
import { json } from '../src/server/http.js'

// GET /api/places-search?q=<texto>[&country=AR|MX|CL|CO|BR]
// Devuelve { results, suggestions, notFound, priorityCountry, onlyPriority }.
// `country` = la landing desde la que se busca: gana sobre la IP (x-vercel-ip-country) para ordenar las sugerencias.
// El proveedor de datos y las keys nunca salen de acá.
async function handler(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams
  const q = params.get('q')?.trim() ?? ''
  if (q.length < 2) return json({ error: 'Escribí al menos 2 letras' }, 400)
  try {
    return json(
      await searchPlaces(
        q.slice(0, 100),
        geoBiasFromHeaders(request.headers, params.get('country')),
      ),
    )
  } catch (error) {
    console.error('[api/places-search]', error instanceof Error ? error.message : error)
    return json({ error: 'No pudimos buscar ahora. Probá de nuevo en un rato.' }, 502)
  }
}

export const GET = handler
