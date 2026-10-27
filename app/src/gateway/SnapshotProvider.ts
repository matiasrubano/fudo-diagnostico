import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { GeoBias, PlaceProfile, PlaceSummary } from '../domain/types'
import { PlaceNotFoundError, type PlaceDataProvider } from './PlaceDataProvider'
import { countryFromCode, searchCatalog, suggestFromCatalog } from './shared'

/** Forma de cada archivo app/data/snapshots/<pais>-<slug>.json */
interface SnapshotFile {
  id: string
  country: string
  profile?: string
  capturedAt: string
  fields: PlaceProfile['fields']
  notes?: string
}

export function defaultSnapshotDir(): string {
  return process.env.SNAPSHOT_DIR ?? join(process.cwd(), 'data', 'snapshots')
}

/**
 * Proveedor por defecto: restaurantes REALES capturados el 26/10/2026 (solo para la demo).
 * Lee los JSON del disco la primera vez y los guarda en memoria.
 */
export class SnapshotProvider implements PlaceDataProvider {
  private catalog: PlaceProfile[] | null = null

  constructor(private readonly dir: string = defaultSnapshotDir()) {}

  private load(): PlaceProfile[] {
    if (!this.catalog) {
      this.catalog = readdirSync(this.dir)
        .filter((f) => f.endsWith('.json') && f !== 'index.json')
        .sort()
        .map((f) => {
          const file = JSON.parse(readFileSync(join(this.dir, f), 'utf8')) as SnapshotFile
          return {
            id: file.id,
            country: countryFromCode(file.country),
            profile: file.profile,
            capturedAt: file.capturedAt,
            origin: 'snapshot' as const,
            fields: file.fields,
            notes: file.notes,
          }
        })
    }
    return this.catalog
  }

  async search(query: string, geoBias?: GeoBias): Promise<PlaceSummary[]> {
    return searchCatalog(this.load(), query, geoBias)
  }

  async getDetails(id: string): Promise<PlaceProfile> {
    const found = this.load().find((p) => p.id === id)
    if (!found) throw new PlaceNotFoundError(id)
    return found
  }

  async suggest(geoBias?: GeoBias): Promise<PlaceSummary[]> {
    return suggestFromCatalog(this.load(), geoBias)
  }
}
