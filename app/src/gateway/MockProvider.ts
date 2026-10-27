import type { GeoBias, PlaceProfile, PlaceSummary, Provenance } from '../domain/types.js'
import { PlaceNotFoundError, type PlaceDataProvider } from './PlaceDataProvider.js'
import { field, notFound, searchCatalog, suggestFromCatalog } from './shared.js'

const PROV: Provenance = {
  source: 'Mock (datos ficticios para tests)',
  capturedAt: '2026-01-01',
  real: false,
}

/** Perfil ficticio mínimo; `over` pisa los campos que cambian entre un mock y otro. */
function mockProfile(
  id: string,
  country: 'AR' | 'MX',
  name: string,
  over: {
    rating: number | null
    reviewCount: number | null
    website: string | null
    apps: boolean
  },
): PlaceProfile {
  const city = country === 'AR' ? 'Lanús' : 'Ciudad de México'
  const missing = <T>() => notFound<T>(PROV)
  return {
    id,
    country,
    profile: 'mock',
    capturedAt: PROV.capturedAt,
    origin: 'mock',
    fields: {
      name: field(name, 'found', PROV),
      address: field(
        { street: 'Calle Falsa 123', city, region: null, postalCode: null, country },
        'found',
        PROV,
      ),
      businessType: field('pizzeria', 'found', PROV),
      rating: over.rating === null ? missing() : field(over.rating, 'found', PROV),
      reviewCount: over.reviewCount === null ? missing() : field(over.reviewCount, 'found', PROV),
      openingHours: field(['lunes: 19:00–23:30'], 'found', PROV),
      website: over.website
        ? field(over.website, 'found', PROV)
        : field<string>(null, 'absent', PROV),
      instagram: missing(),
      delivery: over.apps
        ? field({ pedidosya: 'https://example.test/pedidosya', rappi: null }, 'found', PROV)
        : missing(),
      locationsCount: missing(),
      priceLevel: field('$$', 'found', PROV),
      dineIn: field(true, 'found', PROV),
      takeout: missing(),
      deliveryOffered: over.apps ? field(true, 'found', PROV) : missing(),
    },
  }
}

/** Datos ficticios fijos: para tests y como último recurso. Nunca se muestra como real. */
export class MockProvider implements PlaceDataProvider {
  private readonly catalog: PlaceProfile[] = [
    mockProfile('mock-pizzeria-ar', 'AR', 'Mock Pizzería La Esquina', {
      rating: 4.3,
      reviewCount: 812,
      website: null,
      apps: true,
    }),
    mockProfile('mock-taqueria-mx', 'MX', 'Mock Taquería El Ejemplo', {
      rating: null,
      reviewCount: null,
      website: 'https://example.test',
      apps: false,
    }),
  ]

  async search(query: string, geoBias?: GeoBias): Promise<PlaceSummary[]> {
    return searchCatalog(this.catalog, query, geoBias)
  }

  async getDetails(id: string): Promise<PlaceProfile> {
    const found = this.catalog.find((p) => p.id === id)
    if (!found) throw new PlaceNotFoundError(id)
    return found
  }

  async suggest(geoBias?: GeoBias): Promise<PlaceSummary[]> {
    return suggestFromCatalog(this.catalog, geoBias)
  }
}
