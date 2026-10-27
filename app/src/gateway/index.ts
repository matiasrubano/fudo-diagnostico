import type { GeoBias, PlaceProfile, PlaceSummary } from '../domain/types'
import { GooglePlacesProvider } from './GooglePlacesProvider'
import { MockProvider } from './MockProvider'
import type { PlaceDataProvider } from './PlaceDataProvider'
import { SnapshotProvider } from './SnapshotProvider'

export type { PlaceDataProvider } from './PlaceDataProvider'
export { PlaceNotFoundError } from './PlaceDataProvider'

export type DataSource = 'snapshot' | 'places' | 'mock'

export type Logger = (message: string) => void

/**
 * Si `primary` falla, cae a `fallback` y lo deja en el log.
 * Un error "no encontrado" no es una falla del proveedor: se propaga tal cual.
 */
export class FallbackProvider implements PlaceDataProvider {
  constructor(
    private readonly primary: PlaceDataProvider,
    private readonly fallback: PlaceDataProvider,
    private readonly log: Logger = (m) => console.warn(m),
  ) {}

  private async withFallback<T>(
    what: string,
    run: (p: PlaceDataProvider) => Promise<T>,
  ): Promise<T> {
    try {
      return await run(this.primary)
    } catch (error) {
      if (error instanceof Error && error.name === 'PlaceNotFoundError') {
        // Puede ser un id del snapshot (p. ej. elegido tras una falla previa de Places): probamos el fallback
        return run(this.fallback)
      }
      const reason = error instanceof Error ? error.message : String(error)
      this.log(`[gateway] ${what} falló en el proveedor principal (${reason}); usando snapshot`)
      return run(this.fallback)
    }
  }

  search(query: string, geoBias?: GeoBias): Promise<PlaceSummary[]> {
    return this.withFallback('search', (p) => p.search(query, geoBias))
  }

  getDetails(id: string): Promise<PlaceProfile> {
    return this.withFallback('getDetails', (p) => p.getDetails(id))
  }

  /** Las sugerencias de "en la demo cubrimos estos locales" siempre salen del catálogo cerrado */
  async suggest(geoBias?: GeoBias): Promise<PlaceSummary[]> {
    return (await this.fallback.suggest?.(geoBias)) ?? []
  }
}

type Env = Record<string, string | undefined>

export interface GatewayDeps {
  snapshot?: PlaceDataProvider
  places?: PlaceDataProvider
  log?: Logger
}

/**
 * Elige el proveedor según DATA_SOURCE (default: snapshot).
 *  - snapshot: restaurantes reales capturados el 26/10/2026
 *  - places:   Google Places en vivo si hay GOOGLE_PLACES_API_KEY; si falla, cae a snapshot
 *  - mock:     datos ficticios
 * El frontend nunca ve nada de esto: solo habla con /api/*.
 */
export function createGateway(env: Env = process.env, deps: GatewayDeps = {}): PlaceDataProvider {
  const log = deps.log ?? ((m: string) => console.warn(m))
  const snapshot = deps.snapshot ?? new SnapshotProvider()
  const source = (env.DATA_SOURCE ?? 'snapshot').toLowerCase() as DataSource

  if (source === 'mock') return new MockProvider()

  if (source === 'places') {
    const apiKey = env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      log('[gateway] DATA_SOURCE=places pero falta GOOGLE_PLACES_API_KEY; usando snapshot')
      return snapshot
    }
    const places = deps.places ?? new GooglePlacesProvider({ apiKey })
    return new FallbackProvider(places, snapshot, log)
  }

  if (source !== 'snapshot') log(`[gateway] DATA_SOURCE="${source}" no existe; usando snapshot`)
  return snapshot
}

let cached: PlaceDataProvider | null = null

/** Instancia única por proceso (las funciones serverless reutilizan el módulo entre requests). */
export function getGateway(): PlaceDataProvider {
  cached ??= createGateway()
  return cached
}
