import { copy } from '../content/copy'
import type { Diagnosis } from '../domain/diagnose'
import { appsFound } from '../domain/scoring'
import { fridayHours } from '../domain/showcase'
import type { AreaId, Field, Provenance } from '../domain/types'
import { formatNumber, formatRating } from './format'

export interface Evidence {
  /** Qué encontramos, en texto. */
  text: string
  /** De dónde salió (badge). undefined = viene de la respuesta del dueño. */
  provenance?: Provenance
}

function fromField<T>(f: Field<T>, show: (v: T) => string): Evidence {
  if (f.status === 'absent') return { text: copy.evidence.absent, provenance: f.provenance }
  if (f.status === 'not_found' || f.value === null) {
    return { text: copy.evidence.notFound, provenance: f.provenance }
  }
  return { text: show(f.value), provenance: f.provenance }
}

/** Lo que encontramos detrás de cada chequeo del scoring, con su procedencia. */
export function evidenceFor(checkId: string, d: Diagnosis): Evidence {
  const f = d.place.fields
  const a = d.answers
  switch (checkId) {
    case 'hours':
      return fromField(f.openingHours, (h) => copy.evidence.daysLoaded(h.length))
    case 'address':
      return fromField(f.address, (v) => [v.street, v.city].filter(Boolean).join(', '))
    case 'category':
      return fromField(f.businessType, (v) => v)
    case 'price':
      return fromField(f.priceLevel, (v) => v)
    case 'rating':
      return fromField(f.rating, (v) => copy.evidence.ratingOnGoogle(formatRating(v)))
    case 'volume':
      return fromField(f.reviewCount, (v) => copy.evidence.reviews(formatNumber(v, d.country)))
    case 'website':
      return fromField(f.website, (v) => v.replace(/^https?:\/\//, '').replace(/\/$/, ''))
    case 'instagram':
      return fromField(f.instagram, (v) => v.handle)
    case 'apps': {
      const n = appsFound(d.place)
      return n > 0
        ? {
            text: copy.evidence.appsFound(n),
            provenance: f.delivery.provenance,
          }
        : fromField(f.delivery, () => '')
    }
    case 'ownChannel':
      return { text: a.channels.includes('delivery-propio') ? copy.evidence.yes : copy.evidence.no }
    case 'billing':
      return { text: copy.questions.items.billing.options[a.billing] }
    case 'channels':
      return { text: a.channels.map((c) => copy.questions.items.channels.options[c]).join(', ') }
    case 'locals':
      return { text: copy.questions.items.locals.options[a.locals] }
    default:
      return { text: '' }
  }
}

const APP_LABEL: Record<string, string> = {
  pedidosya: 'PedidosYa',
  rappi: 'Rappi',
  ubereats: 'Uber Eats',
  didi: 'DiDi Food',
  ifood: 'iFood',
}

/** Apps de delivery en las que figura el local, con su nombre ("PedidosYa, Rappi"). */
export function appNamesOf(d: Pick<Diagnosis, 'place'>): string[] {
  return Object.entries(d.place.fields.delivery.value ?? {})
    .filter(([, url]) => Boolean(url))
    .map(([key]) => APP_LABEL[key] ?? key)
}

/** Una línea real por área, para el renglón de la comanda (sin puntaje). */
export function rowSummary(area: AreaId, d: Diagnosis): string {
  const f = d.place.fields
  switch (area) {
    case 'google': {
      const friday = fridayHours(f.openingHours.value)
      return friday ? copy.evidence.friday(friday) : evidenceFor('hours', d).text
    }
    case 'reviews': {
      return (
        [evidenceFor('rating', d).text, evidenceFor('volume', d).text]
          .filter((text) => text !== copy.evidence.notFound)
          .join(' · ') || copy.evidence.notFound
      )
    }
    case 'web':
      return f.website.status === 'absent'
        ? copy.evidence.noWebsite
        : [evidenceFor('website', d).text, evidenceFor('instagram', d).text].join(' · ')
    case 'delivery': {
      const apps = appNamesOf(d)
      return apps.length ? apps.join(', ') : evidenceFor('apps', d).text
    }
    case 'operation':
      return copy.questions.items.billing.options[d.answers.billing]
  }
}
