// Instrumentación mínima: los eventos se guardan en localStorage y se ven en /debug.
// No se envía nada a ningún servidor (en producción acá iría GA4 / un endpoint propio).

export type EventName =
  | 'diag_start'
  | 'place_selected'
  | 'q_answered_1'
  | 'q_answered_2'
  | 'q_answered_3'
  | 'q_answered_4'
  | 'result_viewed'
  | 'lead_tier'
  | 'cta_click'

/** Orden del embudo, para el panel /debug */
export const FUNNEL: EventName[] = [
  'diag_start',
  'place_selected',
  'q_answered_1',
  'q_answered_2',
  'q_answered_3',
  'q_answered_4',
  'result_viewed',
  'lead_tier',
  'cta_click',
]

export interface TrackedEvent {
  name: EventName
  /** ISO 8601 */
  at: string
  /** una sesión = una pestaña del navegador */
  session: string
  props: Record<string, string | number | boolean | null>
}

const STORAGE_KEY = 'fudo.diagnostico.events'
const SESSION_KEY = 'fudo.diagnostico.session'
const MAX_EVENTS = 500

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = Math.random().toString(36).slice(2, 8)
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return 'sin-storage'
  }
}

export function readEvents(): TrackedEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as TrackedEvent[]
  } catch {
    return []
  }
}

export function track(name: EventName, props: TrackedEvent['props'] = {}): void {
  try {
    const events = readEvents()
    events.push({ name, at: new Date().toISOString(), session: sessionId(), props })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)))
  } catch {
    // Sin localStorage (modo privado, cuota): la app sigue andando sin medir.
  }
}

export function clearEvents(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nada que limpiar
  }
}

/** Sesiones únicas que llegaron a cada paso del embudo. */
export function funnelCounts(events: TrackedEvent[]): { name: EventName; sessions: number }[] {
  return FUNNEL.map((name) => ({
    name,
    sessions: new Set(events.filter((e) => e.name === name).map((e) => e.session)).size,
  }))
}
