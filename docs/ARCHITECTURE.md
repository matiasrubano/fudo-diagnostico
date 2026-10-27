# Arquitectura

Vite + React + TypeScript (strict) + Tailwind en el front; funciones serverless de Vercel en `app/api/`. Sin base de datos y sin LLM en runtime.

## Flujo de datos

```
1. Hero            GET  /api/places-search?q=...      → { results, suggestions, notFound }
2. "¿Es este?"     (el usuario elige un resultado o una sugerencia)
3. 4 preguntas     (estado local del navegador)
4. Resultado       POST /api/diagnose { placeId, answers } → Diagnosis
5. Ruteo           según Diagnosis.lead.tier (se muestra en la misma pantalla)
```

- `api/*.ts` son handlers Web-standard (`export default { fetch(request) }`): reciben un `Request`, devuelven un `Response`. Hacen validación y llaman a `src/server/diagnosisService.ts`.
- `diagnosisService` = `gateway.getDetails(id)` + `domain.diagnose(profile, answers)`.
- `domain/diagnose.ts` junta cuatro funciones puras: `scoreProfile`, `buildRecommendations`, `estimateMoneyLost`, `classifyLead`. Sin I/O: se testean con los JSON reales del snapshot.
- El país del local sale de `address.country` (snapshot) o de `addressComponents` (Places). El header `x-vercel-ip-country` **solo sesga la búsqueda** (`geoBiasFromHeaders`).
- En desarrollo, `scripts/vite-api-plugin.mts` carga `api/*.ts` con `ssrLoadModule` y los sirve como middleware: `npm run dev` anda sin Vercel CLI. También lee `.env.local` hacia `process.env` (solo del lado servidor).

## Gateway de datos (`src/gateway/`)

```ts
interface PlaceDataProvider {
  search(query: string, geoBias?: GeoBias): Promise<PlaceSummary[]>
  getDetails(id: string): Promise<PlaceProfile>
  suggest?(geoBias?: GeoBias): Promise<PlaceSummary[]>   // solo catálogos cerrados
}
```

Todos los proveedores devuelven el **mismo esquema** que el snapshot: cada campo es `{ value, status: 'found' | 'not_found' | 'absent', provenance: { source, url, capturedAt, real, live?, note? } }`.

| `status` | Significa | En el scoring |
|---|---|---|
| `found` | lo encontramos | se evalúa |
| `not_found` | **no sabemos** | se descarta del promedio (no penaliza); si queda menos de la mitad del área, "sin datos suficientes" |
| `absent` | verificado que **no existe** | cuenta como 0 |

`provenance` alimenta los badges de la UI: `live` → "en vivo"; `real` → "real · capturado el dd/mm/aaaa"; el resto → "simulado".

Selección (`gateway/index.ts → createGateway`):

| `DATA_SOURCE` | Proveedor | Si falla |
|---|---|---|
| `snapshot` (default) | `SnapshotProvider` (lee `app/data/snapshots/*.json`) | — |
| `places` + `GOOGLE_PLACES_API_KEY` | `FallbackProvider(GooglePlacesProvider → SnapshotProvider)` | cae a snapshot y deja `[gateway] … usando snapshot` en el log |
| `places` sin key | `SnapshotProvider` | log de aviso |
| `mock` | `MockProvider` | — |

`GooglePlacesProvider` usa field masks mínimos (docs/research/datos.md §1.2): búsqueda con SKU Pro (sin `rating`, que la subiría a Enterprise) y detalle con Enterprise + Atmosphere. Un campo ausente en la respuesta es `not_found`, no `false`.

### Cómo agregar un proveedor

1. Crear `src/gateway/MiProveedor.ts` que implemente `PlaceDataProvider` y devuelva `PlaceProfile` con `provenance` por campo.
2. Sumarlo a `createGateway` con un valor nuevo de `DATA_SOURCE` (y a `DataSource`).
3. Test con `fetch` mockeado y un fixture marcado como ficticio (ver `tests/gateway.places-fallback.test.ts`).

### Cómo agregar un país

1. `app/src/config/countries.json`: moneda, ente fiscal, apps de delivery, planes, `fudoSignupUrl`, `productName` (con su fuente y fecha).
2. `COUNTRY_CODES` en `src/domain/types.ts`.
3. Supuestos del país: `ASSUMPTIONS.avgTicket` y `roundTo` en `moneyLost.ts`; `BILLING_PITCH` en `recommendations.ts`; rutas de módulos si cambia el patrón de URL (`MODULE_PATH`); `LOCALE`/`CURRENCY` en `ui/format.ts`.
4. Los tipos fuerzan a completar los `Record<CountryCode, …>`: `npm run typecheck` dice qué falta.
5. Locales de ejemplo en `app/data/snapshots/` (el país se deriva de `address.country`).

## Dominio (`src/domain/`)

| Archivo | Qué hace | Se toca para… |
|---|---|---|
| `scoring.ts` | Nota por área (google, reseñas, web, delivery, operación) y general. **Pesos y umbrales en constantes arriba** | cambiar cómo se puntúa |
| `recommendations.ts` | Lista de reglas `{cuándo, texto por país, módulo de Fudo con URL}`; top 5 por impacto | cambiar qué se recomienda |
| `leadTier.ts` | caliente / switcher / nutrir / descartar / por-abrir según volumen proxy (reseñas), sistema actual, canales y locales | cambiar el filtro |
| `moneyLost.ts` | "Plata que se escapa por mes": 3 componentes con supuestos nombrados | cambiar los supuestos |
| `links.ts` | UTM de todos los links salientes (`utm_source=diagnostico&utm_medium=tool&utm_campaign=<area>`) | — |

La UI muestra la cuenta de la plata perdida paso a paso ("¿Cómo calculamos esto?") leyendo las mismas constantes `ASSUMPTIONS`.

## Interfaz

- `src/content/copy.ts`: **todos** los textos (salvo las recomendaciones, que viven con sus reglas).
- `src/theme/tokens.ts` → `tailwind.config.ts`: colores, fuentes, radios y sombras de Fudo. El naranja de marca `#FF5023` con texto blanco da 3,27:1 (no pasa AA para texto chico): los botones usan `#D03F00` (4,78:1).
- `src/ui/screens/`: Hero, PickPlace, Questions, Result, Routes (un componente por tier), Debug. `src/ui/components/`: badges, modal (`<dialog>` nativo), layout.
- Accesibilidad: foco visible, el título de cada paso recibe el foco al cambiar de pantalla, objetivos táctiles ≥44 px, `role=radiogroup`/`aria-pressed` en las preguntas.
- `src/analytics/events.ts`: `diag_start`, `place_selected`, `q_answered_1..4`, `result_viewed`, `lead_tier`, `cta_click` → localStorage + `/debug` (tabla, embudo, limpiar).

## Blog prerenderizado (GEO)

- Fuente: `app/content/blog/*.md` con frontmatter YAML (`title, slug, country, lang, description, keyword, question, updatedAt, author, status, faq, sources, verifyNotes, cta`). Si falta un campo, el build **falla** con el nombre del archivo.
- `npm run build` = `tsc` → `vite build` → `tsx scripts/prerender.ts`. El script (con `marked` + `yaml`) escribe en `dist/`:
  - `blog/index.html` (índice por país, con anclas `#ar`, `#mx`…) y `blog/<slug>/index.html`: el artículo completo **en el HTML, sin JS**, con `<title>`/description propios, canonical, OG/Twitter, `inLanguage`, JSON-LD `Article` + `FAQPage` + `BreadcrumbList`, FAQ visible, fuentes con links, caja "Pendiente de verificación" y CTA al diagnóstico.
  - `index.html` (home): meta no genérica, JSON-LD `WebApplication`, contenido estático dentro de `#root` (React lo reemplaza) y links a las guías.
  - `sitemap.xml`, `llms.txt` (propuesta llmstxt.org; no es un estándar) y `robots.txt` (de `public/`).
- Las páginas reutilizan el CSS de Tailwind compilado por Vite (`scripts/` está en los `content` de Tailwind).
- `SITE_URL` (env) define el dominio de canonical/sitemap/llms.txt; default = placeholder.
- `vercel.json`: `trailingSlash: true` y rewrite de SPA que **no** pisa `/blog/*`, `/api/*`, `sitemap.xml`, `robots.txt` ni `llms.txt`.

Ver [ADR 0004](adr/0004-blog-prerenderizado-geo.md).

## Tests y CI

`npm test` (Vitest, entorno node): `domain/` (scoring por perfil, las 5 rutas de leadTier, plata perdida, recomendaciones por país), `gateway/` (SnapshotProvider sobre los 13 JSON reales, MockProvider, GooglePlacesProvider con fixture ficticio y `fetch` mockeado, fallback) y el pipeline del blog. `.github/workflows/ci.yml` corre lint + typecheck + test + build sobre `app/`.
