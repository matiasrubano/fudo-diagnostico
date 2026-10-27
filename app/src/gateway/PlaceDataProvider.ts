import type { GeoBias, PlaceProfile, PlaceSummary } from '../domain/types.js'
import type { SuggestionPlan } from './shared.js'

/**
 * Contrato único de acceso a datos de un local.
 * Todo lo que está detrás (snapshot, Google Places, mock) devuelve la misma forma,
 * con `provenance` por campo. Agregar un proveedor = implementar esta interfaz.
 */
export interface PlaceDataProvider {
  search(query: string, geoBias?: GeoBias): Promise<PlaceSummary[]>
  getDetails(id: string): Promise<PlaceProfile>
  /** Locales de ejemplo para sugerir cuando la búsqueda no encuentra nada (solo catálogos cerrados) */
  suggest?(geoBias?: GeoBias): Promise<PlaceSummary[]>
  /** Qué sugerir para una búsqueda sin resultados: ordenado por el país que nombra la búsqueda o el detectado */
  suggestFor?(query: string, geoBias?: GeoBias): Promise<SuggestionPlan>
}

export class PlaceNotFoundError extends Error {
  constructor(id: string) {
    super(`No encontramos el local "${id}"`)
    this.name = 'PlaceNotFoundError'
  }
}
