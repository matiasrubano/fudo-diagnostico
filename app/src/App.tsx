import { useCallback, useEffect, useRef, useState } from 'react'
import { track } from './analytics/events'
import { copy, copyFor } from './content/copy'
import { isLandingCountry, type LandingCountry } from './domain/showcase'
import type { Answers, CountryCode, PlaceSummary } from './domain/types'
import type { DiagnosisResponse, ShowcaseResponse } from './server/diagnosisService'
import { fetchGeo, fetchShowcase, requestDiagnosis, requestSampleDiagnosis } from './ui/api'
import { Footer, Header, Page } from './ui/components/Layout'
import { ScreenTitle } from './ui/components/ScreenTitle'
import { landingCountryFromPath, readPageData } from './ui/pageData'
import { Debug } from './ui/screens/Debug'
import { Home } from './ui/screens/Home'
import { PorAbrir } from './ui/screens/PorAbrir'
import { Questions, TOTAL_QUESTIONS } from './ui/screens/Questions'
import { Result } from './ui/screens/Result'

type Stage = 'search' | 'questions' | 'result' | 'porAbrir'

/**
 * Todo lo que define una pantalla del recorrido. Cada paso se guarda en el historial del navegador
 * (history.state): "Atrás" vuelve a la pantalla anterior y recargar el resultado lo mantiene (B-4).
 */
interface Snapshot {
  /** versión del formato: si cambia, un estado viejo del historial se ignora */
  v: 2
  /** posición en el recorrido: 0 = el primero; > 0 = hay una pantalla anterior a la que volver */
  idx: number
  stage: Stage
  place: PlaceSummary | null
  step: number
  answers: Partial<Answers>
  diagnosis: DiagnosisResponse | null
  /** true = diagnóstico de ejemplo (respuestas simuladas) desde la vidriera de la home */
  sample: boolean
  /** país de "Estoy por abrir": el del local elegido, el de la landing o el detectado */
  openingCountry: CountryCode | null
}

const OPENING_HASH = '#por-abrir'

const BLANK: Snapshot = {
  v: 2,
  idx: 0,
  stage: 'search',
  place: null,
  step: 0,
  answers: {},
  diagnosis: null,
  sample: false,
  openingCountry: null,
}

/** Pantalla con la que arranca la página: la del historial (recarga) o la que pide la URL (#por-abrir) */
function snapshotFromLocation(): Snapshot {
  const state = window.history.state as Partial<Snapshot> | null
  if (state && state.v === 2 && state.stage) return { ...BLANK, ...state } as Snapshot
  if (window.location.hash === OPENING_HASH) return { ...BLANK, stage: 'porAbrir' }
  return BLANK
}

export default function App() {
  // Home o landing por país (/ar/, /mx/, /cl/, /co/): el HTML prerenderizado trae los datos embebidos
  const [pageData] = useState(readPageData)
  const landing = pageData?.country ?? landingCountryFromPath(window.location.pathname)
  const [showcase, setShowcase] = useState<ShowcaseResponse | null>(pageData?.showcase ?? null)
  const [showcaseError, setShowcaseError] = useState(false)
  /** país desde el que entra el dueño (solo en la home): adapta voz, escena y ejemplos tras detectarlo */
  const [detected, setDetected] = useState<LandingCountry | null>(null)

  const [snap, setSnap] = useState<Snapshot>(snapshotFromLocation)
  // Copia síncrona del estado actual: varias acciones seguidas parten siempre de la última pantalla
  const snapRef = useRef(snap)
  snapRef.current = snap
  const [loading, setLoading] = useState(false)
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null)
  /** descarta la respuesta de un pedido si el dueño ya se fue a otra pantalla (Atrás) */
  const requestId = useRef(0)

  const { stage, place, step, answers, diagnosis, sample } = snap
  const voice = copyFor(landing ?? detected)

  // En desarrollo (sin prerender) el ticket de ejemplo se pide al servidor
  useEffect(() => {
    if (showcase) return
    let cancelled = false
    fetchShowcase(landing)
      .then((data) => !cancelled && setShowcase(data))
      .catch(() => !cancelled && setShowcaseError(true))
    return () => {
      cancelled = true
    }
  }, [showcase, landing])

  // La home prerenderizada es la de Argentina (SEO). Acá se detecta el país (IP, o ?country= para probar) y se
  // adapta la home de una sola vez, ya con el ticket de ejemplo de ese país: sin parpadeos a mitad de camino.
  useEffect(() => {
    if (landing) return
    let cancelled = false
    const forced = new URLSearchParams(window.location.search).get('country')
    fetchGeo(forced)
      .then(async ({ country }) => {
        if (!isLandingCountry(country)) return // Brasil u otro: se queda la home de siempre
        if (country === 'AR') return !cancelled && setDetected('AR')
        const local = await fetchShowcase(country)
        if (cancelled) return
        setShowcase(local)
        setDetected(country)
      })
      .catch(() => undefined) // sin geo la home queda como está
    return () => {
      cancelled = true
    }
  }, [landing])

  // El estado inicial queda en el historial, así "Atrás" siempre tiene a dónde volver
  useEffect(() => {
    try {
      if (!(window.history.state as Partial<Snapshot> | null)?.v) {
        window.history.replaceState(snap, '')
      }
    } catch {
      // sin historial editable (iframe, modo raro): la app anda igual, sin recarga que conserve el estado
    }
    // solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // "Atrás" y "Adelante" del navegador: se vuelve a la pantalla que estaba en ese punto del historial
  useEffect(() => {
    function onPopState() {
      requestId.current += 1
      setLoading(false)
      setDiagnosisError(null)
      const restored = snapshotFromLocation()
      snapRef.current = restored
      setSnap(restored)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  /** Muestra la pantalla siguiente y la anota en el historial (la URL solo cambia en "Estoy por abrir") */
  const go = useCallback((patch: Partial<Snapshot>) => {
    const current = snapRef.current
    const next: Snapshot = { ...current, ...patch, idx: current.idx + 1 }
    const url =
      window.location.pathname +
      window.location.search +
      (next.stage === 'porAbrir' ? OPENING_HASH : '')
    try {
      window.history.pushState(next, '', url)
    } catch {
      // estado no clonable o historial bloqueado: se sigue sin historial
    }
    snapRef.current = next
    setSnap(next)
  }, [])

  /** Vuelve a la pantalla anterior del recorrido (o a la búsqueda si se entró directo a esta) */
  function back() {
    if (snap.idx > 0) window.history.back()
    else go({ ...BLANK, stage: 'search' })
  }

  /** El dueño eligió una tarjeta: un local real de la demo. Empiezan las preguntas. */
  function pickPlace(selected: PlaceSummary) {
    track('diag_start', { source: 'card' })
    go({ stage: 'questions', place: selected, answers: {}, step: 0, sample: false })
    // el local sale de la lista de la demo, no de una búsqueda
    track('place_selected', { country: selected.country, from_suggestion: true })
  }

  /** "Estoy por abrir": otra ruta, sin diagnóstico de ningún local */
  function openOpening(from: 'home' | 'p1', country: CountryCode | null) {
    go({
      stage: 'porAbrir',
      place: null,
      answers: {},
      step: 0,
      diagnosis: null,
      openingCountry: country ?? landing ?? detected,
    })
    track('lead_tier', { tier: 'por-abrir', volume: null, from })
  }

  /** "Ver su diagnóstico completo": un local real de la vidriera, con respuestas de ejemplo (simuladas) */
  async function openSample(placeId: string, country: CountryCode | null) {
    const id = ++requestId.current
    setLoading(true)
    setDiagnosisError(null)
    track('place_selected', { country, from_suggestion: true })
    try {
      const d = await requestSampleDiagnosis(placeId)
      if (id === requestId.current) go({ stage: 'result', place: null, diagnosis: d, sample: true })
    } catch {
      if (id === requestId.current) setDiagnosisError(voice.loading.error)
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }

  async function finish(finalAnswers: Answers, placeId: string) {
    const id = ++requestId.current
    setLoading(true)
    setDiagnosisError(null)
    try {
      const d = await requestDiagnosis(placeId, finalAnswers)
      if (id === requestId.current) {
        go({ stage: 'result', answers: finalAnswers, diagnosis: d, sample: false })
      }
    } catch {
      if (id === requestId.current) setDiagnosisError(copyFor(place?.country ?? null).loading.error)
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }

  /** Una respuesta del cuestionario (o dos juntas: "otro sistema" + cuál) */
  function answer(patch: Partial<Answers>) {
    if (!place) return
    track(`q_answered_${step + 1}` as 'q_answered_1', {
      answer: String(Object.values(patch)[0]),
      ...(patch.currentSystem ? { system: patch.currentSystem } : {}),
    })
    const next: Partial<Answers> = { ...answers, ...patch }
    // "¿Cuál?" solo vale con "otro sistema": si cambia la respuesta, se olvida
    if (patch.billing && patch.billing !== 'otro-sistema' && !patch.currentSystem) {
      delete next.currentSystem
    }
    if (step < TOTAL_QUESTIONS - 1) {
      go({ answers: next, step: step + 1 })
    } else {
      void finish(next as Answers, place.id)
    }
  }

  // Un evento por diagnóstico mostrado
  useEffect(() => {
    if (stage === 'result' && diagnosis) {
      track('result_viewed', { country: diagnosis.country, overall: diagnosis.scorecard.overall })
      track('lead_tier', { tier: diagnosis.lead.tier, volume: diagnosis.lead.volume })
    }
  }, [stage, diagnosis])

  function restart() {
    setDiagnosisError(null)
    go({ ...BLANK, stage: 'search' })
  }

  if (window.location.pathname.replace(/\/$/, '') === '/debug') return <Debug />

  // El logo cambia a "Deli" cuando el local es de Brasil
  const brandCountry: CountryCode | null =
    stage === 'result'
      ? (diagnosis?.country ?? null)
      : stage === 'porAbrir'
        ? snap.openingCountry
        : (place?.country ?? null)

  const busy = loading || diagnosisError !== null

  return (
    <>
      <Header country={brandCountry} />
      {stage === 'search' && !busy ? (
        <main>
          <Home
            country={landing}
            showcase={showcase}
            detected={detected}
            showcaseError={showcaseError}
            guides={pageData?.guides ?? []}
            onPickPlace={pickPlace}
            onOpenSample={openSample}
            onOpening={() => openOpening('home', null)}
          />
        </main>
      ) : (
        <Page>
          {busy && (
            <section role="status" aria-live="polite">
              <ScreenTitle>{diagnosisError ?? voice.loading.title}</ScreenTitle>
              {diagnosisError && (
                <button type="button" className="btn btn-secondary mt-6" onClick={restart}>
                  {copy.result.restart}
                </button>
              )}
            </section>
          )}
          {!busy && stage === 'questions' && place && (
            <Questions
              step={step}
              answers={answers}
              country={place.country}
              onAnswer={answer}
              onOpening={() => {
                // "Todavía no abrí" no es una respuesta del diagnóstico: lleva a su propia pantalla
                track('q_answered_1', { answer: 'por-abrir' })
                openOpening('p1', place.country)
              }}
              onBack={back}
            />
          )}
          {!busy && stage === 'result' && diagnosis && (
            <Result d={diagnosis} sample={sample} onRestart={restart} />
          )}
          {!busy && stage === 'porAbrir' && (
            <PorAbrir
              country={snap.openingCountry ?? landing ?? detected ?? 'AR'}
              onOpenLocal={restart}
            />
          )}
        </Page>
      )}
      <Footer country={brandCountry} />
    </>
  )
}
