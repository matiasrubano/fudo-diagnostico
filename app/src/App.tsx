import { useEffect, useState } from 'react'
import { track } from './analytics/events'
import { copy } from './content/copy'
import type { Diagnosis } from './domain/diagnose'
import type { Answers, PlaceSummary } from './domain/types'
import type { SearchResponse } from './server/diagnosisService'
import { requestDiagnosis, searchPlaces } from './ui/api'
import { Footer, Header, Page } from './ui/components/Layout'
import { ScreenTitle } from './ui/components/ScreenTitle'
import { Debug } from './ui/screens/Debug'
import { Hero } from './ui/screens/Hero'
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
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null)

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
      setSearchError(copy.hero.searchError)
    } finally {
      setSearching(false)
    }
  }

  function pick(selected: PlaceSummary, fromSuggestion = false) {
    setPlace(selected)
    setAnswers({})
    setStep(0)
    setStage('questions')
    track('place_selected', {
      country: selected.country,
      // sugerencia = local elegido de la lista "en la demo cubrimos…" o de un ejemplo (chip)
      from_suggestion: fromSuggestion || (response?.notFound ?? false) || searchedByExample,
    })
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
    setAnswers({})
    setStep(0)
  }

  if (window.location.pathname.replace(/\/$/, '') === '/debug') return <Debug />

  return (
    <>
      <Header />
      <Page>
        {stage === 'search' && (
          <Hero initialQuery={query} loading={searching} error={searchError} onSearch={search} />
        )}
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
        {stage === 'result' && diagnosis && <Result d={diagnosis} onRestart={restart} />}
      </Page>
      <Footer />
    </>
  )
}
