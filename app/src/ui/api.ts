import type { Answers, CountryCode } from '../domain/types'
import type { DiagnosisResponse, ShowcaseResponse } from '../server/diagnosisService'

// Único punto donde el frontend habla con el servidor. No conoce el proveedor de datos ni keys.

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as T & { error?: string }
  if (!response.ok) throw new Error(body.error ?? `Error ${response.status}`)
  return body
}

export async function requestDiagnosis(
  placeId: string,
  answers: Answers,
): Promise<DiagnosisResponse> {
  return readJson(
    await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId, answers }),
    }),
  )
}

/** "Ver su diagnóstico completo": el mismo diagnóstico, con respuestas de ejemplo (simuladas) puestas por el servidor */
export async function requestSampleDiagnosis(placeId: string): Promise<DiagnosisResponse> {
  return readJson(
    await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId, sample: true }),
    }),
  )
}

/** País desde el que entra el dueño (IP); `forced` = el ?country= de la URL, para probar */
export async function fetchGeo(forced?: string | null): Promise<{ country: CountryCode }> {
  const query = forced ? `?country=${encodeURIComponent(forced)}` : ''
  return readJson(await fetch(`/api/geo${query}`))
}

export async function fetchShowcase(country: string | null): Promise<ShowcaseResponse> {
  const query = country ? `?country=${encodeURIComponent(country)}` : ''
  return readJson(await fetch(`/api/showcase${query}`))
}
