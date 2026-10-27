import { describe, expect, it } from 'vitest'
import { compareWithNeighbors } from '../src/domain/neighbors'
import { summaryOf } from '../src/gateway/shared'
import type { PlaceSummary } from '../src/domain/types'
import { IDS, place } from './helpers'
import { SnapshotProvider } from '../src/gateway/SnapshotProvider'

const catalog = await new SnapshotProvider().suggest()

async function compare(id: string) {
  return compareWithNeighbors(summaryOf(await place(id)), catalog)
}

describe('comparación con vecinos (locales reales del snapshot)', () => {
  it('AR: El Campeón se compara con los otros locales argentinos, nunca consigo mismo ni con otro país', async () => {
    const c = await compare(IDS.campeon)
    expect(c).not.toBeNull()
    expect(c!.country).toBe('AR')
    expect(c!.peers.map((p) => p.id)).not.toContain(IDS.campeon)
    expect(c!.peers.length).toBe(catalog.filter((p) => p.country === 'AR').length - 1)
    // los datos vienen del snapshot, con su procedencia real
    for (const p of c!.peers) expect(p.provenance.real).toBe(true)
  })

  it('el rango sale de los pares y la posición del local es coherente', async () => {
    const c = (await compare(IDS.campeon))!
    const reviews = c.peers.map((p) => p.reviewCount).filter((n): n is number => n !== null)
    expect(c.reviews?.min).toBe(Math.min(...reviews))
    expect(c.reviews?.max).toBe(Math.max(...reviews))
    // 6.167 reseñas: lo supera Bar El Federal (11.911) y lo siguen Las Palmas y Piki
    expect(c.reviewsRank).toEqual({ position: 2, outOf: c.peers.length + 1 })
    expect(c.peers[0]!.reviewCount).toBeGreaterThanOrEqual(c.peers[1]!.reviewCount ?? 0)
  })

  it('marca los pares de la misma ciudad y del mismo tipo', async () => {
    const c = (await compare(IDS.campeon))!
    const palmas = c.peers.find((p) => p.id === 'ar-pizzeria-las-palmas-lanus')!
    const federal = c.peers.find((p) => p.id === IDS.federal)!
    expect(palmas.sameCity && palmas.sameType).toBe(true)
    expect(federal.sameCity || federal.sameType).toBe(false)
    expect(c.sameCityCount).toBe(c.peers.filter((p) => p.sameCity).length)
  })

  it('MX: compara contra los otros locales mexicanos', async () => {
    const c = (await compare(IDS.reds))!
    expect(c.country).toBe('MX')
    expect(c.peers.every((p) => p.id.startsWith('mx-'))).toBe(true)
  })

  it('un par sin rating ni reseñas no cuenta: CO sin pares con datos → null', async () => {
    // El Social (4,5 · 4.016) solo tiene de par a la dark kitchen, que no tiene ni rating ni reseñas
    expect(await compare('co-el-social-tienda-mixta-medellin')).toBeNull()
  })

  it('BR con un único local en el catálogo → null (no se muestra)', async () => {
    expect(await compare(IDS.diavola)).toBeNull()
  })

  it('un local sin rating ni reseñas igual ve el rango de sus pares, pero sin puesto', async () => {
    const c = (await compare(IDS.darkKitchen))!
    expect(c).not.toBeNull()
    expect(c.you.reviewCount).toBeNull()
    expect(c.reviewsRank).toBeNull()
    expect(c.ratingRank).toBeNull()
    expect(c.reviews?.max).toBe(4016)
  })

  it('sin país o sin catálogo → null; los empates comparten puesto', () => {
    const base: PlaceSummary = {
      id: 'x',
      name: 'X',
      addressLine: '',
      city: 'Lanús',
      country: 'AR',
      businessType: 'pizzeria',
      rating: 4.2,
      reviewCount: 100,
      provenance: { source: 's', capturedAt: '2026-10-26', real: true },
    }
    expect(compareWithNeighbors({ ...base, country: null }, [base])).toBeNull()
    expect(compareWithNeighbors(base, [])).toBeNull()
    const tied = compareWithNeighbors(base, [{ ...base, id: 'y', name: 'Y' }])!
    expect(tied.reviewsRank).toEqual({ position: 1, outOf: 2 })
  })
})
