# Datos: Google Places API (New) y otras fuentes

> Investigación G1 · instancia (c) · autor: A1 (Investigador) · **fecha de consulta de todas las fuentes: 2026-10-26** (salvo que se indique otra).
> Regla de oro: cada dato lleva link oficial y fecha. Lo que no se pudo verificar dice **"no encontrado"** o **"no verificado"**.
> Cómo se obtuvo: las páginas de Google se bajaron en crudo (HTML) y se leyeron las tablas originales, no resúmenes. Cada página de Google trae su propio "Last updated"; se cita al lado de cada link.
> Esto no es asesoramiento legal: los riesgos de ToS de la sección 3 hay que validarlos con un abogado antes de producción.

---

## 0. Resumen ejecutivo (para el Constructor y el Orquestador)

1. **El SKU lo define el campo más caro del `X-Goog-FieldMask`.** `rating`, `userRatingCount`, `regularOpeningHours`, `websiteUri`, `priceLevel` son **Enterprise**; `delivery`, `takeout`, `dineIn` son **Enterprise + Atmosphere**; `displayName`, `googleMapsUri`, `businessStatus`, `primaryType` son **Pro**. Fuente: [Place Data Fields (New)](https://developers.google.com/maps/documentation/places/web-service/data-fields) (Last updated 2026-10-23).
2. **Costo base por diagnóstico con Places (1 Text Search Pro + 1 Place Details Enterprise): USD 0,052** a precio de lista, o **USD 0,057** si pedimos `delivery/takeout/dineIn` (Atmosphere). Con el tier gratis: los primeros **1.000 diagnósticos/mes salen USD 0** (el tope más bajo es Place Details Enterprise = 1.000 gratis/mes). Detalle en `costos.md`.
3. **Variante barata:** reemplazar Text Search por **Autocomplete (New) con session token**: las llamadas de Autocomplete quedan en USD 0 cuando la sesión termina en un Place Details (non-Essentials), y el Details se factura como Enterprise + Atmosphere (USD 25/1.000) **sin importar qué campos pidas**. Costo: **USD 0,025** por diagnóstico. Fuente: [Autocomplete (New) and session pricing](https://developers.google.com/maps/documentation/places/web-service/session-pricing) (Last updated 2026-10-23).
4. **Caché/ToS:** solo el `place_id` se puede guardar sin límite; latitud/longitud, hasta 30 días corridos; **todo lo demás (nombre, dirección, rating, reseñas, horarios) no se puede cachear ni copiar**. Por eso el snapshot es **solo para la demo** (sección 3).
5. **Instagram / apps de delivery:** no hay API pública para leer métricas de un local ajeno sin su consentimiento (salvo Instagram Business Discovery, con muchas condiciones). En la demo, solo la **presencia** (el link) es real; las métricas son simuladas.

---

## 1. Google Places API (New)

Endpoints base (host `places.googleapis.com`):

| Operación | Método y URL | Doc oficial |
|---|---|---|
| Text Search (New) | `POST https://places.googleapis.com/v1/places:searchText` | [text-search](https://developers.google.com/maps/documentation/places/web-service/text-search) (Last updated 2026-10-23) |
| Place Details (New) | `GET https://places.googleapis.com/v1/places/PLACE_ID` | [place-details](https://developers.google.com/maps/documentation/places/web-service/place-details) (Last updated 2026-10-23) |
| Autocomplete (New) (variante barata) | `POST https://places.googleapis.com/v1/places:autocomplete` | [autocomplete](https://developers.google.com/maps/documentation/places/web-service/autocomplete) |
| Place Photos (New) (imagen) | `GET https://places.googleapis.com/v1/{photo.name}/media?maxWidthPx=...` | [place-photos](https://developers.google.com/maps/documentation/places/web-service/place-photos) |

Requisitos de cuenta: proyecto de Google Cloud **con cuenta de facturación habilitada** y la API "Places API (New)" activada, aunque se use solo el tier gratis. Fuente: [Set up your Google Cloud project](https://developers.google.com/maps/documentation/places/web-service/cloud-setup): "Before using the Places API, ensure you have a project with a billing account and the Places API enabled". La key va en el header `X-Goog-Api-Key`.

### 1.1 Campos que nos sirven → SKU

Fuente única de esta tabla: [Place Data Fields (New)](https://developers.google.com/maps/documentation/places/web-service/data-fields), tabla "Place Details SKU / Text Search SKU", Last updated 2026-10-23, consultada 2026-10-26. Nota: el mismo campo puede caer en SKU distinto según el endpoint (por ejemplo `formattedAddress` es Essentials en Details pero Pro en Text Search).

| Campo (para el field mask) | Para qué lo usamos | SKU en **Place Details** | SKU en **Text Search** |
|---|---|---|---|
| `id` (place_id) | clave del local; **cacheable** | Essentials (IDs Only) | Essentials (IDs Only) |
| `displayName` | nombre | **Pro** | **Pro** |
| `formattedAddress` | dirección | Essentials | **Pro** |
| `addressComponents` | detectar país/ciudad (`country`, `administrative_area_level_1`, `locality`) | Essentials | **Pro** |
| `location` | lat/lng para sesgar y mapas | Essentials | **Pro** |
| `types` | tipos del local | Essentials | **Pro** |
| `primaryType` | tipo principal (ej. `pizza_restaurant`) | **Pro** | **Pro** |
| `businessStatus` | `OPERATIONAL` / `CLOSED_TEMPORARILY` / `CLOSED_PERMANENTLY` | **Pro** | **Pro** |
| `googleMapsUri` | link "ver en Google Maps" | **Pro** | **Pro** |
| `photos` | referencias a fotos (no la imagen) | Essentials (IDs Only) | **Pro** |
| `rating` | nota promedio | **Enterprise** | **Enterprise** |
| `userRatingCount` | cantidad de reseñas (proxy de volumen) | **Enterprise** | **Enterprise** |
| `regularOpeningHours` | horarios semanales | **Enterprise** | **Enterprise** |
| `websiteUri` | web propia | **Enterprise** | **Enterprise** |
| `priceLevel` | nivel de precio | **Enterprise** | **Enterprise** |
| `nationalPhoneNumber` (opcional) | teléfono | **Enterprise** | **Enterprise** |
| `delivery`, `takeout`, `dineIn` | canales declarados en Google | **Enterprise + Atmosphere** | **Enterprise + Atmosphere** |
| `reviews` (no lo usamos; ver 3) | textos de reseñas | **Enterprise + Atmosphere** | **Enterprise + Atmosphere** |

Reglas de facturación ([Usage and Billing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing), consultada 2026-10-26): "You are then billed at the highest SKU applicable to your request". Y: si no se manda field mask, la llamada devuelve error (no hay lista por defecto); se desaconseja `*` en producción.

Aclaración sobre `photos`: pedir la lista `photos` en Details es "Essentials (IDs Only)" (gratis), pero **descargar la imagen** (`.../media`) se factura como SKU **Place Details Photos**: USD 7,00 por 1.000, con 1.000 gratis al mes ([lista de precios](https://developers.google.com/maps/billing-and-pricing/pricing), Last updated 2026-10-23). En la pantalla "¿Es este?" conviene mostrar la foto una sola vez, o no mostrarla.

### 1.2 Field masks (ejemplos concretos)

**Búsqueda (Text Search) mínima para la pantalla "¿Es este?"** → factura **Text Search Pro**:

```
X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.location,places.primaryType,places.googleMapsUri
```

Sin espacios en la lista (la doc lo exige: "Spaces are not allowed anywhere in the field list"). Si además queremos mostrar el rating en la confirmación, hay que agregar `places.rating,places.userRatingCount`, y eso sube la búsqueda a **Text Search Enterprise** (USD 35/1.000): no conviene; mejor traer el rating en el Details posterior.

**Detalle mínimo para el diagnóstico** (Place Details; el campo más caro define el SKU):

- *Sin canales de Google* → **Place Details Enterprise** (USD 20/1.000):
```
X-Goog-FieldMask: id,displayName,formattedAddress,addressComponents,location,primaryType,businessStatus,googleMapsUri,rating,userRatingCount,regularOpeningHours,websiteUri,priceLevel
```
- *Con canales (`delivery`, `takeout`, `dineIn`)* → **Place Details Enterprise + Atmosphere** (USD 25/1.000):
```
X-Goog-FieldMask: id,displayName,formattedAddress,addressComponents,location,primaryType,businessStatus,googleMapsUri,rating,userRatingCount,regularOpeningHours,websiteUri,priceLevel,delivery,takeout,dineIn
```

Recomendación: pedir los canales, son solo USD 5 más por 1.000 y alimentan el área "delivery" del scoring. Si en una prueba se ve que el flag `delivery` casi nunca viene, sacarlo.

### 1.3 `locationBias`, `regionCode`, `languageCode`

Fuente: [Text Search (New), parámetros opcionales](https://developers.google.com/maps/documentation/places/web-service/text-search) (Last updated 2026-10-23).

- **`locationBias`**: "results around the specified location can be returned, including results outside the specified area". Acepta círculo (`center` + `radius` de 0 a 50.000 m) o rectángulo. No se puede combinar con `locationRestriction` (solo rectángulo y "for categorical queries only"). Si se omiten ambos, **la API sesga por la IP del dispositivo** por defecto ("IP biasing"). Ojo: si el `textQuery` ya trae un lugar explícito ("Pizzería X en Lanús"), el `locationBias` se ignora.
- **`regionCode`**: código CLDR de 2 letras (`AR`, `MX`, `CL`, `CO`, `BR`). Formatea la respuesta (omite el país en `formattedAddress` si coincide) y "can also have a bias effect on the search results". Sin valor por defecto.
- **`languageCode`**: si no se manda, **default `en`**. Un código inválido da `INVALID_ARGUMENT`. Valores válidos confirmados en la [lista de idiomas](https://developers.google.com/maps/faq) (Last updated 2026-10-26): `es`, `es-419` (español de Latinoamérica), `pt-BR`. Propuesta: `es-419` para AR/MX/CL/CO y `pt-BR` para BR.
- **Sesgo por IP en Vercel** (la idea del PLAN): Vercel inyecta los headers `x-vercel-ip-country`, `x-vercel-ip-latitude` y `x-vercel-ip-longitude` (más `-city` y `-country-region`). Fuente: [Vercel request headers](https://vercel.com/docs/headers/request-headers). Se arma el `locationBias.circle` con esa latitud/longitud (radio sugerido: 20.000 m) y `regionCode` con el país. Esa lat/lng **no viene de Google**, así que no tiene restricción de caché de Maps.
- Otros parámetros útiles: `pageSize` (1 a 20, default 20; para el buscador alcanza con 5), `includedType` (sesga por tipo, por ejemplo `restaurant`; con `strictTypeFiltering: true` filtra de verdad), `includeFutureOpeningBusinesses` (devuelve locales "por abrir"; sirve para la ruta "por abrir → Consultor de Nuevos Negocios" y se consulta con `businessStatus` / `openingDate`). Tope de Text Search: 60 resultados en total entre páginas.

### 1.4 Forma del JSON (para el fixture del test)

**A. Ejemplos reales de la documentación** (tal cual figuran en las páginas oficiales, consultadas 2026-10-26; texto de la doc bajo licencia CC BY 4.0):

*Text Search, request y respuesta* ([fuente](https://developers.google.com/maps/documentation/places/web-service/text-search)):
```bash
curl -X POST -d '{ "textQuery" : "Spicy Vegetarian Food in Sydney, Australia" }' \
-H 'Content-Type: application/json' -H 'X-Goog-Api-Key: API_KEY' \
-H 'X-Goog-FieldMask: places.displayName,places.formattedAddress' \
'https://places.googleapis.com/v1/places:searchText'
```
```json
{
  "places": [
    {
      "formattedAddress": "367 Pitt St, Sydney NSW 2000, Australia",
      "displayName": { "text": "Mother Chu's Vegetarian Kitchen", "languageCode": "en" }
    }
  ]
}
```
*Place Details, request y respuesta* ([fuente](https://developers.google.com/maps/documentation/places/web-service/place-details)):
```bash
curl -X GET -H 'Content-Type: application/json' -H "X-Goog-Api-Key: API_KEY" \
-H "X-Goog-FieldMask: id,displayName" \
https://places.googleapis.com/v1/places/ChIJj61dQgK6j4AR4GeTYWZsKWw
```
```json
{ "id": "ChIJj61dQgK6j4AR4GeTYWZsKWw", "displayName": { "text": "Googleplex", "languageCode": "en" } }
```
Ejemplo de `locationBias` de la doc: `"locationBias": { "circle": { "center": {"latitude": 37.7937, "longitude": -122.3965}, "radius": 500.0 } }`.

**B. Fixture ILUSTRATIVO (armado por nosotros, datos ficticios)**. La doc oficial no publica una respuesta completa con `rating`, `regularOpeningHours`, `delivery`, etc. Este ejemplo sigue el esquema del [recurso `Place` (REST reference)](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places) (Last updated 2026-10-23), con los nombres y tipos de campo de ahí. **No es una respuesta real de Google ni un local real**: el `place_id` y los valores son inventados. Usarlo solo como `tests/fixtures/places-details.sample.json`.

Request del Constructor (Text Search):
```json
POST https://places.googleapis.com/v1/places:searchText
Headers: Content-Type: application/json · X-Goog-Api-Key: <GOOGLE_PLACES_API_KEY> ·
         X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.location,places.primaryType,places.googleMapsUri
{
  "textQuery": "Pizzería La Esquina Lanús",
  "languageCode": "es-419",
  "regionCode": "AR",
  "pageSize": 5,
  "locationBias": { "circle": { "center": { "latitude": -34.70, "longitude": -58.39 }, "radius": 20000.0 } }
}
```
Respuesta esperada (forma):
```json
{
  "places": [
    {
      "id": "ChIJ_FIXTURE_NO_REAL_0001",
      "displayName": { "text": "Pizzería La Esquina", "languageCode": "es" },
      "formattedAddress": "Av. Hipólito Yrigoyen 1234, B1824 Lanús, Provincia de Buenos Aires, Argentina",
      "location": { "latitude": -34.7000, "longitude": -58.3900 },
      "primaryType": "pizza_restaurant",
      "googleMapsUri": "https://maps.google.com/?cid=0000000000000000000"
    }
  ]
}
```
Request (Place Details, con canales):
```
GET https://places.googleapis.com/v1/places/ChIJ_FIXTURE_NO_REAL_0001?languageCode=es-419&regionCode=AR
Headers: X-Goog-Api-Key: <GOOGLE_PLACES_API_KEY> ·
         X-Goog-FieldMask: id,displayName,formattedAddress,addressComponents,location,primaryType,businessStatus,googleMapsUri,rating,userRatingCount,regularOpeningHours,websiteUri,priceLevel,delivery,takeout,dineIn
```
Respuesta esperada (forma):
```json
{
  "id": "ChIJ_FIXTURE_NO_REAL_0001",
  "displayName": { "text": "Pizzería La Esquina", "languageCode": "es" },
  "formattedAddress": "Av. Hipólito Yrigoyen 1234, B1824 Lanús, Provincia de Buenos Aires, Argentina",
  "addressComponents": [
    { "longText": "1234", "shortText": "1234", "types": ["street_number"], "languageCode": "es" },
    { "longText": "Avenida Hipólito Yrigoyen", "shortText": "Av. Hipólito Yrigoyen", "types": ["route"], "languageCode": "es" },
    { "longText": "Lanús", "shortText": "Lanús", "types": ["locality", "political"], "languageCode": "es" },
    { "longText": "Provincia de Buenos Aires", "shortText": "Provincia de Buenos Aires", "types": ["administrative_area_level_1", "political"], "languageCode": "es" },
    { "longText": "Argentina", "shortText": "AR", "types": ["country", "political"], "languageCode": "es" },
    { "longText": "B1824", "shortText": "B1824", "types": ["postal_code"], "languageCode": "es" }
  ],
  "location": { "latitude": -34.7000, "longitude": -58.3900 },
  "primaryType": "pizza_restaurant",
  "businessStatus": "OPERATIONAL",
  "googleMapsUri": "https://maps.google.com/?cid=0000000000000000000",
  "rating": 4.3,
  "userRatingCount": 812,
  "priceLevel": "PRICE_LEVEL_MODERATE",
  "websiteUri": "https://www.example-pizzeria.test/",
  "regularOpeningHours": {
    "openNow": true,
    "periods": [
      { "open": { "day": 1, "hour": 19, "minute": 0 }, "close": { "day": 1, "hour": 23, "minute": 30 } },
      { "open": { "day": 5, "hour": 19, "minute": 0 }, "close": { "day": 6, "hour": 1, "minute": 0 } }
    ],
    "weekdayDescriptions": [
      "lunes: 19:00 – 23:30", "martes: 19:00 – 23:30", "miércoles: 19:00 – 23:30",
      "jueves: 19:00 – 23:30", "viernes: 19:00 – 1:00", "sábado: 19:00 – 1:00", "domingo: 19:00 – 23:30"
    ]
  },
  "delivery": true,
  "takeout": true,
  "dineIn": true
}
```
Detalles de esquema a respetar en el parser (todo de la [REST reference](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places), consultada 2026-10-26):
- `day` va de **0 (domingo) a 6 (sábado)**; `hour` 0 a 23. El orden de `periods` es independiente del de `weekdayDescriptions` ("Do not assume they will begin on the same day"), y el texto de `weekdayDescriptions` depende del `languageCode`.
- `periods[].close` podría faltar en locales que abren 24 h (no verificado en esta pasada); hay que tolerar su ausencia.
- Los campos opcionales **pueden no venir**: un local sin reseñas no trae `rating` ni `userRatingCount`; `delivery`/`takeout`/`dineIn` pueden faltar. El parser debe tratar "ausente" distinto de `false`.
- `addressComponents` "can change over time": no depender de la posición del array, buscar por `types`. El país sale del componente con `types` que incluye `"country"` y `shortText` es el ISO (`AR`, `MX`, `CL`, `CO`, `BR`).
- `priceLevel` es enum: `PRICE_LEVEL_FREE | INEXPENSIVE | MODERATE | EXPENSIVE | VERY_EXPENSIVE` (prefijo `PRICE_LEVEL_`); `businessStatus`: `OPERATIONAL | CLOSED_TEMPORARILY | CLOSED_PERMANENTLY`.
- `photos[]` (si se pide) trae `name` (`places/{id}/photos/{ref}`), `widthPx`, `heightPx`, `authorAttributions[]` (`displayName`, `uri`, `photoUri`) y `googleMapsUri`.
- El `id` es el place_id sin prefijo; el campo `name` trae `places/{id}`.
- Errores: sin field mask → error; `languageCode` inválido → `INVALID_ARGUMENT`; cuota excedida → HTTP 429 (comportamiento estándar de Google Cloud, no verificado en esta pasada); el fixture de error puede ser `{"error":{"code":429,"status":"RESOURCE_EXHAUSTED"}}` para probar el fallback a snapshot.

### 1.5 Precios y tier gratuito vigentes

Fuente: [Google Maps Platform pricing list (global)](https://developers.google.com/maps/billing-and-pricing/pricing), **Last updated 2026-10-23**, consultada 2026-10-26. USD por 1.000 eventos facturables, mes calendario. El tope gratis se consume primero y los precios son por tramo de volumen.

| SKU (Places API New) | Gratis/mes | Hasta 100.000 | 100.001–500.000 | 500.001–1M | 1M–5M | 5M+ |
|---|---|---|---|---|---|---|
| Text Search Essentials (IDs Only) | Ilimitado | – | – | – | – | – |
| Place Details Essentials (IDs Only) | Ilimitado | – | – | – | – | – |
| Place Details Essentials | 10.000 | USD 5,00 | 4,00 | 3,00 | 1,50 | 0,38 |
| Autocomplete Requests | 10.000 | USD 2,83 | 2,27 | 1,70 | 0,85 | 0,21 |
| Autocomplete Session Usage | Ilimitado | – | – | – | – | – |
| **Text Search Pro** | **5.000** | **USD 32,00** | 25,60 | 19,20 | 9,60 | 2,40 |
| Place Details Pro | 5.000 | USD 17,00 | 13,60 | 10,20 | 5,10 | 1,28 |
| Text Search Enterprise | 1.000 | USD 35,00 | 28,00 | 21,00 | 10,50 | 2,63 |
| Text Search Enterprise + Atmosphere | 1.000 | USD 40,00 | 32,00 | 24,00 | 12,00 | 3,40 |
| **Place Details Enterprise** | **1.000** | **USD 20,00** | 16,00 | 12,00 | 6,00 | 1,51 |
| **Place Details Enterprise + Atmosphere** | **1.000** | **USD 25,00** | 20,00 | 15,00 | 7,50 | 2,28 |
| Place Details Photos (imagen de foto) | 1.000 | USD 7,00 | 5,60 | 4,20 | 2,10 | 0,53 |

**Qué cambió en marzo 2025 (verificado):** "As of March 1, 2025 ... Free usage caps replace monthly $200 credit" ([Billing overview, sección "March 2025 changes"](https://developers.google.com/maps/billing-and-pricing/overview), Last updated 2026-10-23). El [FAQ de cambios](https://developers.google.com/maps/billing-and-pricing/faq) confirma que los topes gratis son 10.000 (Essentials), 5.000 (Pro) y 1.000 (Enterprise) eventos por SKU. El tope se reinicia "on the first day of each month, at midnight Pacific US time". La página de precios aclara además "Upcoming changes include adjustments to discounts and credits": **hay cambios anunciados; revisar la página antes de producción**.

Lo que NO encontré: un tope duro de gasto automático. Para limitar el gasto hay cuotas por proyecto y alertas de presupuesto ([Manage costs](https://developers.google.com/maps/billing-and-pricing/manage-costs): "Stop charges by capping the number of billing events your app triggers"; "Get notified when your usage approaches specific budget or API limits"). Las alertas de presupuesto avisan, la cuota corta.

### 1.6 ToS de caché: qué se puede guardar

Documentos (consultados 2026-10-26):
- [Policies and attributions for Places API](https://developers.google.com/maps/documentation/places/web-service/policies) (Last updated 2026-10-23).
- [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms) (el sitio indica "Last modified August 26, 2026").
- [Google Maps Platform Service Specific Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms), sección 14 "Places API (Legacy and New)".
- [Place IDs](https://developers.google.com/maps/documentation/places/web-service/place-id).

| Qué | Qué dice | Dónde |
|---|---|---|
| **Regla general** | "You must not pre-fetch, cache, or store Places API content beyond the allowed exceptions, although the place_id is exempt from caching restrictions." | Policies, resumen de página |
| **place_id** | "You can therefore store place ID values indefinitely." Recomienda refrescarlo si tiene más de 12 meses (el refresh con solo el campo ID es gratis, SKU "Place Details Essentials (IDs Only)"). | [Policies](https://developers.google.com/maps/documentation/places/web-service/policies) · [Place IDs](https://developers.google.com/maps/documentation/places/web-service/place-id) · ToS Service Specific "Google ID Caching" |
| **lat/lng** | "Customer may temporarily cache latitude and longitude values from the Places API for up to 30 consecutive calendar days, after which Customer must delete the cached latitude and longitude values." | Service Specific Terms, §14.3 |
| **Todo lo demás** | "(b) No Caching. Customer will not cache Google Maps Content except as expressly permitted under the Maps Service Specific Terms." | ToS §3.2.3(b) |
| **Copiar nombres/direcciones/reseñas** | "(a) No Scraping. ... Customer will not: (i) pre-fetch, index, store, reshare, or rehost Google Maps Content outside the services; ... (iii) copy and save business names, addresses, or user reviews" | ToS §3.2.3(a) |
| **Entrenar modelos** | "(vii) use Google Maps Content to improve machine learning and artificial intelligence models, including to train, test, validate or fine-tune the models." | ToS §3.2.3(c) |
| **Directorios / publicidad** | "(iii) use the Google Maps Core Services in a listings or directory service or to create or augment an advertising product" | ToS §3.2.3(d) |
| **Mapa de terceros** | No mostrar contenido de Places junto a un mapa que no sea de Google. | ToS §3.2.3(e) y Service Specific §14.2 |
| **Atribución** | Si se muestran datos de Places sin mapa de Google, hay que mostrar atribución "Google Maps" (logo o texto) cerca de los datos. Uso de Places sin mapa está permitido (§14.1). | [Policies](https://developers.google.com/maps/documentation/places/web-service/policies) · Service Specific §14.1 |
| **Términos y privacidad propios** | La app debe tener Términos de Uso y Política de Privacidad públicos que referencien los de Google. | [Policies](https://developers.google.com/maps/documentation/places/web-service/policies) |

**Conclusión, por qué el snapshot es solo para la demo.** El diseño de producción es: guardar solo `place_id` (y a lo sumo lat/lng por 30 días) y llamar a la API en vivo para el resto. Un snapshot con nombre, dirección, rating, cantidad de reseñas y horarios de Google es exactamente lo que los ToS llaman "store / copy and save business names, addresses" y "rehost". Por eso el snapshot (a) es una demo declarada, con fecha de captura, (b) no se usa en producción, y (c) en producción lo reemplaza `GooglePlacesProvider`.

### 1.7 Riesgos de ToS (ordenados por gravedad)

1. **ALTO · Snapshot público en GitHub con datos que vengan de Google.** Si el snapshot se llena con valores de Google (nombre/dirección/rating/horarios), publicarlo en un repo público es "reshare/rehost" del contenido. Opciones para decidir en G-OK0: (a) repo privado; (b) snapshot con campos de Google acotados (solo `place_id` + lo que viene de la web/Instagram del propio local, y el rating marcado como capturado manualmente el dd/mm); (c) dejar los valores de Google fuera del repo y cargarlos por variable/archivo local. Recomendación: (b) + declarar el riesgo en el informe. *Este punto depende de cómo arme la instancia (b) el snapshot: coordinar.*
2. **MEDIO · "Listings/directory/advertising" (§3.2.3(d)(iii)).** Una herramienta cuyo fin es captar leads para Fudo con datos de Places podría interpretarse como "augment an advertising product". Es una interpretación mía, no un hallazgo de Google. Antes de producción: consultar con Google (Contact sales) o con un abogado.
3. **MEDIO · Mandar datos de Places a un LLM.** El [pricing de Gemini](https://ai.google.dev/gemini-api/docs/pricing) (Last updated 2026-10-26) marca en el **tier gratuito "Used to improve our products: Yes"**; en el pago "No". Enviar contenido de Places al tier gratis colisiona con §3.2.3(c)(vii) (no usar contenido de Maps para mejorar modelos). Mitigación: en la demo no hay LLM (D3); si se activa, usar el tier pago o no mandar campos de Google al modelo (solo el score ya calculado).
4. **MEDIO · Atribución y términos.** Falta de logo/texto "Google Maps" cuando se muestran datos de Places; falta de Términos y Privacidad públicos. Hay que agregarlos a la UI cuando el badge diga "en vivo".
5. **BAJO · Key expuesta / abuso.** La key vive solo en el servidor (el frontend no conoce el proveedor). Restringir la key por API y poner cuota diaria en Cloud Console.
6. **BAJO · Cambios de precio.** La página avisa cambios próximos de descuentos y créditos; revisar antes de producción.

---

## 2. Otras fuentes y cómo se conseguirían en producción

### 2.1 Instagram

- **Camino oficial para datos de una cuenta ajena: Business Discovery.** Doc: [IG User Business Discovery](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/business_discovery) (sin fecha en la página; consultada 2026-10-26).
  - Requisitos: la consulta se hace *desde* una cuenta de Instagram **Business o Creator** propia (la de Fudo, por ejemplo), con un token de usuario de Facebook con `instagram_basic`, `instagram_manage_insights` y `pages_read_engagement` (y `ads_management` o `ads_read` si el rol en la Página se dio vía Business Manager). La cuenta objetivo se identifica por `username`: `GET /<IG_USER_ID>?fields=business_discovery.username(<USERNAME>)`.
  - Qué se puede leer de la cuenta ajena (según la doc): `followers_count`, `media_count`, el `id` y la lista de medios con `comments_count`, `like_count` y `view_count`. La página no lista `biography` ni otros campos; manda a la referencia de IG User (campos como bio/web: **no verificados**).
  - Limitaciones declaradas: no devuelve datos de cuentas con restricción de edad; solo cubre cuentas **Business/Creator** (la doc **no** habla de privadas o personales: se asume que no aplican, no verificado); no hay escritura.
  - Permisos: la página de [Permissions](https://developers.facebook.com/docs/permissions/) dice que App Review hace falta para apps que acceden a datos que no son tuyos y que "Business Verification ... is required for all apps making requests for Advanced Access". No encontré una línea que diga explícitamente qué nivel de acceso exige Business Discovery para cuentas ajenas; lo razonable es planear app en modo Live + App Review + Business Verification (no verificado).
  - Límites de uso: la doc de Business Discovery no los da. Según [Rate Limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting) (sin fecha): las llamadas de Business Discovery caen bajo los límites de plataforma, "200 × número de usuarios" por hora por app (ventana móvil de 1 hora).
- **Scraping: no.** [Meta Automated Data Collection Terms](https://www.facebook.com/apps/site_scraping_tos_terms.php) (vigente desde 2024-10-07): se necesita "express written permission" de Meta para cualquier recolección automatizada; prohíbe, entre otras, ignorar robots.txt y recolectar datos no públicos.
- **Términos de Plataforma** ([Meta Platform Terms](https://developers.facebook.com/terms/), "Última actualización: 3 de febrero de 2026"): procesar (incluye almacenar) los datos solo según tu política de privacidad y la documentación; borrarlos cuando se deja de operar el producto o cuando un usuario lo pide. No fija un intervalo de refresco.
- **Alternativa de menor fricción:** pedirle al dueño su usuario de Instagram en el flujo y conectar con su consentimiento (OAuth), o dejar que lo declare. Para la demo no hace falta.

### 2.2 Facebook Pages (Meta)

- Leer datos de Páginas que no administrás requiere la feature [Page Public Content Access](https://developers.facebook.com/docs/features-reference/page-public-content-access) (sin fecha): permite la Page Search API y leer datos públicos (metadatos del negocio, posts y comentarios públicos); exige **App Review + Business Verification** y puede requerir contratos adicionales. Antes de la revisión solo accede a Páginas cuyo admin tiene rol en la app.
- Veredicto: costo/beneficio bajo para este diagnóstico (el Instagram y Google dan más señal). Dejar fuera del MVP; "presencia" se detecta por el link en la web del local.

### 2.3 Apps de delivery (PedidosYa, Rappi, Uber Eats, DiDi Food, iFood)

Hallazgo común: **ninguna publica una API abierta para consultar rating, reseñas o ranking de un local ajeno.** Las APIs que existen son para **aliados/integradores del propio local** (POS, gestores de pedidos), con onboarding manual.

| App | Qué encontré (oficial) | Qué NO encontré / no se pudo verificar |
|---|---|---|
| **Rappi** | [Developer Portal Rappi](https://dev-portal.dev.rappi.com/) y [Getting Started](https://dev-portal.dev.rappi.com/en/api-reference/) (sin fecha): API para "Rappi allies"; permite gestionar pedidos, tiendas, menús, disponibilidad de ítems y webhooks. Acceso: "integrating with our API requires direct contact with our team"; las credenciales (`client_id`, `client_secret`) se entregan al aprobarte. Aviso oficial: "We are in the process of improving our public APIs". | Datos públicos de un local ajeno (ratings): **no encontrado**. T&C sobre scraping: **no verificado** (el sitio devolvió una respuesta vacía HTTP 202 a la consulta automática de robots.txt; no la reintenté). |
| **Uber Eats** | [Uber Eats Marketplace APIs](https://developer.uber.com/docs/eats/introduction) (sin fecha; © 2026): para partners, sobre todo integradores de POS; suites de Menú, Tienda, Pedidos, Promociones y Reportes. "Access to These APIs May Require Written Approval From Uber". OAuth 2.0 con scopes. | API pública de descubrimiento de tiendas, ratings o reseñas: **no encontrado**. T&C de scraping: **no verificado** (el sitio devolvió un challenge de Cloudflare a la consulta automática). |
| **iFood** (BR) | Portal oficial `developer.ifood.com.br`: devolvió **403** a mi consulta automática, **no pude leerlo**. Fuentes de terceros (paquetes de código, no oficiales) indican flujo de "aplicación distribuida" donde el comerciante autoriza con un código de usuario en el Portal del Parceiro. El [robots.txt de iFood](https://www.ifood.com.br/robots.txt) (consultado 2026-10-26) permite `/` a los bots en general pero bloquea rutas como `/pedido/`, `/minha-conta/` y, para Googlebot, `/delivery/`. | Contenido oficial del portal y T&C: **no verificado**. |
| **PedidosYa** | El portal [developers.pedidosya.com](https://developers.pedidosya.com/) existe y muestra "Courier API Documentation v3"; es la API de **envíos** (PedidosYa Envíos), no de catálogo de restaurantes (sin más detalle porque la página carga por JavaScript). Las integraciones de restaurante se hacen vía terceros que lo declaran, por ejemplo [Deliverect](https://www.deliverect.com/en/integrations/pedidosya) ("requires a subscription to PedidosYa and Deliverect"). | API de restaurantes/ratings: **no encontrado**. T&C y robots.txt: **no verificado** (el sitio devolvió una página HTML en lugar del robots.txt a la consulta automática; no la reintenté). |
| **DiDi Food** | Sin documentación de API oficial hallada. Un agregador tercero lista la integración ([Deliverect, DiDi Food](https://www.deliverect.com/integrations/didi-food)). | Portal de desarrolladores oficial: **no encontrado**. T&C: **no verificado**. |

Notas de método: no intenté eludir ninguna protección anti-bot. Que el servidor devuelva un challenge a un cliente automático es evidencia de que **tratan el acceso automatizado como no deseado**, pero no es una cláusula de ToS. Por defecto, asumir que **el scraping no está autorizado** en las cinco y que cualquier uso productivo requiere permiso escrito o acuerdo de aliado.

**Camino en producción (sin scraping):**
1. **Declarado por el dueño en el quiz** ("¿en qué apps vendés?"): gratis, confiable para el ruteo, ya está en el flujo.
2. **Links desde la web propia / Instagram del local** (los locales suelen linkear su ficha de PedidosYa/Rappi): se detecta presencia con un fetch de la web propia (ver 2.4).
3. **Google**: los flags `delivery`, `takeout`, `dineIn` dicen que el local ofrece el canal, no en qué app.
4. **Acuerdo de aliado**: Fudo, como proveedor de POS/gestión, es el tipo de actor al que las apps abren API (Rappi "allies", Uber "POS integrators"). Con autorización del dueño, se pueden leer sus tiendas y menús. Si Fudo ya tiene esos convenios: **no verificado, preguntar al equipo de Fudo**.

### 2.4 Web propia: fetch propio + PageSpeed Insights API

- **Fetch del sitio** (server-side): título, meta description, Open Graph, JSON-LD de `Restaurant`/`LocalBusiness`, links a redes y a apps de delivery, si hay carta/menú, si hay botón de pedido, HTTPS, si responde. Costo USD 0. Reglas: timeout corto, user-agent que nos identifique, respetar `robots.txt`, no seguir más de pocos links.
- **PageSpeed Insights API v5** ([get-started](https://developers.google.com/speed/docs/insights/v5/get-started), Last updated 2025-08-28; [runPagespeed](https://developers.google.com/speed/docs/insights/rest/v5/pagespeedapi/runpagespeed) / [referencia](https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed), Last updated 2025-10-27):
  - Endpoint: `GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<URL>&strategy=mobile&category=performance&category=seo&category=accessibility&category=best-practices&key=<KEY>`.
  - Parámetros: `url` (obligatorio), `category` (`accessibility`, `best-practices`, `performance`, `seo`; si no se manda, solo corre Performance), `strategy` (`desktop` default, o `mobile`), `locale`.
  - Key: "The API can be used with or without an API key, although a key is recommended for frequent, automated queries".
  - **Cuota gratuita: no encontrada en la documentación oficial.** La página no publica el número. Fuentes de terceros mencionan 25.000 consultas/día y ~240/minuto por proyecto, pero **no son oficiales**: verificarlo en Google Cloud Console (APIs & Services > PageSpeed Insights API > Cuotas) antes de depender de ese número.
  - Precio: **no encontré un precio publicado** en la doc oficial; asumo que el uso dentro de cuota es sin cargo (no verificado).
  - Campos útiles de la respuesta: `lighthouseResult.categories.performance.score` (0 a 1; ídem `seo`, `accessibility`, `best-practices`), `lighthouseResult.audits[...]` (`largest-contentful-paint`, `cumulative-layout-shift`, `viewport`, `meta-description`, `is-crawlable`, `link-text`), `loadingExperience` (datos de campo de CrUX, a veces ausente para sitios chicos) y `lighthouseResult.finalUrl`.
  - Tiempo: una corrida de Lighthouse tarda decenas de segundos (**estimado, medir**); hay que llamarla en paralelo con el resto del diagnóstico y con timeout, y degradar sin romper si falla.

### 2.5 Google Business Profile API (no investigada)

Existe como vía con consentimiento del dueño (OAuth) para horarios, reseñas y métricas propias. **No investigada en esta pasada**: queda como candidata para la etapa "Fudo Especialista en Google" en producción.

---

## 3. Qué es real y qué es simulado en la demo

Propuesta (consistente con PLAN §0 y D3):

- **Google = snapshot real**, fechado, con el badge "real · capturado el dd/mm". Riesgo de ToS: ver 1.7 punto 1.
- **Web propia = real si existe**: fetch + PSI si hay key; sin key, solo fetch y PSI se muestra como "no medido".
- **Instagram y apps de delivery = presencia real del link** (verificada a mano al capturar el snapshot) **+ métricas simuladas** (seguidores, ranking, tiempo de entrega), marcadas como "simulado".
- **LLM = simulado por reglas/plantillas** (D3: sin key de Gemini).

## 4. Tabla final: Fuente · Cómo en producción · Restricción · Costo · Demo

| Fuente | Cómo en producción | Restricción principal | Costo | Demo (real/simulado) |
|---|---|---|---|---|
| **Google Places (New)**: nombre, dirección, país, rating, reseñas, horarios, web, canales | `GooglePlacesProvider`: Text Search Pro (o Autocomplete con sesión) + Place Details Enterprise (+Atmosphere); guardar solo `place_id` | No cachear ni copiar contenido salvo `place_id` (lat/lng 30 días); atribución "Google Maps"; ToS §3.2.3 (b)(c)(d); requiere cuenta de facturación | USD 0,052 por diagnóstico (0,057 con canales; 0,025 con Autocomplete); primeros 1.000/mes gratis | **Real (snapshot fechado)**; en vivo si hay `GOOGLE_PLACES_API_KEY` |
| **Google Place Photos** | Media de foto bajo demanda | Mismas restricciones; atribuciones de autor | USD 7/1.000 (1.000 gratis/mes) | Real solo si se captura; opcional |
| **Web propia** (fetch) | Fetch server-side del `websiteUri` | Respetar robots.txt; timeout; no es contenido de Google | USD 0 | **Real si existe** |
| **PageSpeed Insights API** | `runPagespeed` mobile con key | Cuota gratuita **no encontrada oficialmente** (terceros: 25.000/día); lento | USD 0 (precio no publicado, no verificado) | Real si hay key; si no, "no medido" |
| **Instagram** | Business Discovery desde una cuenta Business/Creator de Fudo; o conexión OAuth del dueño | App Review + Business Verification; solo cuentas Business/Creator; sin scraping (Meta exige permiso escrito) | USD 0 (sin cargo documentado); costo de tiempo de revisión | **Presencia real (link); métricas simuladas** |
| **Facebook Pages** | Page Public Content Access | App Review + Business Verification, posibles contratos | USD 0 documentado | No usado (fuera de MVP) |
| **PedidosYa** | Acuerdo de aliado / declarado por el dueño / link en la web propia | Sin API pública de ratings; T&C **no verificados**; scraping no autorizado por defecto | No encontrado | **Presencia real (link); métricas simuladas** |
| **Rappi** | Programa de aliados (`dev-portal.dev.rappi.com`), contacto comercial | Acceso solo con aprobación; API para el propio local | No encontrado | **Presencia real (link); métricas simuladas** |
| **Uber Eats** | Marketplace APIs para partners POS | "May Require Written Approval From Uber"; sin descubrimiento público | No encontrado | **Presencia real (link); métricas simuladas** |
| **DiDi Food** | Vía agregadores (ej. Deliverect) o contacto comercial | Sin API oficial hallada | No encontrado | **Presencia real (link); métricas simuladas** |
| **iFood** (BR) | Portal de desarrolladores con autorización del comerciante | Portal oficial no verificable (403); datos de terceros no oficiales | No encontrado | **Presencia real (link); métricas simuladas** (BR = recorte declarado) |
| **LLM (Gemini)** | Opcional, solo sobre el score calculado | Tier gratis usa los datos para mejorar productos; no mandar contenido de Places | Ver `costos.md` | **Simulado por reglas** (D3) |

---

## 5. Lista de pendientes / "no encontrado"

- Cuota oficial gratuita de PageSpeed Insights API: no encontrada en docs públicas.
- Precio de PageSpeed Insights API: no encontrado.
- Campos completos de IG User en Business Discovery (bio, web): no verificados.
- T&C de PedidosYa, Rappi, Uber Eats, DiDi Food, iFood sobre scraping: no verificados (acceso automático bloqueado o página por JS).
- Portal oficial de iFood: 403 a mi consulta; contenido no verificado.
- DiDi Food API oficial: no encontrada.
- Google Business Profile API: no investigada.
- Convenios existentes de Fudo con las apps de delivery: no verificados (preguntar a Fudo).

## 6. Índice de fuentes (todas consultadas el 2026-10-26)

- Google · Pricing: https://developers.google.com/maps/billing-and-pricing/pricing (Last updated 2026-10-23)
- Google · Billing overview: https://developers.google.com/maps/billing-and-pricing/overview (2026-10-23)
- Google · FAQ de cambios (marzo 2025): https://developers.google.com/maps/billing-and-pricing/faq
- Google · Manage costs: https://developers.google.com/maps/billing-and-pricing/manage-costs
- Google · Place Data Fields: https://developers.google.com/maps/documentation/places/web-service/data-fields (2026-10-23)
- Google · Text Search (New): https://developers.google.com/maps/documentation/places/web-service/text-search (2026-10-23)
- Google · Place Details (New): https://developers.google.com/maps/documentation/places/web-service/place-details (2026-10-23)
- Google · REST reference Place: https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places (2026-10-23)
- Google · Usage and Billing: https://developers.google.com/maps/documentation/places/web-service/usage-and-billing
- Google · Session pricing: https://developers.google.com/maps/documentation/places/web-service/session-pricing (2026-10-23)
- Google · Place types: https://developers.google.com/maps/documentation/places/web-service/place-types (2026-10-23)
- Google · Policies and attributions: https://developers.google.com/maps/documentation/places/web-service/policies (2026-10-23)
- Google · Place IDs: https://developers.google.com/maps/documentation/places/web-service/place-id
- Google · Maps Platform ToS: https://cloud.google.com/maps-platform/terms (last modified August 26, 2026)
- Google · Service Specific Terms: https://cloud.google.com/maps-platform/terms/maps-service-terms
- Google · Idiomas soportados: https://developers.google.com/maps/faq (2026-10-26)
- Google · PageSpeed Insights API: https://developers.google.com/speed/docs/insights/v5/get-started (2025-08-28) · https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed (2025-10-27)
- Google · Gemini pricing: https://ai.google.dev/gemini-api/docs/pricing (2026-10-26)
- Vercel · Request headers: https://vercel.com/docs/headers/request-headers
- Meta · Business Discovery: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/business_discovery
- Meta · Rate limiting: https://developers.facebook.com/docs/graph-api/overview/rate-limiting
- Meta · Permissions: https://developers.facebook.com/docs/permissions/
- Meta · Automated Data Collection Terms: https://www.facebook.com/apps/site_scraping_tos_terms.php (2024-10-07)
- Meta · Platform Terms: https://developers.facebook.com/terms/ (2026-02-03)
- Meta · Page Public Content Access: https://developers.facebook.com/docs/features-reference/page-public-content-access
- Rappi · Dev portal: https://dev-portal.dev.rappi.com/ · https://dev-portal.dev.rappi.com/en/api-reference/
- Uber Eats · Marketplace APIs: https://developer.uber.com/docs/eats/introduction
- PedidosYa · Developers: https://developers.pedidosya.com/
- iFood · robots.txt: https://www.ifood.com.br/robots.txt
- Deliverect (tercero): https://www.deliverect.com/en/integrations/pedidosya · https://www.deliverect.com/integrations/didi-food
