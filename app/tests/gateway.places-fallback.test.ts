import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import {
  DETAILS_FIELD_MASK,
  GooglePlacesProvider,
  SEARCH_FIELD_MASK,
  mapDetails,
  type PlacesPlace,
} from '../src/gateway/GooglePlacesProvider'
import { createGateway } from '../src/gateway'
import { MockProvider } from '../src/gateway/MockProvider'
import { SnapshotProvider } from '../src/gateway/SnapshotProvider'

// Fixtures FICTICIAS (ver el campo _fixture): forma del recurso Place según docs/research/datos.md §1.4-B
const load = (name: string) =>
  JSON.parse(readFileSync(join(__dirname, 'fixtures', name), 'utf8')) as Record<string, unknown>
const detailsFixture = load('places-details.sample.json')
const searchFixture = load('places-search.sample.json')

const NOW = () => new Date('2026-11-02T12:00:00Z')

function okResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200 })
}

describe('GooglePlacesProvider (fetch mockeado, fixture ficticio)', () => {
  it('search: manda POST con field mask mínima, key en header y sesgo por IP', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(searchFixture))
    const provider = new GooglePlacesProvider({ apiKey: 'test-key', fetchImpl, now: NOW })
    const results = await provider.search('Pizzería La Esquina Lanús', {
      country: 'AR',
      lat: -34.7,
      lng: -58.39,
    })

    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://places.googleapis.com/v1/places:searchText')
    expect(init.method).toBe('POST')
    const headers = init.headers as Record<string, string>
    expect(headers['X-Goog-FieldMask']).toBe(SEARCH_FIELD_MASK)
    expect(headers['X-Goog-FieldMask']).not.toContain('rating') // evita subir al SKU Enterprise
    expect(headers['X-Goog-FieldMask']).not.toContain(' ')
    expect(headers['X-Goog-Api-Key']).toBe('test-key')
    const body = JSON.parse(init.body as string)
    expect(body).toMatchObject({
      textQuery: 'Pizzería La Esquina Lanús',
      regionCode: 'AR',
      pageSize: 5,
    })
    expect(body.locationBias.circle.radius).toBe(20000)

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      id: 'ChIJ_FIXTURE_NO_REAL_0001',
      name: 'Pizzería La Esquina',
    })
    expect(results[0]?.provenance.live).toBe(true)
  })

  it('getDetails: pide la field mask del detalle y mapea al esquema común', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(detailsFixture))
    const provider = new GooglePlacesProvider({ apiKey: 'test-key', fetchImpl, now: NOW })
    const profile = await provider.getDetails('ChIJ_FIXTURE_NO_REAL_0001')

    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/places/ChIJ_FIXTURE_NO_REAL_0001')
    expect((init.headers as Record<string, string>)['X-Goog-FieldMask']).toBe(DETAILS_FIELD_MASK)

    expect(profile.origin).toBe('places')
    expect(profile.country).toBe('AR') // sale de addressComponents, no de la IP
    expect(profile.fields.name.value).toBe('Pizzería La Esquina')
    expect(profile.fields.address.value).toMatchObject({
      street: 'Avenida Hipólito Yrigoyen 1234',
      city: 'Lanús',
      region: 'Provincia de Buenos Aires',
      country: 'AR',
    })
    expect(profile.fields.rating.value).toBe(4.3)
    expect(profile.fields.reviewCount.value).toBe(812)
    expect(profile.fields.priceLevel.value).toBe('$$')
    expect(profile.fields.businessType.value).toBe('pizzeria')
    expect(profile.fields.openingHours.value).toHaveLength(7)
    expect(profile.fields.deliveryOffered.value).toBe(true)
    // badge "en vivo": provenance.live, fecha de la consulta
    expect(profile.fields.rating.provenance).toMatchObject({
      live: true,
      real: true,
      capturedAt: '2026-11-02',
    })
  })

  it('campos ausentes en la respuesta = not_found (no false); sin sitio web = absent', () => {
    const sparse = {
      id: 'ChIJ_FIXTURE_NO_REAL_0002',
      displayName: { text: 'Sin datos' },
    } as PlacesPlace
    const profile = mapDetails(sparse, NOW())
    expect(profile.fields.rating.status).toBe('not_found')
    expect(profile.fields.reviewCount.status).toBe('not_found')
    expect(profile.fields.openingHours.status).toBe('not_found')
    expect(profile.fields.dineIn.status).toBe('not_found')
    expect(profile.fields.dineIn.value).toBeNull()
    expect(profile.fields.website.status).toBe('absent')
    expect(profile.fields.delivery.status).toBe('not_found') // Places no informa las apps
    expect(profile.country).toBeNull() // fuera de los 5 países o sin dirección
  })

  it('un error HTTP (429) lanza, sin filtrar la key', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response('{"error":{"status":"RESOURCE_EXHAUSTED"}}', { status: 429 }))
    const provider = new GooglePlacesProvider({ apiKey: 'secret-key-123', fetchImpl })
    const error = await provider.search('x y').catch((e: Error) => e)
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toContain('429')
    expect((error as Error).message).not.toContain('secret-key-123')
  })
})

describe('createGateway: selección y fallback places → snapshot', () => {
  const snapshot = new SnapshotProvider()

  it('por defecto usa snapshot', () => {
    expect(createGateway({}, { snapshot })).toBe(snapshot)
  })

  it('DATA_SOURCE=mock usa MockProvider', () => {
    expect(createGateway({ DATA_SOURCE: 'mock' })).toBeInstanceOf(MockProvider)
  })

  it('places sin key → snapshot y lo registra en el log', () => {
    const log = vi.fn()
    const gw = createGateway({ DATA_SOURCE: 'places' }, { snapshot, log })
    expect(gw).toBe(snapshot)
    expect(log).toHaveBeenCalledWith(expect.stringContaining('falta GOOGLE_PLACES_API_KEY'))
  })

  it('places que falla en search → resultados del snapshot + log', async () => {
    const log = vi.fn()
    const broken = {
      search: vi.fn().mockRejectedValue(new Error('Google Places respondió 429')),
      getDetails: vi.fn().mockRejectedValue(new Error('Google Places respondió 429')),
    }
    const gw = createGateway(
      { DATA_SOURCE: 'places', GOOGLE_PLACES_API_KEY: 'k' },
      { snapshot, places: broken, log },
    )
    const results = await gw.search('piki')
    expect(results[0]?.id).toBe('ar-pizzeria-piki-lanus')
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/search.*429.*snapshot/))

    const profile = await gw.getDetails('ar-pizzeria-piki-lanus')
    expect(profile.origin).toBe('snapshot')
  })

  it('places sano → usa Places', async () => {
    const places = {
      search: vi.fn().mockResolvedValue([]),
      getDetails: vi.fn(),
    }
    const gw = createGateway(
      { DATA_SOURCE: 'places', GOOGLE_PLACES_API_KEY: 'k' },
      { snapshot, places },
    )
    await gw.search('algo')
    expect(places.search).toHaveBeenCalledOnce()
  })

  it('las sugerencias de "no encontrado" siempre salen del snapshot', async () => {
    const places = { search: vi.fn(), getDetails: vi.fn() }
    const gw = createGateway(
      { DATA_SOURCE: 'places', GOOGLE_PLACES_API_KEY: 'k' },
      { snapshot, places },
    )
    expect(await gw.suggest?.()).toHaveLength(13)
  })
})
