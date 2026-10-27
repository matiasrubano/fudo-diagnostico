import { isLandingCountry, type LandingCountry } from '../domain/showcase'
import type { ShowcaseResponse } from '../server/diagnosisService'
import type { GuideLink } from './screens/Home'

/**
 * Datos con los que se prerenderiza una página (home o landing) y que viajan embebidos en el HTML
 * (<script type="application/json" id="page-data">). Así React arranca con el MISMO contenido que ya ve el crawler,
 * sin parpadeo ni un fetch extra. En `npm run dev` no hay prerender: se pide a /api/showcase.
 */
export interface PageData {
  country: LandingCountry | null
  showcase: ShowcaseResponse
  guides: GuideLink[]
}

export const PAGE_DATA_ID = 'page-data'

export function readPageData(): PageData | null {
  try {
    const raw = document.getElementById(PAGE_DATA_ID)?.textContent
    return raw ? (JSON.parse(raw) as PageData) : null
  } catch {
    return null
  }
}

/** "/mx/" → "MX"; cualquier otra ruta → null */
export function landingCountryFromPath(pathname: string): LandingCountry | null {
  const slug = pathname.replace(/^\/|\/$/g, '').toUpperCase()
  return isLandingCountry(slug) ? slug : null
}

/** JSON listo para ir dentro de un <script>: se escapa "<" para que nada cierre la etiqueta. */
export function serializePageData(data: PageData): string {
  return JSON.stringify(data).replace(/</g, '\u003c')
}
