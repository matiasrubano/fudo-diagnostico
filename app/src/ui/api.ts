import type { Answers } from '../domain/types'
import type {
  DiagnosisResponse,
  SearchResponse,
  ShowcaseResponse,
} from '../server/diagnosisService'

// Único punto donde el frontend habla con el servidor. No conoce el proveedor de datos ni keys.

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as T & { error?: string }
  if (!response.ok) throw new Error(body.error ?? `Error ${response.status}`)
  return body
}

export async function searchPlaces(query: string): Promise<SearchResponse> {
  return readJson(await fetch(`/api/places-search?q=${encodeURIComponent(query)}`))
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

export async function fetchShowcase(country: string | null): Promise<ShowcaseResponse> {
  const query = country ? `?country=${encodeURIComponent(country)}` : ''
  return readJson(await fetch(`/api/showcase${query}`))
}
