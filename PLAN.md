# PLAN — Caso Fudo: "Diagnóstico + Tu Fudo ya armado"

> **Ubicación de este archivo:** `C:\Users\m_rubano\FUDO\PLAN.md`
> **Raíz del proyecto y del repo:** `C:\Users\m_rubano\FUDO\` (todo lo que se produzca vive acá adentro)
> Documento vivo. El orquestador marca cada goal como `[ ]` pendiente, `[~]` en curso, `[x]` hecho, y anota la evidencia debajo y en la Bitácora (§8).
> **Outputs finales:** 1) App publicada en **Vercel** · 2) Código en **GitHub** (lo lee el equipo técnico de Fudo) · 3) Informe de hasta 2 páginas · 4) Video demo · (+ log de prompts, exigido por el caso). Las ubicaciones y URLs finales se completan en **§7 Entregables**.

---

## 0. Norte del caso (no se discute más)

| Decisión | Valor |
|---|---|
| Solución | **Opción A**: diagnóstico híbrido = datos reales del local + 3–4 preguntas de calificación → nota por área → CTA "**tu cuenta de Fudo ya viene con tu nombre, horarios y carta cargados**" |
| Datos | **Gateway de datos** con proveedores intercambiables (§2-G2). La demo corre sobre **restaurantes reales** capturados en un *snapshot* fechado. El proveedor de Google Places queda implementado y se activa con una variable de entorno. Así el punto "qué harías después" del informe ya está en el código |
| Países | **Los 5** (AR, MX, CL, CO, BR). País detectado por la **dirección del local**; la IP solo sesga la búsqueda. Contenido completo para **AR + MX**, básico para CL/CO, **BR = recorte declarado** (falta i18n a portugués) |
| Segmento núcleo | Restaurantes, bares y pizzerías de **1–3 locales, con volumen y delivery**. Otros segmentos entran, pero el scoring los rutea distinto |
| Filtro | Proxy de volumen gratis (cantidad de reseñas) + sistema actual + canales + locales → **caliente / switcher / nutrir / descartar** ("por abrir" → Consultor de Nuevos Negocios de Fudo) |
| Palanca que movemos | Conversión **cuenta → pago** (10% → 15%) y **activación** a 7 días (indicador temprano) |
| Naturaleza | **Demo para entrevista**. Lo real se marca como real (con fecha de captura); lo simulado, como simulado |
| Reglas del caso | Solo planes gratuitos · entrega en español · el diseño no suma, pero tiene que ser prolijo y **100% responsive** · en la entrevista hay un **cambio en vivo de 15 min**, así que el código tiene que ser fácil de tocar |
| Marca | Colores de Fudo (naranja/rojo de fondo + azul de acento + blanco). Los tokens exactos los saca el Investigador del CSS de fu.do |

### Línea de base (del caso)
80.000 visitas/mes → 1,2% → **960 cuentas** → 10% → **96 pagos/mes** · CAC pauta ≈ USD 200 · ticket USD 50 → recupero en 4 meses.
Tamaño del experimento: para ver 10% → 15% (cuenta→pago) con α=0,05 y potencia 80% hacen falta **~680 cuentas por brazo**. Con todos los países sumados, eso da ~6–8 semanas.

---

## 1. Equipo de agentes

- **Orquestador:** la sesión que ejecuta este plan. No escribe el código grande: delega, revisa, integra, actualiza este archivo y hace commits.
- **Subagentes:** todos con `model: "sonnet"` vía la herramienta Agent. Cada brief es autocontenido: incluye la ruta de este PLAN, el goal que le toca y las rutas de entrada y salida. Pueden buscar y usar las skills disponibles (`ui-ux-pro-max`, `webapp-testing`, `remotion-*`, `docx`, `pdf`, `dataviz`, etc.).

| # | Agente | Contexto | Entrada | Salida |
|---|---|---|---|---|
| A1 | **Investigador** | Fresh, con brief | §0 + G1 | `docs/research/*.md`, `app/src/config/countries.json`, `app/data/snapshots/*.json` |
| A2 | **Constructor** | Fresh, con brief + outputs de A1 | G1 + G2 + G3 | App en `app/` + repo + deploy |
| A3 | **QA responsive** | Fresh | URL + checklist G4 | `docs/qa/report.md` + capturas |
| A4 | **Dueño simulado** ×4 | **SIN memoria del proyecto**: solo persona + URL | Persona + URL | `docs/feedback/persona-*.md` |
| A5 | **Constructor (iteración)** | Reanuda A2 vía SendMessage (o uno nuevo con brief) | Feedback de A3 + A4 | App v2 |
| A6 | **Redactor del informe** | Fresh, con todos los outputs | `docs/research/`, `docs/feedback/`, §0 | `docs/informe/Informe-Fudo.docx` + `.pdf` |
| A7 | **Guionista de video** | Fresh | App final + informe | `video/guion.md` |
| A8 | **Video** (Remotion + ElevenLabs) | Fresh | Guion aprobado + capturas | `video/out/*.mp4` |
| A9 | **Archivista de prompts** | Fresh | Briefs + transcripción | `docs/prompts/LOG.md` |

**Gates humanos (Matías)** — el orquestador **se detiene y pregunta**; nunca los salta:
- 🔒 **G-OK0**: antes de crear el repo en GitHub (confirmar nombre y visibilidad pública/privada) y antes del primer deploy en Vercel
- 🔒 **G-OK1**: la app final, después de G5
- 🔒 **G-OK2**: el guion, antes de generar la voz
- 🔒 **G-OK3**: entrega final

---

## 2. Goals

### G1 — Investigación `[x]` · A1
**Objetivo:** que nada de lo que construyamos esté inventado.
- [x] **Marca:** tokens exactos de fu.do (hex de naranja, azul, neutros, tipografía, radios) → `docs/research/brand.md`
- [x] **Tabla de países** `app/src/config/countries.json`:
  - moneda
  - ente fiscal (ARCA / SAT-CFDI / SII / DIAN / NF-e)
  - apps de delivery dominantes
  - precios de los planes de Fudo en moneda local (si están publicados)
  - URL de crear cuenta por país
  - idioma
- [x] **Snapshot de restaurantes reales** → `app/data/snapshots/<pais>-<slug>.json`:
  - **12–15 locales**: 3–4 de AR, 3–4 de MX, 2 de CL, 2 de CO, 1 de BR
  - mezcla de perfiles: pizzería con mucho delivery, bar, cadena chica, dark kitchen, uno con mala presencia online, uno muy bien posicionado
  - **solo datos públicos del negocio**: nombre, dirección, país, rating, cantidad de reseñas, horarios, web, links a apps de delivery, Instagram, tipo
  - **sin datos personales** de quienes dejan reseñas (ni nombres ni textos identificables)
  - cada campo con `provenance: { source, url, capturedAt, real: true|false }`
- [x] **Google Places API (New):**
  - campos útiles (`displayName`, `rating`, `userRatingCount`, `regularOpeningHours`, `websiteUri`, `delivery`, `takeout`, `dineIn`, `priceLevel`, `addressComponents`)
  - costo por SKU, tier gratuito, field masks
  - **ToS de caché** (por qué el snapshot es solo para la demo)
  - → `docs/research/datos.md`
- [x] **Otras fuentes** y cómo se conseguirían en producción:
  - Instagram (Graph API / límites)
  - PedidosYa, Rappi, iFood (sin API pública: scraping y ToS)
  - web propia (fetch + PageSpeed API)
  - marcar **real vs simulado** para la demo
- [x] **Herramientas existentes de Fudo** (tools.fu.do: Especialista en Google, Analista de Reseñas, Fudo Sitios, Carga asistida de carta) → cómo las unifica nuestro flujo
- [x] **Benchmark:** Owner.com Grader, Upserve Marketing Grader, 1–2 quizzes de SaaS gastronómico de LATAM/España
- [x] **Distribución:** keywords SEO/AEO por país, páginas programáticas, alianzas (cámaras gastronómicas, contadores, hardware)
- [x] **Costo estimado por diagnóstico** (Places + LLM opcional) en USD → `docs/research/costos.md`
- [x] **(D4) GEO/AEO:** preguntas reales que hacen los dueños (People Also Ask, foros, Reddit, grupos) por país → plan de 6–8 artículos del blog con keyword, intención y fuentes → `docs/research/geo-blog.md`
- [x] **(D4) MCP:** cómo se distribuiría una herramienta vía MCP / apps dentro de ChatGPT, Claude y Gemini (estado actual, requisitos, ejemplos) → `docs/research/mcp.md`

**Evidencia (2026-10-26):** `docs/research/` → brand, paises, fudo-tools, benchmark, datos, costos, distribucion, geo-blog, mcp, snapshot (+ `countries.json`, 13 snapshots). Hallazgos: BR se vende como **Deli** (`productName`); el alta de fu.do no acepta precarga → "Tu Fudo ya armado" es simulado; costo ≈ USD 0,057/diagnóstico (1.000/mes gratis); FAQPage ya no da rich result; páginas por ciudad = doorway + choque con ToS Places → fuera; blanco sobre #FF5023 no pasa AA → texto chico en #D03F00. **Riesgo para G-OK0:** el snapshot trae datos de la ficha de Google → si el repo es público, choca con el ToS de Maps (§3.2.3).

**Listo cuando:** todos los ítems tienen fuente (link). Lo que no se encontró se declara como "no encontrado", sin inventar.

### G2 — Arquitectura y app `[x]` · A2
**Stack:** Vite + React + TypeScript + Tailwind en el front, con **funciones serverless de Vercel** en `app/api/`. Es todo gratis y se puede editar en vivo.

**Gateway de datos (el corazón técnico):**
```
Frontend ──► /api/diagnose ──► DiagnosisService ──► DataGateway ──► Provider
                                   │                                ├─ SnapshotProvider    (default · restaurantes reales capturados)
                                   ├─ scoring (puro)                ├─ GooglePlacesProvider (activo si GOOGLE_PLACES_API_KEY)
                                   └─ recomendaciones (por país)    └─ MockProvider         (tests y fallback)
```
- `interface PlaceDataProvider { search(query, geoBias?): PlaceSummary[]; getDetails(id): PlaceProfile }`
- Se selecciona con `DATA_SOURCE=snapshot|places|mock`. Si `places` falla, cae a `snapshot` y lo registra en el log
- Cada dato lleva su `provenance` y la UI muestra un badge: **"real · capturado el dd/mm"** / **"en vivo"** / **"simulado"**
- El frontend **nunca** conoce el proveedor ni las keys
- Búsqueda con la IP: `x-vercel-ip-country` sesga los resultados; el país final sale de `addressComponents`
- Nombre que no está en el snapshot: aviso "en la demo cubrimos estos locales reales: …" con sugerencias clickeables. En producción, eso lo resuelve Places

**Flujo (mobile-first):**
1. **Hero:** "¿Cómo está tu restaurante? Diagnóstico gratis en 60 segundos" + buscador
2. **Confirmación:** foto, dirección, rating → "¿Es este?"
3. **4 preguntas** (una por pantalla, con barra de progreso):
   - tipo de negocio
   - canales de venta
   - cómo cobrás y facturás hoy
   - cantidad de locales
4. **Resultado:**
   - nota general y nota por área (Google, reseñas, web, delivery, **operación**)
   - recomendaciones localizadas, cada una enlazada a un módulo de Fudo
   - "cuánta plata se te escapa por mes", en moneda local
5. **Ruteo:**
   - **caliente** → "Tu Fudo ya armado": preview de la cuenta precargada → botón que simula crear la cuenta en fu.do
   - **switcher** → mismo CTA + "migramos tus datos"
   - **nutrir** → descargables + email
   - **por abrir** → Consultor de Nuevos Negocios
6. **Instrumentación:** eventos `diag_start`, `place_selected`, `q_answered_n`, `result_viewed`, `lead_tier`, `cta_click`, en un panel `/debug` para la entrevista

**Requisitos no negociables:**
- [x] **Responsive** en 360, 375, 768, 1024 y 1280 px, sin scroll horizontal, objetivos táctiles ≥44 px
- [x] Tokens de Fudo en un único `src/theme/tokens.ts`
- [x] Copy en `src/content/copy.ts`; reglas de scoring y pesos en `src/domain/scoring.ts` (puro); recomendaciones por país en `src/domain/recommendations.ts`. **El cambio en vivo de la entrevista tiene que salir tocando un solo archivo**
- [x] Gemini es **opcional** (D3). Sin key, las recomendaciones salen de plantillas por reglas
- [x] **(D4) Blog GEO** en `app/content/blog/*.md` (6–8 artículos de `docs/research/geo-blog.md`), cada página con respuesta directa arriba, FAQ, JSON-LD `Article` + `FAQPage`, CTA al diagnóstico; `public/llms.txt`, `sitemap.xml`, `robots.txt`, meta/OG por página y HTML prerenderizado (indexable sin JS)

**Evidencia (2026-10-27, verificado por el orquestador):** `npm ci/lint/typecheck/test/build` en verde (64 tests, 7 archivos); flujo El Campeón (AR, caliente) recorrido en 375 y 1280 sin scroll horizontal; modal de alta simulada; `/debug` con los 9 eventos; `dist/blog/<slug>/index.html` con artículo + JSON-LD Article/FAQPage/BreadcrumbList; `llms.txt`, `sitemap.xml`, `robots.txt`. A2 reporta 241 capturas Playwright (9 recorridos, 5 países, 4 ruteos) y axe sin violaciones. **Para G4:** (1) recomendación de delivery dice "vendés solo por apps" aunque se marcó mostrador; (2) `place_selected.from_suggestion` da `false` al elegir un chip; (3) `/debug` hereda el `<title>` de la home.

**Listo cuando:** el flujo completo anda en mobile y desktop con `DATA_SOURCE=snapshot`, y `GooglePlacesProvider` compila y tiene test con fixture.

### G3 — Repo de GitHub y deploy en Vercel `[x]` · A2 + orquestador
**El equipo técnico de Fudo va a leer el repo: la estructura es parte de la evaluación.**

**Estructura del repo (raíz = `C:\Users\m_rubano\FUDO\`):**
```
README.md            ← portada: qué es, URL de la demo, video, cómo correrlo en 3 comandos, diagrama, tabla real/simulado
PLAN.md              ← este archivo
app/
  api/               ← funciones serverless (diagnose.ts, places-search.ts)
  src/
    domain/          ← scoring.ts, recommendations.ts, leadTier.ts (puros, con tests)
    gateway/         ← PlaceDataProvider.ts, SnapshotProvider.ts, GooglePlacesProvider.ts, MockProvider.ts, index.ts
    config/          ← countries.json
    content/         ← copy.ts
    theme/           ← tokens.ts
    ui/              ← components/, screens/
    analytics/       ← events.ts
  data/snapshots/    ← JSON de restaurantes reales
  tests/
  .env.example
docs/
  ARCHITECTURE.md    ← gateway, flujo de datos, cómo agregar un proveedor o un país
  adr/               ← 0001-gateway-de-datos.md, 0002-snapshot-vs-api.md, 0003-scoring-por-reglas.md
  research/  qa/  feedback/  informe/  prompts/
video/
.github/workflows/ci.yml   ← lint + typecheck + test + build
```

**Estándares:**
- [x] TypeScript `strict`, ESLint + Prettier, **Vitest** con tests de `domain/` y `gateway/`
- [x] **Conventional commits**, pequeños y con sentido (que el historial cuente cómo se construyó)
- [x] Cero secretos en el repo: `.env.example` documentado, `.gitignore` correcto. Antes de cada push: `git grep` de keys
- [x] El README arranca con la demo y el video. Un evaluador tiene que entender todo en 2 minutos
- [x] Ningún archivo de la carpeta `video/out` ni binarios pesados en git (usar `.gitignore`; el video se linkea)

**Publicación:**
- [x] Revisar `gh auth status` y `vercel whoami`. **Si alguno no está logueado, frenar y pedirle a Matías que se loguee.** Nunca escribir credenciales
- [x] 🔒 **G-OK0** (2026-10-27: `fudo-diagnostico`, **público** con el riesgo de ToS declarado en ADR 0002 y en el informe): confirmar con Matías nombre del repo (propuesta: `fudo-diagnostico`) y visibilidad (propuesta: pública, porque lo lee el equipo técnico)
- [x] `gh repo create` → push de `main`
- [~] Vercel conectado al repo (proyecto creado con root `app/`, Node 22, env `DATA_SOURCE=snapshot` + `SITE_URL`; deploy por CLI. **Falta:** que Matías agregue GitHub en Login Connections de Vercel para el deploy automático por push): root directory `app/`, deploy automático en `main` y previews por PR. Variables de entorno: `DATA_SOURCE=snapshot` (y `GOOGLE_PLACES_API_KEY` vacía)
- [x] CI en verde

**Evidencia (2026-10-27):** repo https://github.com/matiasrubano/fudo-diagnostico (público), CI verde, https://fudo-diagnostico.vercel.app con home, blog, sitemap, llms.txt y `/api/places-search` + `/api/diagnose` respondiendo. Fallos resueltos: `vercel.json` con escape inválido; ESM sin extensión `.js`; cwd de la Lambda (`/var/task/app/...`); launcher de Vercel no carga ESM sin `"type": "module"` → declarado, Node 22.x fijo, handlers `GET/POST`.

**Listo cuando:** repo público (o privado con acceso), CI en verde, URL de Vercel andando y anotada en §7.

### G4 — QA responsive y funcional `[ ]` · A3
- [ ] Recorre el flujo completo en 375 / 768 / 1280 con el navegador, con capturas de cada paso → `docs/qa/screenshots/`
- [ ] Revisa: scroll horizontal, solapamientos, contraste AA, estados de carga y error (local no encontrado, proveedor caído), teclado
- [ ] Prueba los 4 ruteos y al menos un local real por país

**Listo cuando:** `docs/qa/report.md` no tiene bugs bloqueantes abiertos.

### G5 — Simulación de dueños + iteración `[ ]` · A4 → A5
Cada A4 recibe **solo** la persona y la URL. No sabe que es un caso, ni que es para Fudo, ni ningún contexto del proyecto. Navega la app con el navegador y responde como el dueño.

| Persona | Perfil | Qué esperamos ver |
|---|---|---|
| P1 | Rubén, 52, pizzería en Lanús (AR), 1 local, mucho PedidosYa, factura a mano, desconfiado | ¿Llega al CTA? ¿Le cree al número de plata perdida? |
| P2 | Mariana, 34, taquería con 2 sucursales en CDMX (MX), usa otro POS | ¿Se siente switcher? ¿Qué objeción tiene para migrar? |
| P3 | Andrés, 29, dark kitchen en Bogotá (CO), solo apps | ¿Lo rutea bien? ¿Siente que es para él? |
| P4 | Sofía, 26, "estoy por abrir una cafetería" (CL) | ¿La **descarta** bien y la manda al Consultor sin frustrarla? |

**Salida por persona:** recorrido pensado en voz alta, fricciones (en qué paso), objeciones, si crearía la cuenta (sí/no/por qué), nota del 1 al 10 y la frase que lo convenció o espantó.
- [ ] A5 aplica los cambios con mayor impacto (como máximo 5) → `docs/feedback/cambios.md`, redeploy y regresión rápida de A3
- 🔒 **G-OK1: Matías revisa la app final y da el OK.** Sin ese OK no se pasa a G7.

### G6 — Informe (≤2 páginas) `[ ]` · A6 *(después de G-OK1)*
Secciones **a–g** exactas del caso, en español:
- **a.** Problema, segmento, hipótesis y filtro (con los tiers)
- **b.** Por qué esta solución y no el diagnóstico solo, el quiz solo o el agente de WhatsApp
- **c.** Distribución: SEO/AEO programático, herramienta compartible, alianzas, pauta solo para validar
- **d.** Qué recortamos y por qué (BR, Instagram/apps simulados, auth real, CRM)
- **e.** Cómo se construyó: stack, **gateway de datos**, agentes, manejo de los límites de los planes gratuitos
- **f.** Medición:
  - embudo con línea de base
  - **experimento escrito antes**: hipótesis, brazos, ~680 cuentas por brazo, métrica principal cuenta→pago a 60 días, indicador temprano de activación a 7 días, resultado esperado y criterio para matarlo
- **g.** Qué sigue:
  - cómo pasar de snapshot a Places en vivo (ya implementado, un cambio de variable de entorno)
  - el resto de las fuentes y sus restricciones
  - **costo por diagnóstico**
  - roadmap

Incluye las URLs de la app y del repo, y 3–4 citas de los dueños simulados (marcadas como simuladas).
**Listo cuando:** el `.docx` y el `.pdf` entran en 2 páginas A4 y cada número tiene su fuente.

### G7 — Video demo `[ ]` · A7 → 🔒 G-OK2 → A8 *(después de G-OK1)*
- [ ] **A7, guion de 60–90 s:**
  - hook con el problema
  - recorrido con un local real del snapshot
  - el momento "tu Fudo ya armado"
  - números del experimento
  - cierre con las URLs
- 🔒 **G-OK2: Matías aprueba el guion**
- [ ] **A8:**
  - voz **neutra en español latino** con el conector de ElevenLabs disponible (listar voces → elegir una neutra → generar). Si el conector no está, frenar y avisar
  - capturas o grabación de la app (Playwright)
  - **motion graphics en Remotion** con los colores de Fudo: zooms a la UI, contadores, textos
  - subtítulos quemados
- [ ] Render 16:9 1080p (+ 9:16 opcional) → `video/out/`
**Listo cuando:** el `.mp4` dura ≤90 s, el audio está sincronizado y el video está linkeado en el README.

### G8 — Log de prompts y empaquetado `[ ]` · A9 + orquestador
- [ ] `docs/prompts/LOG.md`: los briefs de cada agente, prompts clave y decisiones (entregable #3 del caso)
- [ ] §7 completo con rutas y URLs
- 🔒 **G-OK3: Matías da el OK para entregar**

---

## 3. Orden de ejecución
```
G1 ──► G2 ──► 🔒OK0 ──► G3 ──► G4 ──► G5 (A4 ×4 en paralelo) ──► A5 ──► 🔒OK1 ──┬──► G6
                                                                               └──► G7: A7 ──► 🔒OK2 ──► A8
                                                                                          G8 al final
```

## 4. Decisiones
- **D1 ✅** Gateway de datos con proveedores intercambiables. La demo usa un snapshot de restaurantes reales y Places queda implementado detrás de una variable de entorno.
- **D2 ✅** Código en GitHub (repo cuidado, lo lee el equipo técnico) + deploy en Vercel conectado al repo. Nombre y visibilidad se confirman en G-OK0.
- **D3 ✅** Sin key de Gemini (2026-10-26, Matías): todo lo "IA" en runtime es simulación por reglas/plantillas y se marca como simulado.
- **D4 ✅** (agregado de Matías, 2026-10-26) **Blog GEO + SEO no genérico + idea de MCP**:
  - El sitio suma una sección `/blog` (o `/guias`) con artículos que responden las dudas reales que un dueño le hace a un LLM ("¿cómo subo mi restaurante a PedidosYa?", "¿qué sistema de facturación necesito con ARCA?", etc.), escritos para que los LLM los citen (respuesta directa arriba, datos con fuente, FAQ con `FAQPage`/`Article` JSON-LD, `llms.txt`, sitemap, prerender/HTML estático indexable).
  - SEO con intención clara y específica por país/segmento (nada de "10 tips para tu restaurante"): las keywords y preguntas salen de G1-Distribución.
  - El informe (§c Distribución y §g Qué sigue) suma la idea de un **MCP server** que expone el diagnóstico y las herramientas de Fudo para usarlas dentro del propio LLM (ChatGPT/Claude/Gemini) → distribución en el canal donde el dueño ya pregunta.

## 5. Reglas para el orquestador
1. Leer este archivo completo antes de actuar y releer el goal en curso antes de cada delegación.
2. Actualizar los checkboxes, la §7 y la Bitácora después de cada goal.
3. Hacer commit al cerrar cada goal (desde G3 en adelante).
4. Nunca saltar un 🔒. Nunca escribir credenciales. Nunca inventar datos: lo que no es real se marca como simulado.
5. Si un subagente devuelve algo incompleto, se lo devuelve con feedback concreto (SendMessage) en lugar de aceptarlo.
6. Mantener todo dentro de `C:\Users\m_rubano\FUDO\`.

## 6. Riesgos
| Riesgo | Mitigación |
|---|---|
| La búsqueda no encuentra el local que escribe el entrevistador | Sugerencias clickeables del snapshot + mensaje honesto sobre Places |
| Límites de los planes gratuitos (Vercel, LLM) | Sin dependencia de LLM en runtime; snapshot estático; documentarlo en el informe |
| El cambio en vivo rompe algo | Un archivo por responsabilidad, tests de `domain/` y CI |
| ToS de Google sobre caché | Snapshot fechado solo para la demo, declarado en el informe; producción usa la API oficial |

## 7. Entregables (completar al cerrar)
| Entregable | Ubicación / URL |
|---|---|
| Plan | `C:\Users\m_rubano\FUDO\PLAN.md` |
| Repo GitHub | https://github.com/matiasrubano/fudo-diagnostico |
| App (Vercel) | https://fudo-diagnostico.vercel.app |
| Informe | `C:\Users\m_rubano\FUDO\docs\informe\Informe-Fudo.pdf` (+ `.docx`) |
| Video | `C:\Users\m_rubano\FUDO\video\out\demo-16x9.mp4` |
| Log de prompts | `C:\Users\m_rubano\FUDO\docs\prompts\LOG.md` |

## 8. Bitácora
| Fecha | Goal | Nota |
|---|---|---|
| 2026-10-26 | — | Plan creado. Opción A; multi-país con detección por dirección del local |
| 2026-10-26 | — | D1: gateway con snapshot real + Places detrás de una variable de entorno. D2: GitHub + Vercel. Plan movido a `C:\Users\m_rubano\FUDO\` |
| 2026-10-26 | — | D3 cerrada: sin Gemini, todo simulado por reglas. D4 nueva: blog GEO + SEO específico + idea de MCP en el informe |
| 2026-10-26 | G1 | En curso. A1 corre en 4 instancias paralelas: (a) marca + países + tools de Fudo + benchmark, (b) snapshot de locales reales, (c) datos/Places/costos, (d) distribución + GEO + MCP |
| 2026-10-26 | G1 | ✅ Cerrado. 10 docs de research + countries.json + 13 snapshots reales con provenance. Verificado por el orquestador (JSON válidos, links, sin datos personales). Ver evidencia en G1 |
| 2026-10-26 | G2 | En curso. A2 (app, gateway, dominio, prerender del blog, repo local con commits, sin remoto) + A2b (8 artículos en `app/content/blog/`) en paralelo. `countries.json` suma `productName` (BR = Deli). gh 2.103.3 y vercel 65.3.1 instalados; falta login de Matías |
| 2026-10-27 | G2 | ✅ Cerrado. App + gateway + dominio + blog prerenderizado (8 guías) + README/ARCHITECTURE/4 ADR/CI. 10 commits locales en `main`, sin remoto. 3 bugs menores anotados para G4 |
| 2026-10-27 | G-OK0 | ✅ Matías: repo `fudo-diagnostico`, público, riesgo de ToS del snapshot declarado (ADR 0002 + informe). Falta `gh auth login` y `vercel login` para G3 |
| 2026-10-27 | G3 | En curso (cortado por límite de uso). ✅ Repo público https://github.com/matiasrubano/fudo-diagnostico, CI verde. ✅ Proyecto Vercel `fudo-diagnostico` (root `app/`, Node 22, DATA_SOURCE=snapshot, SITE_URL) desplegado en https://fudo-diagnostico.vercel.app: home, blog, sitemap, llms.txt OK. ❌ `/api/*` da 500: imports ESM sin `.js` + `defaultSnapshotDir` usa cwd (en Lambda es /var/task/app/data/snapshots). Fix de `vercel.json` (`\.`) sin commitear. A2 detenido a mitad del fix: revisar `git status`/diff antes de seguir. Pendiente: Matías conecta GitHub en Vercel (Login Connections) para deploys automáticos; 3 bugs menores (ver G2) |
| 2026-10-27 | G3 | ✅ Cerrado (salvo deploy automático por push, pendiente de Login Connection de Matías). API arreglada y verificada en prod. Logo oficial de fu.do en `app/public/brand/` y `video/assets/` (pedido de Matías) |
| 2026-10-27 | G5/A5 | Matías: "hacela menos genérica". A5 en curso: logo, hero con escena real, ticket/comanda, comparación con vecinos reales, voz por país, landings /ar /mx /cl /co, 3 bugs. A9 (log de prompts) en paralelo |
