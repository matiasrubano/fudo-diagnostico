# Diagnóstico gratis para restaurantes + "Tu Fudo ya armado"

> **Demo en vivo:** _pendiente (se completa al publicar en Vercel)_ · **Video (60–90 s):** _pendiente_ · **Informe:** [`docs/informe/`](docs/informe/) (pendiente)

Herramienta gratuita que **diagnostica la presencia online de un restaurante** (ficha de Google, reseñas, web, apps de delivery y operación) y lo lleva a crear su cuenta de Fudo con el local ya cargado. Es una demo para una entrevista en Fudo: lo real está marcado como real (con fecha de captura) y lo simulado, como simulado.

**Cómo funciona, en 60 segundos del dueño:** la home arranca desde una escena real que rota entre los locales del snapshot (viernes 21:30, alguien busca "pizza en Lanús"; sábado 23:00, "bar en Medellín"…) y muestra la **comanda real** de un local → elige uno de los 13 locales reales de la demo en una tarjeta (no hay buscador: en producción busca el suyo con Google Places) → responde 4 preguntas → ve su comanda (una nota por área, en lenguaje de dueño), cómo está contra otros locales reales de la demo de su país, qué mejorar primero y cuánta plata se le escapa por mes → según su perfil lo llevamos a _"Tu Fudo ya armado"_ (caliente), a migrar (switcher) o a guías (nutrir). Quien todavía no abrió (link de la home, opción de la P1) va a otra ruta, sin diagnóstico: el Consultor de Nuevos Negocios y la guía de trámites de su país. La home se adapta al país del visitante (`/api/geo`) y la búsqueda dice "No encontramos «X»" en vez de mostrar otro local.

## Correrlo (3 comandos)

```bash
cd app
npm ci
npm run dev        # http://localhost:5173 · no necesita Vercel CLI ni login ni keys
```

`npm run dev` monta `app/api/*` como middleware de Vite, con los mismos handlers que corren en Vercel. Para el resto: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` (incluye el prerender del blog).

## Arquitectura en una imagen

```
Frontend (React) ──► /api/places-search ┐
                 ──► /api/diagnose ─────┤
                                        ▼
                               DiagnosisService
                                 │            │
                  scoring · recomendaciones   DataGateway ──► Provider
                  · tier · plata perdida              ├─ SnapshotProvider     (default · locales reales capturados el 26/10/2026)
                  (src/domain, funciones puras)       ├─ GooglePlacesProvider (activo con DATA_SOURCE=places + GOOGLE_PLACES_API_KEY)
                                                      └─ MockProvider         (tests y último recurso)
                                                  Si places falla → cae a snapshot y lo loguea.
```

El frontend **nunca** conoce el proveedor ni las keys: solo habla con `/api/*`. Detalle en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) y en los [ADR](docs/adr/).

## Qué es real y qué es simulado

| Qué | Estado | Detalle |
|---|---|---|
| Datos del local (nombre, dirección, rating, reseñas, horarios, web, delivery) | **real** | 13 locales reales capturados el 26/10/2026 de la ficha pública de Google y de las apps, con `provenance` por campo. Solo para la demo ([ADR 0002](docs/adr/0002-snapshot-vs-api.md)) |
| Precios de planes, módulos y links de Fudo | **real** | Publicados en fu.do, capturados el 26/10/2026 (`app/src/config/countries.json`) |
| Notas por área y recomendaciones | **real** (cálculo) | Reglas sobre datos reales, sin IA ([ADR 0003](docs/adr/0003-scoring-por-reglas.md)) |
| "Cuánta plata se te escapa por mes" | **simulado** | Estimación con supuestos visibles en la pantalla (ticket, pedidos, comisión) |
| Cuenta precargada, carta y botón "crear cuenta" | **simulado** | Hoy el alta de fu.do no acepta precarga de datos |
| Email de guías, migración de datos | **simulado** | No se envía ni se importa nada |
| Comparación con vecinos | **real** | Rating y reseñas de los otros locales reales del snapshot del mismo país (sin pares, no se muestra). No es un promedio de mercado |
| Instagram y apps de delivery | **solo presencia** | Se verifica que exista el perfil/link; no hay métricas (no hay API pública) |
| Google Places en vivo | **implementado, apagado** | `DATA_SOURCE=places` + key; con test de fixture ficticio |
| Brasil | **recorte declarado** | Marca Deli y precios reales, pero el contenido sigue en español (falta i18n a portugués) |

## Estructura

```
app/
  api/              funciones serverless (diagnose.ts, places-search.ts, showcase.ts, geo.ts)
  src/
    domain/         scoring.ts · recommendations.ts · leadTier.ts · moneyLost.ts · neighbors.ts · showcase.ts (puros, con tests)
    gateway/        PlaceDataProvider · SnapshotProvider · GooglePlacesProvider · MockProvider · index.ts
    server/         diagnosisService.ts (une gateway + dominio)
    config/         countries.json (moneda, ente fiscal, apps, planes y URLs por país)
    content/        copy.ts (todos los textos; voz por país: base voseo + overrides MX/CL/CO con tuteo)
    theme/          tokens.ts (marca de Fudo)
    ui/ analytics/  pantallas, componentes y eventos (/debug)
  data/snapshots/   JSON de restaurantes reales
  content/blog/     guías en markdown (frontmatter YAML) → HTML estático en el build
  scripts/          prerender.ts · blog.ts · pages.ts (home y landings /ar/ /mx/ /cl/ /co/) · vite-api-plugin.mts
  tests/            Vitest: domain y gateway (sobre los JSON reales)
docs/               ARCHITECTURE.md · adr/ · research/ (G1)
PLAN.md             plan del proyecto
```

## Para tocar en vivo (cambio de 15 minutos)

| Quiero cambiar… | Archivo |
|---|---|
| Un texto de la interfaz | `app/src/content/copy.ts` |
| Voseo o tuteo de un país, o un texto de una landing | `app/src/content/copy.ts` → `OVERRIDES.<PAÍS>` (lo que no se pisa se hereda del base) |
| Qué local se muestra como ticket de ejemplo | `app/src/domain/showcase.ts` → `FEATURED_PLACE` |
| Colores, tipografías, radios | `app/src/theme/tokens.ts` |
| Pesos y umbrales de la nota | `app/src/domain/scoring.ts` (bloque de constantes arriba) |
| Qué se recomienda y a qué módulo enlaza | `app/src/domain/recommendations.ts` |
| Quién es "caliente" / "switcher" / "nutrir" | `app/src/domain/leadTier.ts` |
| Supuestos de la plata perdida | `app/src/domain/moneyLost.ts` |
| Agregar un país o un proveedor | ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |

## Variables de entorno

Ver [`app/.env.example`](app/.env.example): `DATA_SOURCE` (`snapshot` por defecto), `GOOGLE_PLACES_API_KEY` (vacía), `SITE_URL` (canonical y sitemap del blog). **Nunca se versionan keys**: `.env*` está en `.gitignore`.

## Aviso sobre el snapshot

Los datos de los locales vienen de la ficha pública de Google (y de PedidosYa/Rappi/etc.). Los Términos de Maps Platform no permiten cachear esos datos más allá de lo autorizado, por eso el snapshot está **fechado y declarado en la UI**, es solo para la demo, y en producción se consulta la API oficial. Riesgo y alternativas en el [ADR 0002](docs/adr/0002-snapshot-vs-api.md).
