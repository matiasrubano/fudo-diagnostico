# Costos: costo por diagnóstico, escenarios y límites de los planes gratuitos

> Investigación G1 · instancia (c) · autor: A1 (Investigador) · **fecha de consulta: 2026-10-26**. Precios en USD.
> Regla de oro: cada precio y límite lleva link oficial y su "Last updated" cuando la página lo trae. Lo **estimado** está marcado como tal; lo no encontrado dice "no encontrado".
> Los precios de Google vienen de las tablas originales de la página (descargadas en crudo), no de resúmenes. Cálculos reproducibles con las fórmulas de abajo.

---

## 1. Resultado corto

| Qué | Costo por diagnóstico |
|---|---|
| **Diagnóstico mínimo con Places** (1 Text Search Pro + 1 Place Details Enterprise) | **USD 0,052** |
| Con canales de Google (`delivery/takeout/dineIn` → Details Enterprise + Atmosphere) | **USD 0,057** |
| Variante barata (Autocomplete con session token + Details Enterprise + Atmosphere) | **USD 0,025** |
| PageSpeed Insights | **USD 0** (precio no publicado; cuota no encontrada en doc oficial) |
| LLM opcional (Gemini 3.8 Flash, estimando 1.500 tokens de entrada y 500 de salida) | **+ USD 0,0030** (hasta 2026-12-31; **sube a 0,0060 desde 2027-01-01**) |
| **Total recomendado con Places + canales, sin LLM** | **USD 0,057** |
| Los **primeros 1.000 diagnósticos por mes** salen **USD 0** en Places (tier gratis) | |

Comparación con el caso: el CAC de pauta es USD 20 por cuenta creada (USD 200 por cliente pagante; ver PLAN §0). Un diagnóstico de USD 0,057 equivale a **~0,3% de un CAC por cuenta**; harían falta ~350 diagnósticos para gastar un CAC.

---

## 2. Fórmula (a la vista)

```
Costo_diag = C_places + C_psi + C_llm

C_places (variante A) = P_TextSearchPro/1000 + P_PlaceDetailsEnterprise/1000
                      = 32,00/1000 + 20,00/1000                       = 0,032 + 0,020 = USD 0,052
C_places (variante B) = P_TextSearchPro/1000 + P_PlaceDetailsEntAtm/1000
                      = 32,00/1000 + 25,00/1000                       = 0,032 + 0,025 = USD 0,057
C_places (variante C) = P_AutocompleteSession/1000 + P_PlaceDetailsEntAtm/1000
                      = 0 + 25,00/1000                                                = USD 0,025
C_psi                 = 0   (PageSpeed Insights: sin cargo documentado)
C_llm                 = (T_in x p_in + T_out x p_out) / 1.000.000
                      = (1.500 x 0,75 + 500 x 3,75) / 1.000.000
                      = (1.125 + 1.875) / 1.000.000                 = USD 0,0030   (Gemini 3.8 Flash, precio hasta 2026-12-31)
```

Los precios `P_` son los del tramo "hasta 100.000 eventos/mes" de la [lista de precios global](https://developers.google.com/maps/billing-and-pricing/pricing) (Last updated 2026-10-23). Todo el análisis queda por debajo de 100.000 eventos, así que no aplican descuentos por volumen.

**Cómo se arma cada llamada** (field masks completos en `datos.md`, sección 1.2):
- *Text Search Pro*: máscara con `places.id, places.displayName, places.formattedAddress, places.location, places.primaryType, places.googleMapsUri`. El campo más caro es Pro, SKU "Text Search Pro", **USD 32,00 por 1.000**, 5.000 gratis al mes.
- *Place Details Enterprise*: máscara con `rating, userRatingCount, regularOpeningHours, websiteUri, priceLevel` (más los campos Essentials y Pro). SKU "Place Details Enterprise", **USD 20,00 por 1.000**, 1.000 gratis al mes.
- *Place Details Enterprise + Atmosphere*: igual más `delivery, takeout, dineIn`. **USD 25,00 por 1.000**, 1.000 gratis al mes.
- La regla de que el SKU lo fija el campo más caro: [Usage and Billing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing).
- Variante C: las llamadas de Autocomplete (New) de una sesión se facturan como "Autocomplete Session Usage" (gratis, ilimitado) y la sesión se cierra con un Place Details que se factura como **Enterprise + Atmosphere sin importar los campos pedidos**. Fuente: [Autocomplete (New) and session pricing](https://developers.google.com/maps/documentation/places/web-service/session-pricing) (Last updated 2026-10-23). Si una sesión se abandona sin Details, esas llamadas se cobran como "Autocomplete Requests" a USD 2,83 por 1.000 (10.000 gratis). Para la sesión hay que pasar el mismo `sessionToken` al Autocomplete y al Details.

**Extras opcionales:**
- Foto del local en la pantalla "¿Es este?": SKU "Place Details Photos", USD 7,00 por 1.000 (1.000 gratis) → +USD 0,007 por diagnóstico si se muestra. Fuente: misma lista de precios.
- Llamar al Details dos veces (por reintento del usuario) o buscar más de una vez eleva el costo; ver sensibilidad en 3.2.

---

## 3. Escenarios mensuales: 1.000 / 10.000 / 50.000 diagnósticos

Supuesto base: **1 búsqueda y 1 Details por diagnóstico** (las cifras dependen de ese supuesto; ver sensibilidad). Se descuenta primero el tope gratuito de cada SKU: `costo = max(0, N − tope_gratis) x precio / 1000`.

### 3.1 Places (solo Google), por variante

| Variante | N | Text Search Pro (5.000 gratis) | Place Details (1.000 gratis) | **Total/mes** | **Por diagnóstico** | Dentro del gratis |
|---|---|---|---|---|---|---|
| **A** TS Pro + PD Enterprise | 1.000 | 0 | 0 | **USD 0** | USD 0 | 100% |
| | 10.000 | (10.000−5.000) x 32/1000 = 160,00 | (10.000−1.000) x 20/1000 = 180,00 | **USD 340,00** | USD 0,0340 | Details: 1.000 de 10.000 (10%) |
| | 50.000 | (50.000−5.000) x 32/1000 = 1.440,00 | (50.000−1.000) x 20/1000 = 980,00 | **USD 2.420,00** | USD 0,0484 | Details: 1.000 de 50.000 (2%) |
| **B** TS Pro + PD Ent+Atm | 1.000 | 0 | 0 | **USD 0** | USD 0 | 100% |
| | 10.000 | 160,00 | 9.000 x 25/1000 = 225,00 | **USD 385,00** | USD 0,0385 | |
| | 50.000 | 1.440,00 | 49.000 x 25/1000 = 1.225,00 | **USD 2.665,00** | USD 0,0533 | |
| **C** Autocomplete(sesión) + PD Ent+Atm | 1.000 | 0 | 0 | **USD 0** | USD 0 | 100% |
| | 10.000 | 0 | 225,00 | **USD 225,00** | USD 0,0225 | |
| | 50.000 | 0 | 1.225,00 | **USD 1.225,00** | USD 0,0245 | |

**Costo marginal una vez agotado el gratis:** A = USD 0,052 · B = USD 0,057 · C = USD 0,025 por diagnóstico.

El **cuello de botella del gratis es Place Details Enterprise: 1.000 por mes**. Text Search Pro tiene 5.000 y no es el límite. Con el tier gratis solo se cubren 1.000 diagnósticos por mes en cualquier variante. (Los topes son por SKU y por cuenta de facturación; si la misma cuenta se usa en otro proyecto, se comparten.)

### 3.2 Sensibilidad (supuestos que mueven el número)

| Supuesto | Efecto |
|---|---|
| **1,5 búsquedas por diagnóstico** (el dueño reescribe el nombre) en variante A | N=10.000 → TS: (15.000−5.000) x 32/1000 = 320 + PD 180 = **USD 500** (USD 0,050/diag). N=50.000 → (75.000−5.000) x 32/1000 = 2.240 + 980 = **USD 3.220** (USD 0,0644/diag). Con Autocomplete (variante C) no cambia: las pulsaciones extra son gratis dentro de la sesión. |
| Sin `delivery/takeout/dineIn` (A en vez de B) | −USD 5 por 1.000 diagnósticos. |
| Mostrar foto | +USD 7 por 1.000 (1.000 gratis). |
| Tráfico del caso: 80.000 visitas, 1,2% → 960 cuentas por mes | Si 2% de los diagnósticos termina en cuenta, hacen falta 960 / 0,02 = **48.000 diagnósticos/mes**; si 5%, **19.200** (estos porcentajes son supuestos míos, no datos del caso). Es decir, el escenario de 50.000 es el de la escala del caso. |

### 3.3 LLM opcional (D3: en la demo no hay LLM; esto es para producción)

Tokens por diagnóstico: **1.500 de entrada y 500 de salida (ESTIMADO, a validar con un prompt real)**. Atención: el precio de salida de Gemini "includes thinking tokens"; si el modelo razona, la salida real puede ser bastante mayor a 500 tokens, así que conviene fijar el presupuesto de razonamiento al mínimo.

Precios por 1M de tokens, tier pago, [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing) (Last updated 2026-10-26):

| Modelo | Entrada | Salida | Por diagnóstico (fórmula con 1.500/500) | 1.000 | 10.000 | 50.000 |
|---|---|---|---|---|---|---|
| **Gemini 3.8 Flash** (hasta 2026-12-31) | 0,75 | 3,75 | (1.500 x 0,75 + 500 x 3,75) / 1e6 = **USD 0,0030** | 3,00 | 30,00 | 150,00 |
| **Gemini 3.8 Flash** (desde 2027-01-01) | 1,50 | 7,50 | (1.500 x 1,50 + 500 x 7,50) / 1e6 = **USD 0,0060** | 6,00 | 60,00 | 300,00 |
| Gemini 3.5 Flash-Lite | 0,30 | 2,50 | (450 + 1.250) / 1e6 = **USD 0,0017** | 1,70 | 17,00 | 85,00 |
| Gemini 3.1 Flash-Lite | 0,25 | 1,50 | (375 + 750) / 1e6 = **USD 0,0011** | 1,13 | 11,25 | 56,25 |

**Precio que cambió / va a cambiar:** la página de Gemini indica para 3.8 Flash "$0.75 through December 31, 2026. $1.50 starting January 1, 2027" en entrada y "$3.75 ... $7.50" en salida: **el precio se duplica el 2027-01-01**. Los modelos Flash-Lite figuran sin ese salto. Si se usa LLM en producción, presupuestar con el precio 2027.

**Tier gratuito de Gemini:** existe ("Free of charge" en entrada y salida para estos modelos), pero (a) los límites (RPM/RPD) no se publican en una tabla fija; la [página de rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) (Last updated 2026-10-26) manda a "View your active rate limits in AI Studio", y (b) el tier gratuito marca **"Used to improve our products: Yes"**. Por eso **no se debe mandar contenido de Google Places a un LLM en tier gratis** (ver `datos.md` 1.7). Alternativa: el LLM solo ve el score ya calculado y la lista de reglas disparadas.

### 3.4 Total por escenario (Places + PSI + LLM opcional)

Supone variante A para Places, PSI = 0.

| N diagnósticos/mes | Solo Places (A) | + LLM Gemini 3.8 Flash (precio 2026) | + LLM Flash-Lite 3.1 | Por diagnóstico (A + 3.8 Flash 2026) |
|---|---|---|---|---|
| 1.000 | USD 0 | USD 3,00 | USD 1,13 | USD 0,0030 |
| 10.000 | USD 340,00 | USD 370,00 | USD 351,25 | USD 0,0370 |
| 50.000 | USD 2.420,00 | USD 2.570,00 | USD 2.476,25 | USD 0,0514 |

Con la variante C en lugar de A: 10.000 → USD 225 (+ LLM 30 = 255); 50.000 → USD 1.225 (+ LLM 150 = 1.375).

---

## 4. Comparación con el CAC de pauta del caso

Datos del caso (PLAN §0, línea de base): CAC de pauta ≈ **USD 200 por cliente pagante**, equivalente a **USD 20 por cuenta creada** (200 USD ÷ 10% de cuenta→pago). Ticket USD 50.

Costo de diagnóstico por **cuenta creada** = costo_diag ÷ tasa(diagnóstico→cuenta). Esa tasa **no es un dato del caso**: los valores 1%, 2%, 5% y 10% son supuestos para dimensionar.

| Tasa diagnóstico→cuenta (supuesto) | Costo por cuenta (A, 0,052) | (B, 0,057) | (C, 0,025) | % del CAC por cuenta (USD 20), A |
|---|---|---|---|---|
| 1% | USD 5,20 | USD 5,70 | USD 2,50 | 26% |
| 2% | USD 2,60 | USD 2,85 | USD 1,25 | 13% |
| 5% | USD 1,04 | USD 1,14 | USD 0,50 | 5,2% |
| 10% | USD 0,52 | USD 0,57 | USD 0,25 | 2,6% |

Por **cliente pagante** (÷ 10% cuenta→pago, ya en el caso): a 5% de tasa diagnóstico→cuenta, la variante A cuesta USD 10,40 y la C USD 5,00, contra USD 200 de pauta. Incluso a 1% de tasa, A cuesta USD 52 por pagante (26% del CAC de pauta).

Lectura: el diagnóstico sale entre 3,5 y 80 veces más barato por cuenta que la pauta en los supuestos probados (cociente 20 ÷ costo por cuenta, de USD 5,70 a USD 0,25), siempre que la tasa diagnóstico→cuenta sea de al menos 1%. Pero es un costo **variable que crece con el tráfico**, mientras que el contenido (blog/GEO) tiene costo marginal casi cero. Conviene que la herramienta no se ofrezca como respuesta a cada visita de pauta, sino a tráfico calificado. Además, el costo de Places se puede recortar a la mitad con Autocomplete (variante C) y a casi cero para locales repetidos si se evita volver a consultar mientras la sesión del usuario siga abierta (sin cachear contenido de Google, que no está permitido; ver `datos.md` 1.6).

---

## 5. Hosting: Vercel Hobby

Fuentes (consultadas 2026-10-26): [Hobby plan](https://vercel.com/docs/plans/hobby) (Last updated September 14, 2026) · [Limits](https://vercel.com/docs/limits) · [Fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) (Last updated September 14, 2026) · [Vercel Functions limitations](https://vercel.com/docs/functions/limitations) (Last updated August 24, 2026) · [Pricing](https://vercel.com/pricing).

### 5.1 Qué incluye Hobby (USD 0)

| Recurso | Incluido en Hobby |
|---|---|
| Fast Data Transfer (ancho de banda del CDN) | primeros **100 GB**/mes |
| Fast Origin Transfer | primeros **10 GB** |
| CDN Requests | primeros **1.000.000** |
| **Function Invocations** | primeras **1.000.000**/mes |
| Active CPU | **4 horas** de CPU |
| Provisioned Memory | **360 GB-horas** |
| Duración máxima de una función | **300 s** (5 min), default y máximo |
| Memoria / CPU por función | 2 GB / 1 vCPU |
| Tamaño de request o response de una función | **4,5 MB** (si se pasa: error 413) |
| Deployments por día | 100 (Hobby) |
| Duración del build | 45 min |
| Logs de runtime | 1 hora |
| Web Analytics | 50.000 eventos/mes; Speed Insights: 10.000 eventos / 30 días |
| WAF custom rules | hasta 3 |
| Proyectos | 200 |

**Qué pasa al pasarse:** "if you exceed your usage limits on the Hobby plan, you will have to wait until 30 days have passed before you can use the feature again". No hay cobro por exceso en Hobby ("If you have a free Hobby account, you are limited to the usage caps and cannot purchase additional usage", [Pricing, FAQ](https://vercel.com/pricing)): el sitio se pausa, no se factura.

### 5.2 Aclaración clave: Hobby es **no comercial**

Cita oficial ([Fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines)): "Hobby teams are restricted to non-commercial personal use only. All commercial usage of the platform requires either a Pro or Enterprise plan." Y define uso comercial como cualquier deployment "used for the purpose of financial gain of anyone involved in any part of the production of the project, including a paid employee or consultant writing the code", con ejemplos como "Advertising the sale of a product or service" o "Any method of requesting or processing payment". Pedir donaciones no cuenta como comercial. Además, listan a los "Scrapers" como "Never fair use".

Consecuencias para este proyecto:
- **Demo para entrevista (prototipo del caso, sin cobros): encaja en Hobby**, pero la app lleva a una CTA de venta de un producto (Fudo): es una **zona gris** (no soy asesor legal; la clasificación final la hace Vercel). Mitigación: dejar escrito en README e informe que es una demo no comercial; si Vercel objeta o el uso se vuelve comercial, pasar a Pro.
- **Producción real de Fudo: Pro (USD 20/mes)** o su propia infraestructura. Pro: "$20/mo", incluye USD 20 de crédito de uso ([Pricing](https://vercel.com/pricing)); las páginas de Hobby agregan que los "Developer seats cost $20 per user / month". Consumo adicional a tarifa: USD 0,60 por millón de invocaciones, Active CPU desde USD 0,128 por hora, Provisioned Memory desde USD 0,0106 por GB-hora ([Fair use, tabla de tarifas](https://vercel.com/docs/limits/fair-use-guidelines)).
- **Git:** "Vercel does not support connecting a project on your Hobby team to Git repositories owned by Git organizations" ([Limits](https://vercel.com/docs/limits)). **El repo tiene que estar bajo la cuenta personal de Matías, no en una organización de GitHub**, para el deploy automático desde GitHub en Hobby. A tener en cuenta en G-OK0.

### 5.3 ¿Alcanza Hobby para cada escenario? (ESTIMADO)

Supuestos míos, a medir en el piloto: 3 invocaciones de función por diagnóstico (búsqueda, detalle/diagnóstico, evento), ~50 ms de CPU activa por invocación, ~20 s de duración total de la función de diagnóstico mientras espera a PageSpeed (peor caso, una función por solicitud, sin compartir instancia), ~1,5 MB transferidos por diagnóstico (JS/CSS/imágenes).

| N | Invocaciones (límite 1 M) | CPU activa (límite 4 h) | Memoria aprovisionada, peor caso (límite 360 GB-h) | Transferencia (límite 100 GB) |
|---|---|---|---|---|
| 1.000 | 3.000 | ~0,04 h | ~11 GB-h | ~1,5 GB |
| 10.000 | 30.000 | ~0,4 h | ~111 GB-h | ~15 GB |
| 50.000 | 150.000 | ~2,1 h | **~556 GB-h (supera el límite en el peor caso)** | ~73 GB |

Lectura: invocaciones, CPU y ancho de banda quedan holgados incluso a 50.000 diagnósticos. **El punto de riesgo es la memoria aprovisionada si cada diagnóstico espera ~20 s a PageSpeed** (peor caso, estimado); la mitigación es lanzar PageSpeed con timeout corto (por ejemplo 8–10 s) o hacerlo opcional/en segundo plano, y medir el consumo real en el panel de uso de Vercel. Con Fluid compute (por defecto en proyectos nuevos, [Functions limitations](https://vercel.com/docs/functions/limitations)) varias solicitudes pueden compartir instancia, así que el consumo real tiende a ser menor al peor caso. Para la demo (decenas de diagnósticos) el riesgo es nulo.

---

## 6. Límites de los planes gratuitos que usamos y cómo los manejamos

| Servicio | Límite del plan gratuito (con fuente) | Cómo lo manejamos |
|---|---|---|
| **Google Places (tier gratis por SKU)** | Text Search Pro 5.000/mes · Place Details Pro 5.000 · **Place Details Enterprise 1.000** · **Enterprise + Atmosphere 1.000** · Place Details Essentials 10.000 · Autocomplete Requests 10.000 · IDs Only ilimitado. Reinicio el día 1 de cada mes, 00:00 hora del Pacífico de EE.UU. Fuentes: [pricing](https://developers.google.com/maps/billing-and-pricing/pricing), [billing overview](https://developers.google.com/maps/billing-and-pricing/overview) (Last updated 2026-10-23). **Hace falta cuenta de facturación habilitada** ([setup](https://developers.google.com/maps/documentation/places/web-service/cloud-setup)) | La demo corre con `DATA_SOURCE=snapshot` (sin key, USD 0). Para activar Places: poner **cuota diaria** en Cloud Console para cortar antes de salir del gratis (cuota por proyecto: [Manage costs](https://developers.google.com/maps/billing-and-pricing/manage-costs)), **alerta de presupuesto** en USD 1 y restringir la key a "Places API (New)". Si Places devuelve error o 429, el gateway cae a `snapshot` y lo registra (PLAN §2-G2). Límite de uso por IP en `/api/places-search` para que un bot no gaste la cuota. |
| **Vercel Hobby** | Tabla 5.1. 1 M invocaciones, 100 GB, 300 s por función, 4,5 MB de payload, 100 deployments por día, no comercial. Pasarse = pausa de 30 días, no cobro. | Snapshot estático y sin LLM en runtime (riesgo bajo). PageSpeed con timeout corto. Un solo proyecto, un solo repo bajo cuenta personal. Documentar en README/informe que Hobby es no comercial y que producción va en Pro. Máx. 100 deployments/día: usar previews por PR con criterio. |
| **GitHub Free** | Repos públicos y privados ilimitados. **GitHub Actions: gratis para repos públicos con runners estándar**; en repos privados, **2.000 minutos/mes**, 500 MB de artefactos y 10 GB de caché por repo. Fuentes: [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) (la página no trae fecha) y [GitHub pricing](https://github.com/pricing). Tarifa por exceso en Linux de ejemplo: USD 0,006/min. | Un solo workflow `ci.yml` (lint + typecheck + test + build), con caché de dependencias y `concurrency` para cancelar corridas viejas. Estimado: 3–5 min por corrida (a medir) → ~100 corridas/mes = ~500 min, muy por debajo de 2.000 incluso en privado. Cero artefactos pesados en el repo (el video se linkea, PLAN §3). |
| **Gemini API (si se activa)** | Tier gratis con límites que solo se ven en AI Studio; los datos del tier gratis se usan para mejorar productos. [Pricing](https://ai.google.dev/gemini-api/docs/pricing) (2026-10-26) · [Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) (2026-10-26) | **No hay LLM en runtime (D3).** Recomendaciones por plantillas. Si se activa en producción: tier pago, `thinking` mínimo, sin enviar contenido de Places. |
| **PageSpeed Insights API** | Cuota gratuita **no encontrada en doc oficial** (terceros: 25.000/día, no verificado); key recomendada para consultas automatizadas ([get-started](https://developers.google.com/speed/docs/insights/v5/get-started), 2025-08-28) | Key en el servidor. Una corrida por diagnóstico, estrategia `mobile`, timeout. Si falla o se agota: la nota de "web" se calcula solo con el fetch y se muestra "velocidad no medida". Verificar la cuota real en Cloud Console. |

---

## 7. Cambios de precio recientes o anunciados (para decir en el informe)

| Qué | Cambio | Fuente |
|---|---|---|
| Google Maps Platform | Desde **2025-03-01**, topes gratis por SKU (10.000 Essentials / 5.000 Pro / 1.000 Enterprise) **reemplazan** el crédito mensual de USD 200. La página de precios advierte "Upcoming changes include adjustments to discounts and credits" (hay cambios próximos sin detalle en esa página). | [Billing overview](https://developers.google.com/maps/billing-and-pricing/overview), [FAQ de cambios](https://developers.google.com/maps/billing-and-pricing/faq), [pricing](https://developers.google.com/maps/billing-and-pricing/pricing) (2026-10-23) |
| Gemini 3.8 Flash | **Se duplica el 2027-01-01** (entrada 0,75 → 1,50; salida 3,75 → 7,50 USD por 1M). | [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) (2026-10-26) |
| Gemini 2.5 Flash Image | Se apaga el 2026-10-02 (no lo usamos). Dato de contexto. | misma página |
| Vercel | Las páginas de límites y fair use se actualizaron en agosto–septiembre de 2026 (últimas fechas arriba); no encontré un anuncio puntual de cambio de precio de Hobby. | [Hobby](https://vercel.com/docs/plans/hobby) |

---

## 8. Supuestos y pendientes

- **Estimados (no de fuente):** 1.500/500 tokens por diagnóstico; 1 búsqueda y 1 Details por diagnóstico; 3 invocaciones, 50 ms de CPU, 20 s de duración y 1,5 MB por diagnóstico en Vercel; 3–5 min por corrida de CI; tasas diagnóstico→cuenta de 1% a 10%.
- **No encontrado:** cuota gratuita oficial de PageSpeed Insights; precio de PageSpeed Insights; límites numéricos del tier gratuito de Gemini (solo visibles en AI Studio).
- **A validar antes de producción:** si el uso de Places para captar leads de Fudo encaja en los ToS de Google (`datos.md` 1.7); y si Vercel considera comercial el despliegue de la demo.
- **Reproducción del cálculo:** las tablas 3.1, 3.3, 3.4 y 4 se calcularon con `costo = max(0, N − tope_gratis) × precio / 1000` y `LLM = (T_in × p_in + T_out × p_out) / 1e6`.
