import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { GeoBias, PlaceProfile, PlaceSummary } from '../domain/types.js'
import { PlaceNotFoundError, type PlaceDataProvider } from './PlaceDataProvider.js'
import { countryFromCode, searchCatalog, suggestFromCatalog } from './shared.js'

/** Forma de cada archivo app/data/snapshots/<pais>-<slug>.json */
interface SnapshotFile {
  id: string
  country: string
  profile?: string
  capturedAt: string
  fields: PlaceProfile['fields']
  notes?: string
}

/**
 * En local el cwd es app/; en la función de Vercel es /var/task y los archivos
 * quedan en /var/task/app/data/snapshots. Se usa la primera carpeta que exista.
 */
export function defaultSnapshotDir(cwd: string = process.cwd()): string {
  if (process.env.SNAPSHOT_DIR) return process.env.SNAPSHOT_DIR
  const candidates = [join(cwd, 'data', 'snapshots'), join(cwd, 'app', 'data', 'snapshots')]
  return candidates.find((dir) => existsSync(dir)) ?? candidates[0]!
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
