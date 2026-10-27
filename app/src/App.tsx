import { useEffect, useState } from 'react'
import { track } from './analytics/events'
import { copy, copyFor } from './content/copy'
import type { Answers, CountryCode, PlaceSummary } from './domain/types'
import type { DiagnosisResponse, SearchResponse, ShowcaseResponse } from './server/diagnosisService'
import { fetchShowcase, requestDiagnosis, requestSampleDiagnosis, searchPlaces } from './ui/api'
import { Footer, Header, Page } from './ui/components/Layout'
import { ScreenTitle } from './ui/components/ScreenTitle'
import { landingCountryFromPath, readPageData } from './ui/pageData'
import { Debug } from './ui/screens/Debug'
import { Home } from './ui/screens/Home'
import { PickPlace } from './ui/screens/PickPlace'
import { Questions, TOTAL_QUESTIONS } from './ui/screens/Questions'
import { Result } from './ui/screens/Result'

type Stage = 'search' | 'pick' | 'questions' | 'loading' | 'result'

/** Respuestas por defecto para quien dice "todavía no abrí": no se le piden las otras 3 preguntas. */
const DEFAULTS_BEFORE_OPENING: Pick<Answers, 'channels' | 'billing' | 'locals'> = {
  channels: [],
  billing: 'manual',
  locals: '1',
}

export default function App() {
  // Home o landing por país (/ar/, /mx/, /cl/, /co/): el HTML prerenderizado trae los datos embebidos
  const [pageData] = useState(readPageData)
  const landing = pageData?.country ?? landingCountryFromPath(window.location.pathname)
  const [showcase, setShowcase] = useState<ShowcaseResponse | null>(pageData?.showcase ?? null)
  const [showcaseError, setShowcaseError] = useState(false)

  const [stage, setStage] = useState<Stage>('search')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  /** true si la búsqueda salió de tocar un ejemplo (chip) en vez de escribir */
  const [searchedByExample, setSearchedByExample] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [response, setResponse] = useState<SearchResponse | null>(null)
  const [place, setPlace] = useState<PlaceSummary | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null)
  const [sample, setSample] = useState(false)
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null)

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

  async function search(q: string, byExample = false) {
    setQuery(q)
    setSearchedByExample(byExample)
    setSearching(true)
    setSearchError(null)
    track('diag_start', { query_length: q.length })
    try {
      setResponse(await searchPlaces(q))
      setStage('pick')
    } catch {
      setSearchError(copyFor(landing).hero.searchError)
    } finally {
      setSearching(false)
    }
  }

  function pick(selected: PlaceSummary, fromSuggestion = false) {
    setPlace(selected)
    setAnswers({})
    setStep(0)
    setSample(false)
    setStage('questions')
    track('place_selected', {
      country: selected.country,
      // sugerencia = local elegido de la lista "en la demo cubrimos…" o de un ejemplo (chip)
      from_suggestion: fromSuggestion || (response?.notFound ?? false) || searchedByExample,
    })
  }

  /** "Ver su diagnóstico completo": un local real de la vidriera, con respuestas de ejemplo (simuladas) */
  async function openSample(placeId: string, country: CountryCode | null) {
    setPlace(null)
    setSample(true)
    setStage('loading')
    setDiagnosisError(null)
    track('place_selected', { country, from_suggestion: true })
    try {
      setDiagnosis(await requestSampleDiagnosis(placeId))
      setStage('result')
    } catch {
      setDiagnosisError(copy.loading.error)
    }
  }

  async function finish(finalAnswers: Answers, placeId: string) {
    setStage('loading')
    setDiagnosisError(null)
    try {
      setDiagnosis(await requestDiagnosis(placeId, finalAnswers))
      setStage('result')
    } catch {
      setDiagnosisError(copy.loading.error)
    }
  }

  function answer<K extends keyof Answers>(key: K, value: Answers[K]) {
    if (!place) return
    const next = { ...answers, [key]: value }
    track(`q_answered_${step + 1}` as 'q_answered_1', { answer: String(value) })

    // "Todavía no abrí" termina el cuestionario: el resto de las preguntas no aplican
    if (key === 'businessType' && value === 'por-abrir') {
      void finish({ ...DEFAULTS_BEFORE_OPENING, businessType: 'por-abrir' }, place.id)
      return
    }
    if (step < TOTAL_QUESTIONS - 1) {
      setAnswers(next)
      setStep(step + 1)
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
    setStage('search')
    setResponse(null)
    setPlace(null)
    setDiagnosis(null)
    setSample(false)
    setAnswers({})
    setStep(0)
  }

  if (window.location.pathname.replace(/\/$/, '') === '/debug') return <Debug />

  // El logo cambia a "Deli" cuando el local es de Brasil
  const brandCountry: CountryCode | null =
    stage === 'result' ? (diagnosis?.country ?? null) : (place?.country ?? null)

  return (
    <>
      <Header country={brandCountry} />
      {stage === 'search' ? (
        <Home
          country={landing}
          showcase={showcase}
          showcaseError={showcaseError}
          guides={pageData?.guides ?? []}
          initialQuery={query}
          loading={searching}
          error={searchError}
          onSearch={search}
          onOpenSample={openSample}
        />
      ) : (
        <Page>
          {stage === 'pick' && response && (
            <PickPlace
              query={query}
              response={response}
              onPick={(selected, fromSuggestion) => pick(selected, fromSuggestion)}
              onBack={() => setStage('search')}
            />
          )}
          {stage === 'questions' && place && (
            <Questions
              step={step}
              answers={answers}
              country={place.country}
              onAnswer={answer}
              onBack={() => (step === 0 ? setStage('pick') : setStep(step - 1))}
            />
          )}
          {stage === 'loading' && (
            <section role="status" aria-live="polite">
              <ScreenTitle>{diagnosisError ?? copy.loading.title}</ScreenTitle>
              {diagnosisError && (
                <button type="button" className="btn btn-secondary mt-6" onClick={restart}>
                  {copy.result.restart}
                </button>
              )}
            </section>
          )}
          {stage === 'result' && diagnosis && (
            <Result d={diagnosis} sample={sample} onRestart={restart} />
          )}
        </Page>
      )}
      <Footer country={brandCountry} />
    </>
  )
}
