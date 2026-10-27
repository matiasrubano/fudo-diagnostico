import { PlaceNotFoundError } from '../src/gateway/index.js'
import { parseAnswers, runDiagnosis } from '../src/server/diagnosisService.js'
import { json } from '../src/server/http.js'

// POST /api/diagnose   body: { placeId: string, answers: Answers }
// Devuelve el Diagnosis completo (notas, recomendaciones, plata perdida, tier).
async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Usá POST' }, 405)
  let body: { placeId?: unknown; answers?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return json({ error: 'JSON inválido' }, 400)
  }
  const answers = parseAnswers(body.answers)
  if (typeof body.placeId !== 'string' || !answers) {
    return json({ error: 'Faltan placeId o respuestas válidas' }, 400)
  }
  try {
    return json(await runDiagnosis(body.placeId, answers))
  } catch (error) {
    if (error instanceof PlaceNotFoundError) return json({ error: error.message }, 404)
    console.error('[api/diagnose]', error instanceof Error ? error.message : error)
    return json({ error: 'No pudimos armar el diagnóstico ahora.' }, 502)
  }
}

export const POST = handler
