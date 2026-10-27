import { SnapshotProvider } from '../src/gateway/SnapshotProvider'
import type { Answers, PlaceProfile } from '../src/domain/types'

const snapshot = new SnapshotProvider()

/** Carga un local REAL del snapshot por id (ver app/data/snapshots/index.json) */
export function place(id: string): Promise<PlaceProfile> {
  return snapshot.getDetails(id)
}

export function answers(over: Partial<Answers> = {}): Answers {
  return {
    businessType: 'pizzeria',
    channels: ['salon', 'apps'],
    billing: 'manual',
    locals: '1',
    ...over,
  }
}

export const IDS = {
  campeon: 'ar-el-campeon-de-la-pizza-lanus', // 6.167 reseñas, PedidosYa + Rappi, sin web
  piki: 'ar-pizzeria-piki-lanus', // 3 reseñas, sin horarios (not_found), sin web
  federal: 'ar-bar-el-federal-san-telmo', // 11.911 reseñas, web propia
  reds: 'mx-reds-burger-shop-zapopan', // 4.120 reseñas, Rappi + Uber Eats
  taqueria: 'mx-la-taqueria-del-pueblo-tlahuac', // 5,0 con 8 reseñas
  ladina: 'mx-ladina-bar-roma-norte', // 782 reseñas, sin delivery encontrado
  darkKitchen: 'co-come-como-en-casa-dark-kitchen-bogota', // sin rating ni reseñas (not_found)
  diavola: 'br-diavola-pizzaria-pinheiros', // Brasil / Deli
  davvero: 'cl-davvero-pizzeria-nunoa',
} as const
