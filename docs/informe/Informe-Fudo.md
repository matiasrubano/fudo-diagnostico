# Diagnóstico gratis para restaurantes y “Tu Fudo ya armado”

**Matías Rubano** · octubre 2026 · https://fudo-diagnostico.vercel.app · https://github.com/matiasrubano/fudo-diagnostico

## a. Problema, segmento e hipótesis

En el caso, 80.000 visitas al mes dan 960 cuentas (1,2%) y solo el 10% paga a los 60 días: unos 96 pagos<sup>[1]</sup>. Sospecho que la fuga está después del alta, en cuentas que nacen sin contexto. Apunto a **restaurantes, bares y pizzerías de 1 a 3 locales con volumen y delivery**, como El Campeón de la Pizza, en Lanús: 4,2 estrellas, 6.167 reseñas<sup>[11]</sup> y mucho PedidosYa, que cobra entre 25% y 35% de la venta en Argentina<sup>[2]</sup>. Mi hipótesis: si ese dueño llega a la cuenta con su local ya cargado y sabiendo qué le falta, la cuenta llega calificada, se activa antes y cuenta→pago sube de 10% a 15%.

El diagnóstico lee los datos públicos del local y hace 4 preguntas (tipo de negocio, canales, cómo cobra y factura, locales). El volumen lo estimo con las reseñas de Google, que son gratis: menos de 100 es bajo y desde 1.000 es alto<sup>[3]</sup>. Sin dato, no lo cuento como bajo. Cada dueño cae en un tier:

| Tier | Señales | Destino |
|---|---|---|
| **Caliente** | 1–3 locales, volumen no bajo, delivery, sin sistema | “Tu Fudo ya armado” |
| **Switcher** | Igual, pero ya usa otro sistema | Alta + migración de datos |
| **Nutrir** | Volumen bajo o sin delivery | Guías + email |
| **Descartar** | 4+ locales o fuera de rubro | Ventas |
| **Por abrir** | “Todavía no abrí” | Consultor de Nuevos Negocios de Fudo |

## b. Por qué esta solución

Elegí un **diagnóstico híbrido**: datos reales del local, 4 preguntas y una cuenta ya armada. El diagnóstico solo, como el de Owner o el de Qamarero, mide la ficha y las reseñas pero no la operación, y no separa a quien puede comprar de quien no<sup>[4]</sup>. El quiz solo, como el de Soamee, depende de lo que el dueño declara y no mira su local<sup>[4]</sup>; de ahí copié la escalera de respuestas y mostrar la cuenta del número. Un agente de WhatsApp empieza sin saber nada del local y atiende a quien ya escribió, así que no trae tráfico orgánico (argumento mío, no lo medí).

Fudo ya tiene herramientas sueltas en tools.fu.do (Especialista en Google, Analista de Reseñas, Fudo Sitios, Carta QR), cada una con su formulario, sin calificar y sin llevar a la cuenta<sup>[5]</sup>. Mi diagnóstico las junta: el dueño elige su local una sola vez (en la demo entre 13 reales, en producción con Places) y ellas quedan como paso siguiente.

## c. Distribución: cómo llega el restaurante a la herramienta

**El motor es SEO y AEO específico por país.** Hay landings en /ar, /mx, /cl y /co y un blog de 8 guías que contestan lo que un dueño le pregunta a un buscador: ARCA, PedidosYa/Rappi y Google Maps (AR); CFDI y propinas, Uber Eats/DiDi/Rappi y cómo dejar Soft Restaurant (MX); la boleta del SII (CL); la factura POS de la DIAN (CO). Las escribí para que un LLM las cite: respuesta directa arriba, fuente oficial con fecha, FAQ, JSON-LD, HTML sin JavaScript y llms.txt. Google ya no muestra el rich result de FAQPage y llms.txt no es un estándar; los publiqué igual porque cuestan poco, sin esperar efecto<sup>[6]</sup>. En 6 búsquedas de prueba (desde EE. UU., no es ranking local) no apareció Fudo ni otro POS gastronómico<sup>[7]</sup>. Las guías fiscales son borradores hasta la revisión de un contador.

La **herramienta compartible** es una propuesta sin construir: el informe del local con su URL y un botón para mandárselo al contador. Las **alianzas**<sup>[7]</sup>: cámaras (FEHGRA y AHRCC en AR, CANIRAC en MX, Achiga en CL, ACODRES en CO), contadores para lo fiscal, hardware (Hasar, Epson) y fintech (Mercado Pago, Clip, Geopagos). La **pauta** la uso solo para validar titulares y segmento, con tope de USD 200 (un CAC de referencia) por país y segmento<sup>[7]</sup>.

**La idea de MCP** es un servidor “Fudo Diagnóstico” para usar el diagnóstico y las calculadoras dentro de ChatGPT, Claude y Gemini, donde el dueño ya pregunta. Tendría tools de solo lectura (`diagnosticar_local`, `estimar_comisiones_delivery`, `requisitos_facturacion`) y un link de alta con `utm_source=mcp`; nunca crearía la cuenta. Si un dueño le escribe a ChatGPT “¿cuánto me cobra Rappi?”, recibiría la cuenta con su fuente y el link al diagnóstico. No pude verificar que los dueños de LATAM tengan conectores (para Gemini, una fuente secundaria habla solo de EE. UU.) y no encontré casos de comercio gastronómico. Los riesgos son privacidad, costo de Places e inyección de prompts. Es un experimento, con un conector en Claude primero<sup>[8]</sup>.

No armé páginas por ciudad, del tipo “pizzerías en Lanús”: Google las trata como doorway o contenido en masa<sup>[6]</sup>, y el ToS de Places no deja guardar el censo de locales para publicarlo<sup>[9]</sup>.

## d. Qué recorté y por qué

- **Brasil:** se vende como Deli y no tiene i18n a portugués. La app lo avisa.
- **Instagram y apps de delivery:** solo verifico el perfil o el link; las métricas son simuladas (sin API pública)<sup>[10]</sup>.
- **Auth real y CRM:** no hacían falta para validar la idea. Los eventos quedan en el navegador.
- **LLM en runtime:** reglas y plantillas, para que el resultado sea repetible y gratis. La plata que se escapa es simulada.
- **Alta en fu.do:** simulada, porque el alta real no acepta precarga.
- **Buscador y Places en vivo:** en la demo se elige uno de 13 locales reales capturados el 26/10/2026, primero los del país detectado, sin key ni red<sup>[11]</sup>. En producción vuelve el buscador con Places.
- **Video demo:** lo recorté. El guion de 77 s quedó aprobado<sup>[17]</sup>, pero no lo renderizé: la cuenta de ElevenLabs falló en todas las generaciones.

## e. Cómo lo construí y por qué así

Usé **Claude Code como orquestador** de un PLAN único que delega en subagentes Sonnet (4 investigadores, constructor, QA, 4 dueños simulados sin contexto, redactor), con 4 puntos de aprobación mía. Stack: Vite, React, TypeScript y Vercel Functions, sin base de datos. El corazón es un gateway de datos con proveedores intercambiables: snapshot real y fechado (default), Google Places detrás de `DATA_SOURCE=places` (si falla, cae al snapshot) y un Mock para tests. Cada campo guarda su `provenance` y la pantalla dice “real · capturado el…”, “en vivo” o “simulado”. El scoring son reglas en un archivo. Hay 177 tests y CI<sup>[11]</sup>. El hero rota escenas reales por país (“Viernes 21:30, alguien busca pizza en Lanús”, “tacos en la Roma”).

Los límites gratuitos moldearon el diseño. Vercel Hobby da 1 M de invocaciones y 100 GB, es solo para uso no comercial y, si te pasás, pausa el sitio sin cobrar<sup>[12]</sup>: por eso la demo es estática y producción iría en Pro. Places regala 1.000 diagnósticos al mes<sup>[13]</sup> y lo activaría con cuota diaria y alerta de gasto. No usé LLM: el tier gratis de Gemini usa los datos para mejorar productos<sup>[14]</sup> y los ToS de Places no lo permiten.

Probé la app con 4 dueños simulados (agentes sin contexto, 27/10/2026, no usuarios reales). Pusieron 6, 5, 5 y 4 sobre 10 y ninguno crearía la cuenta hoy, porque el alta es simulada<sup>[15]</sup>. Lo que dijeron cambió la app. Andrés, dark kitchen en Bogotá: “Es lo que yo no hago: me paga la app” (*dueño simulado*); sumé esa opción a la pregunta de cobro. Mariana, México: “Esto es de otro país” (*dueña simulada*); la home ahora detecta el país. Sofía, que está por abrir una cafetería en Chile: “A pesar de la página, no gracias a ella” (*dueña simulada*); la búsqueda le había mostrado un café ajeno como si fuera el suyo, y hoy esa ruta va directo al Consultor. Rubén, Lanús, sobre la guía de comisiones: “De un tipo que no me quiere engañar” (*dueño simulado*); las guías con fuente son lo más creíble que tengo. Apliqué 5 cambios, entre ellos “por abrir” como ruta propia y “tus números” editables en la cuenta de la plata. QA no encontró bloqueantes: 1 alta y 8 medias, ya corregidas<sup>[15]</sup>. Con más tiempo, probaría con dueños reales antes que con simulados.

## f. Cómo lo mediría

| Embudo | Visitas | Diagnóstico | Cuenta | Pago (60 d) | CAC / ticket |
|---|---|---|---|---|---|
| **Línea de base**<sup>[1]</sup> | 80.000/mes | a medir | 1,2% ≈ 960 | 10% ≈ 96 | USD 200 / USD 50 al mes |

La **métrica principal** es cuenta→pago a 60 días, de 10% a 15%: con las mismas 960 cuentas serían unos 144 pagos al mes, 48 más, o USD 2.400 más por mes (cálculo propio sobre<sup>[1]</sup>). El indicador temprano es la activación a 7 días; la definición la fija producto. Los eventos van de `diag_start` a `cta_click` (9 en total) y se ven en /debug; cuenta, activación y pago salen de Fudo.

| Experimento | (escrito antes de correrlo) |
|---|---|
| **Hipótesis** | Diagnóstico + cuenta precargada sube cuenta→pago de 10% a 15% y la activación a 7 días. |
| **Brazos** | **Control:** alta actual de fu.do. **Tratamiento:** diagnóstico + cuenta precargada. Aleatorio por visitante, 50/50. |
| **Tamaño**<sup>[16]</sup> | n = [1,960·√(2·0,125·0,875) + 0,8416·√(0,10·0,90 + 0,15·0,85)]² / 0,05² = 685,6, o sea **686 cuentas por brazo** (α = 0,05 bilateral, potencia 80%): 1.372 en total. |
| **Duración** | Supongo que **entra el 100% del tráfico** (960 cuentas/mes): 1.372 ÷ 960 ≈ 6 semanas más 60 días de espera, ≈3,5 meses hasta la lectura (con el 50% del tráfico, ≈5). Comparo también pagos por visita. |
| **Matarlo si** (propuesto) | Activación a 7 días no mayor que en control con ≥300 cuentas por brazo; o a 60 días <2 pp con IC95 que incluye 0; o un guardrail roto. |
| **Guardrails** | Calidad de lead (% caliente+switcher) sin caer bajo su línea de base, a medir la primera semana. CAC por pagante ≤ USD 200. |

## g. Qué haría después

**Google Places (New)** es la fuente principal. Pediría Text Search Pro y Place Details Enterprise con Atmosphere (`rating, userRatingCount, regularOpeningHours, websiteUri, delivery`), con field mask mínimo porque el campo más caro fija el SKU. Los ToS solo dejan guardar el `place_id` (lat/lng, 30 días): nombre, dirección y rating no se cachean<sup>[9]</sup>. Por eso el snapshot es solo para la demo, y el riesgo está declarado: tiene datos de la ficha de Google en un repo público (ADR 0002; no es asesoramiento legal). De **Instagram** leería seguidores y publicaciones con Business Discovery (Graph API) desde una cuenta de Fudo, solo de cuentas Business o Creator y con App Review; Meta prohíbe el scraping<sup>[10]</sup>. Las **apps de delivery** no tienen API pública de ratings, sus APIs son para aliados<sup>[10]</sup>: el camino es que el dueño lo declare, leer el link de su web o un acuerdo de partner. Para la **web**, fetch propio más PageSpeed Insights, cuya cuota gratuita no encontré en la doc oficial<sup>[10]</sup>.

El **costo por diagnóstico** es de unos **USD 0,057**: Text Search Pro a USD 32 más Place Details Enterprise con Atmosphere a USD 25, cada 1.000<sup>[13]</sup>. Los primeros 1.000 de cada mes salen gratis (USD 0); un LLM opcional sumaría USD 0,003<sup>[14]</sup>. Contra el CAC del caso es poco: el 0,3% de los USD 20 que cuesta una cuenta por pauta<sup>[1]</sup>. Si el 5% de los diagnósticos termina en cuenta (supuesto mío), cada cuenta cuesta USD 1,14, el 5,7% de esos USD 20.

| Diagnósticos por mes<sup>[13]</sup> | Text Search + Details | Autocomplete por sesión |
|---|---|---|
| 10.000 | USD 385 | USD 225 |
| 50.000 | USD 2.665 | USD 1.225 |

Mis próximos pasos, en orden: (1) pedirle a producto que **el alta de fu.do acepte precarga**, porque hoy me obliga a simular y ningún dueño simulado pudo crear la cuenta; (2) activar Places y medir el costo real; (3) correr el experimento; (4) que un contador de cada país revise las guías fiscales; (5) MCP fase 1, como conector en Claude, midiendo `utm_source=mcp`; (6) páginas programáticas solo con datos propios u oficiales (comisiones, facturación, alternativas), nunca por ciudad; (7) Brasil en portugués.

---

**Fuentes (detalle en docs/research, docs/feedback y docs/qa del repo):** [1] Caso Fudo (ilustrativo) · [2] iProfesional, 14/05/2026 · [3] repo: leadTier.ts · [4] Owner, Qamarero, Soamee (26/10/2026) · [5] tools.fu.do (26/10/2026) · [6] Google, spam policies y guía de IA (10/07/2026) · [7] autocompletado y búsquedas del 26/10/2026 · [8] docs de ChatGPT y Claude (26/10/2026) · [9] Google Maps ToS §3.2.3 y políticas de Places (23/10/2026) · [10] Meta, Rappi, Uber Eats, PSI (26/10/2026) · [11] snapshot del 26/10/2026 (ADR 0002); CI del repo · [12] Vercel Hobby (14/09/2026) · [13] Google Maps pricing (23/10/2026) · [14] Gemini pricing (26/10/2026) · [15] feedback/persona-*.md y qa/report.md (27/10/2026) · [16] cálculo propio sobre<sup>[1]</sup> · [17] video/guion.md.
