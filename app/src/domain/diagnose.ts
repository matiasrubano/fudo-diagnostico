import { getCountry } from '../config/countries'
import { classifyLead, type LeadClassification } from './leadTier'
import { estimateMoneyLost, type MoneyEstimate } from './moneyLost'
import { buildRecommendations, type Recommendation } from './recommendations'
import { scoreProfile, type Scorecard } from './scoring'
import type { Answers, CountryCode, PlaceProfile } from './types'

/** País que se usa si la dirección del local cae fuera de los 5 países de la demo */
export const FALLBACK_COUNTRY: CountryCode = 'AR'

export interface Diagnosis {
  place: PlaceProfile
  /** País final: sale de la dirección del local, no de la IP */
  country: CountryCode
  /** true si la dirección no era de ninguno de los 5 países y se usó el de respaldo */
  countryAssumed: boolean
  answers: Answers
  scorecard: Scorecard
  recommendations: Recommendation[]
  money: MoneyEstimate
  lead: LeadClassification
}

/** Une todo el dominio puro: datos del local + respuestas → diagnóstico completo. */
export function diagnose(place: PlaceProfile, answers: Answers): Diagnosis {
  const country = place.country ?? FALLBACK_COUNTRY
  const config = getCountry(country)
  const scorecard = scoreProfile(place, answers)
  return {
    place,
    country,
    countryAssumed: place.country === null,
    answers,
    scorecard,
    recommendations: buildRecommendations({ profile: place, answers, scorecard, country: config }),
    money: estimateMoneyLost(place, answers, scorecard, country),
    lead: classifyLead(place, answers),
  }
}
