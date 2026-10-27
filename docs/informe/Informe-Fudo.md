# Diagnóstico gratis para restaurantes + “Tu Fudo ya armado”

Caso Fudo (AI-driven Organic Growth) · **Matías Rubano** · octubre 2026 · https://fudo-diagnostico.vercel.app · https://github.com/matiasrubano/fudo-diagnostico

## a. Problema, segmento e hipótesis

**Problema.** De 80.000 visitas/mes, 1,2% abre cuenta (≈960) y solo el 10% paga a los 60 días (≈96 pagos/mes)<sup>[1]</sup>. **Segmento núcleo:** restaurantes, bares y pizzerías de **1–3 locales con volumen y delivery**: PedidosYa cobra 25–35% de la venta en Argentina<sup>[2]</sup> y es donde más pesa la operación manual (cobro y factura; hipótesis). **Hipótesis:** si el dueño llega a la cuenta con su local ya cargado y habiendo visto qué le falta, la cuenta llega calificada, se activa más y cuenta→pago sube de 10% a 15%.

**Cómo filtro.** Datos públicos del local + 4 preguntas (tipo de negocio, canales, cómo cobra y factura, locales). Señales: **volumen = cantidad de reseñas de Google** (proxy gratis; <100 bajo, ≥1.000 alto, sin dato no cuenta como bajo)<sup>[3]</sup>, sistema actual, canales y locales.

| Tier | Señales | Destino |
|---|---|---|
| **Caliente** | 1–3 locales, volumen no bajo, delivery, sin sistema | “Tu Fudo ya armado” |
| **Switcher** | Igual, pero ya usa otro sistema | Alta + migración de datos |
| **Nutrir** | Volumen bajo o sin delivery | Guías + email |
| **Descartar** | 4+ locales o fuera de rubro | Ventas |
| **Por abrir** | “Todavía no abrí” | Consultor de Nuevos Negocios de Fudo |

## b. Por qué esta solución

Elegí un **diagnóstico híbrido** (datos reales + 4 preguntas de calificación) que termina en **“tu cuenta ya armada”**. El **diagnóstico solo** (Owner Grader, Qamarero) mide la ficha y la reputación, no la operación, y no rutea al lead<sup>[4]</sup>. El **quiz solo** (Soamee) es autodeclarado y no usa el local<sup>[4]</sup>; de él copié la escalera de respuestas y mostrar la cuenta del número. Un **agente de WhatsApp** arranca sin datos del local y atiende a quien ya llegó: no trae tráfico orgánico (argumento propio). Además, **Fudo ya tiene herramientas sueltas en tools.fu.do** (Especialista en Google, Analista de Reseñas, Fudo Sitios, Carta QR), cada una con su formulario y sin calificar ni llevar a la cuenta<sup>[5]</sup>: esto las unifica (el local se busca una sola vez) y las deja como profundización.

## c. Distribución: cómo llega el restaurante a la herramienta

- **SEO/AEO específico por país, no genérico.** Landings **/ar /mx /cl /co** y un **blog GEO de 8 guías** sobre preguntas reales: ARCA, comisiones de PedidosYa/Rappi, Google Maps (AR); CFDI y propinas, comisiones de Uber Eats/DiDi/Rappi, migrar desde Soft Restaurant (MX); boleta SII (CL); factura POS DIAN (CO). Escritas para que las citen los LLM: respuesta directa arriba, fuente oficial y fecha, FAQ, JSON-LD, HTML sin JS y llms.txt. **FAQPage ya no da rich result en Google** y **llms.txt no es un estándar**: se publican por costo casi nulo, sin esperar efecto<sup>[6]</sup>. En 6 consultas de prueba (desde EE. UU.) no apareció Fudo ni otro POS gastronómico<sup>[7]</sup>. Las guías fiscales son borradores hasta que las revise un contador.
- **Herramienta compartible** (propuesto): informe con URL y “mandáselo a tu contador”.
- **Alianzas**<sup>[7]</sup>: cámaras (FEHGRA y AHRCC en AR, CANIRAC en MX, Achiga en CL, ACODRES en CO), contadores (canal natural de lo fiscal), hardware (Hasar, Epson) y fintech (Mercado Pago, Clip, Geopagos), con links `?ref=`.
- **Pauta solo para validar** titular y segmento, con tope de USD 200 (1 CAC de referencia) por país-segmento<sup>[7]</sup>.
- **Idea de MCP:** un servidor MCP “**Fudo Diagnóstico**” para usar el diagnóstico y las calculadoras **dentro de ChatGPT, Claude y Gemini**, donde el dueño ya pregunta. Tools de **solo lectura** (`diagnosticar_local`, `estimar_comisiones_delivery`, `requisitos_facturacion`) y un **link de alta** con `utm_source=mcp` (nunca crea la cuenta). Riesgos: disponibilidad en LATAM no verificada (Gemini: solo EE. UU./inglés, fuente secundaria), privacidad, costo de Places por llamadas del asistente e inyección de prompts. Sin ejemplos de comercio gastronómico: es un experimento, que arranca como conector en Claude<sup>[8]</sup>.
- **Por qué no páginas por ciudad:** son doorway/scaled content para Google<sup>[6]</sup> y el ToS de Places impide guardar el censo de locales para publicarlo<sup>[9]</sup>.

## d. Qué recorté y por qué

| Recorte | Por qué |
|---|---|
| **Brasil** | Se vende como **Deli**; sin i18n a portugués (la app lo avisa). |
| **Instagram y apps de delivery** | Solo presencia/link real; métricas **simuladas** (sin API pública para locales ajenos<sup>[10]</sup>). |
| **Auth real y CRM** | No hacen falta para validar; los eventos quedan en el navegador (/debug). |
| **LLM en runtime** | Reglas y plantillas: repetible, sin costo ni key. La “plata que se escapa” es **simulada**. |
| **Alta en fu.do** | Simulada: el alta real no acepta precarga de datos. |
| **Snapshot, no Places en vivo** | 13 locales reales capturados el 26/10/2026: la demo anda sin key ni red<sup>[11]</sup>. |

## e. Cómo lo construí y por qué así

**Claude Code como orquestador** de un PLAN único que delega a **subagentes Sonnet**: investigación (4 en paralelo), construcción, QA, **4 dueños simulados sin contexto** y redacción, con 4 puntos de aprobación humana. **Stack:** Vite + React + TypeScript + Vercel Functions, sin base de datos. **Gateway de datos** con proveedores intercambiables: **Snapshot real fechado** (default), **Google Places** detrás de `DATA_SOURCE=places` (si falla, cae al snapshot) y **Mock** para tests; cada campo trae su `provenance` y la UI marca “real · capturado el…”, “en vivo” o “simulado”. El **scoring es por reglas en un archivo** (pesos y umbrales arriba). Más de 100 tests y CI<sup>[11]</sup>.

**Límites gratuitos.** Vercel Hobby (1 M de invocaciones, 100 GB; uso no comercial; al pasarse se pausa, no cobra)<sup>[12]</sup>: snapshot estático, sin LLM, y es demo (producción iría en Pro). Places da 1.000 diagnósticos/mes gratis<sup>[13]</sup> (se activaría con cuota diaria y alerta de gasto). Sin LLM: el tier gratis de Gemini usa los datos para mejorar productos<sup>[14]</sup> y los ToS de Places lo impiden.

**Qué aprendí de 4 dueños simulados** (agentes sin contexto, 27/10/2026, no usuarios reales; notas 6, 5, 5 y 4 sobre 10; ninguno crearía la cuenta hoy: el alta es simulada)<sup>[15]</sup>: “Es lo que yo no hago: me paga la app.” (*dueño simulado*, Andrés, dark kitchen CO) → la pregunta de cobro suma esa opción. “Esto es de otro país.” (*dueña simulada*, Mariana, MX) → la home se adapta al país. “A pesar de la página, no gracias a ella.” (*dueña simulada*, Sofía, CL, por abrir) → esa ruta va directo al Consultor. “De un tipo que no me quiere engañar.” (*dueño simulado*, Rubén, AR, sobre la guía de comisiones) → las guías con fuente son lo más creíble. Apliqué 5 cambios: búsqueda honesta, “por abrir” como ruta propia, home y voz por país, preguntas del negocio con “tus números” editables, y confianza/QA. **QA no encontró bloqueantes** (1 alta y 8 medias, ya corregidas)<sup>[15]</sup>.

## f. Cómo lo mediría

| Embudo | Visitas | Diagnóstico | Cuenta | Pago (60 d) | CAC / ticket |
|---|---|---|---|---|---|
| **Línea de base**<sup>[1]</sup> | 80.000/mes | a medir | 1,2% ≈ 960 | 10% ≈ 96 | USD 200 / USD 50 al mes |

**Métrica principal:** cuenta→pago a 60 días, de 10% a 15% (≈144 pagos/mes sobre las mismas 960 cuentas, +USD 2.400/mes; cálculo propio sobre<sup>[1]</sup>). **Indicador temprano:** activación a 7 días (definición a acordar con producto). **Eventos:** `diag_start`, `place_selected`, `q_answered_1..4`, `result_viewed`, `lead_tier`, `cta_click` (panel /debug); cuenta, activación y pago, de Fudo.

| Experimento | (escrito antes de correrlo) |
|---|---|
| **Hipótesis y resultado esperado** | Diagnóstico + cuenta precargada sube cuenta→pago de 10% a 15% (+5 pp) y la activación a 7 días. |
| **Brazos** | **Control** = alta actual de fu.do. **Tratamiento** = diagnóstico + cuenta precargada. Asignación aleatoria por visitante, 50/50. |
| **Tamaño**<sup>[16]</sup> | n = [1,960·√(2·0,125·0,875) + 0,8416·√(0,10·0,90 + 0,15·0,85)]² / 0,05² = 685,6 → **686 cuentas por brazo** (α = 0,05 bilateral, potencia 80%): 1.372 en total. |
| **Duración** | Supuesto: **el 100% del tráfico entra** (960 cuentas/mes). 1.372 ÷ 960 ≈ 1,4 meses (≈6 semanas) + 60 días de espera ≈ **3,5 meses** hasta la lectura; si entra solo el 50%, ≈ 5 meses. Comparo también pagos por visita. |
| **Criterio para matarlo** (propuesto) | Activación a 7 días no mayor que en control con ≥300 cuentas por brazo; o a 60 días <2 pp con IC95 que incluye 0; o un guardrail roto. |
| **Guardrails** | **Calidad de lead:** % caliente+switcher no cae bajo su línea de base (a medir la primera semana). **CAC por pagante** ≤ USD 200. |

## g. Qué haría después

| Fuente real | Cómo y con qué restricción | Costo |
|---|---|---|
| **Google Places (New)** | Text Search Pro (field mask `id, displayName, formattedAddress, location, primaryType`) + Place Details Enterprise+Atmosphere (`rating, userRatingCount, regularOpeningHours, websiteUri, delivery`); el campo más caro fija el SKU. Solo se puede guardar el `place_id` (lat/lng 30 días): nombre, dirección y rating no se cachean<sup>[9]</sup>. Por eso el snapshot es **solo para la demo**, con un **riesgo declarado**: datos de la ficha de Google en un repo público (ADR 0002; no es asesoramiento legal). | ≈ USD 0,057 por diagnóstico<sup>[13]</sup> |
| **Instagram** | Business Discovery (Graph API) desde una cuenta de Fudo: solo cuentas Business/Creator, con App Review; scraping prohibido por Meta<sup>[10]</sup>. | sin cargo documentado |
| **Apps de delivery** | Sin API pública de ratings; las APIs son para aliados<sup>[10]</sup>. Camino: lo declara el dueño, el link en su web o un acuerdo de partner. | no encontrado |
| **Web + PageSpeed** | Fetch propio (robots.txt) + PageSpeed Insights; cuota gratuita no hallada en la doc oficial<sup>[10]</sup>. | USD 0 (no verificado) |

**Costo por diagnóstico ≈ USD 0,057**: Text Search Pro USD 32 + Place Details Enterprise+Atmosphere USD 25 por 1.000, con **1.000 diagnósticos/mes gratis**<sup>[13]</sup>. Por mes<sup>[13]</sup>: 1.000 = USD 0; 10.000 = USD 385; 50.000 = USD 2.665 (con Autocomplete por sesión, USD 0,025 por diagnóstico: USD 225 y 1.225). LLM opcional: +USD 0,003<sup>[14]</sup>. Contra el CAC: ≈0,3% de los USD 20 por cuenta de la pauta<sup>[1]</sup>; con 5% de diagnóstico→cuenta (supuesto mío) son USD 1,14 por cuenta, 5,7% de ese CAC.

**Próximos pasos, por prioridad:** (1) pedir a producto que **el alta de fu.do acepte precarga** (hoy obliga a simular; ningún dueño simulado pudo crear la cuenta); (2) **activar Places** y medir el costo real; (3) correr el experimento de f; (4) revisión de contadores de las guías fiscales; (5) **MCP**, fase 1 como conector en Claude, midiendo `utm_source=mcp`; (6) **páginas programáticas con datos propios u oficiales** (comisiones, facturación, alternativas), no por ciudad; (7) Brasil en portugués.

---

**Fuentes:** [1] Caso Fudo (ilustrativo) · [2] iProfesional, 14/05/2026 · [3] repo: leadTier.ts · [4] Owner, Qamarero, Soamee (26/10/2026; benchmark.md) · [5] tools.fu.do (26/10/2026; fudo-tools.md) · [6] Google, spam policies y guía de IA (10/07/2026; geo-blog.md) · [7] distribucion.md (26/10/2026) · [8] docs de ChatGPT y Claude (26/10/2026; mcp.md) · [9] Google Maps ToS §3.2.3 y políticas de Places (23/10/2026; datos.md) · [10] Meta, Rappi, Uber Eats, PSI (26/10/2026; datos.md) · [11] ADR 0002; CI del repo · [12] Vercel Hobby (14/09/2026; costos.md) · [13] Google Maps pricing (23/10/2026; costos.md) · [14] Gemini pricing (26/10/2026) · [15] feedback/persona-*.md y qa/report.md (27/10/2026) · [16] cálculo propio sobre<sup>[1]</sup>.
