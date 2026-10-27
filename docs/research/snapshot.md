# Snapshot de restaurantes reales (demo)

**Fecha de captura:** 2026-10-26 · **Archivos:** `app/data/snapshots/*.json` (13 locales + `index.json`)

> **Aviso: snapshot solo para la demo.** Los Términos de Servicio de Google Maps Platform no permiten cachear/almacenar los datos de Places más allá de lo que autorizan (p. ej. IDs de lugar). Por eso este snapshot está fechado, declarado como tal en la UI ("real · capturado el 26/10/2026") y **en producción el dato se consulta en vivo a la API oficial** (`GooglePlacesProvider`, activo con `GOOGLE_PLACES_API_KEY`). Ningún campo de este snapshot debe tratarse como dato vigente.

## Cómo se capturó

- Solo datos públicos del negocio: nombre, dirección, tipo, rating, cantidad de reseñas, horarios, web, Instagram, links de delivery, sucursales, nivel de precio y opciones de servicio.
- **Cero datos personales**: no se guardó ningún nombre ni texto de reseñas, ni nombres de dueños/empleados, ni teléfonos. No se descargó ninguna foto.
- Fuente principal: **ficha de Google que aparece en la búsqueda web** (panel con rating, reseñas, dirección, horarios, precio por persona, botones de pedido), leída desde un navegador el 2026-10-26. La API de Places no se usó (sin key). La URL de provenance de esos campos es la URL de la búsqueda de Google usada.
- Links de delivery: se abrió la ficha real en PedidosYa / Rappi / Uber Eats / iFood (o se tomó el link publicado en la web oficial del local) y se guardó la URL final. Si solo aparecía en un resultado de búsqueda sin abrirlo, no se registró.
- Web, Instagram, sucursales: sitio oficial del local cuando fue posible; si no, resultados de Google (dominio / perfil de Instagram).
- **No se mezclan fuentes dentro de un campo**: `rating` y `reviewCount` son siempre de Google (ficha); donde TripAdvisor o Uber Eats mostraban otro valor, está anotado en `provenance.note` y no se usó.
- `status`: `found` (dato hallado), `not_found` (no lo encontré), `absent` (revisé y no existe). `absent` se usó solo para **sitio web propio**: la ficha de Google dice "Agregar sitio web" o su botón apunta a Instagram/Facebook, y no hay dominio en los resultados. **Nunca** se marcó `absent` un listado de delivery: no se pudo verificar dentro de cada app, así que quedan `null` con nota.
- `provenance.note` es un campo opcional agregado al esquema pedido (aclaraciones: dato redondeado por Google, inferencias, homónimos).
- `priceLevel`: mapeo propio a `$/$$/$$$` a partir del "precio por persona" de Google en moneda local (aprox. por el punto medio del rango); la nota de cada campo guarda el rango original.
- Inferencias marcadas en `note`: `locationsCount = 1` cuando solo hay una dirección publicada (Piki, El Federal, Hola El Güero, Casa Salvo); `dineIn = true` cuando la ficha lista opciones de servicio propias de salón.

## Tabla de locales

| id | País | Perfil | Tipo | Rating (Google) | Reseñas (Google) | Web propia | Delivery encontrado | Sucursales |
|---|---|---|---|---|---|---|---|---|
| `ar-pizzeria-las-palmas-lanus` | AR | cadena-chica | pizzería | 4,2 | 5.457 | no (ficha apunta a IG) | PedidosYa | 3 |
| `ar-el-campeon-de-la-pizza-lanus` | AR | pizzeria-delivery | pizzería | 4,2 | 6.167 | no (ficha apunta a Facebook) | PedidosYa, Rappi | n/d |
| `ar-pizzeria-piki-lanus` | AR | mala-presencia | pizzería | 3,7 | 3 | no | ninguno (delivery propio) | 1 (inferido) |
| `ar-bar-el-federal-san-telmo` | AR | bar | bar | 4,4 | 11.911 | sí (barelfederal.com.ar) | Rappi | 1 (inferido) |
| `mx-tacos-hola-el-guero-cdmx` | MX | bien-posicionado | taquería | 4,3 | ~1.600 | no (ficha apunta a IG) | ninguno | 1 (inferido) |
| `mx-reds-burger-shop-zapopan` | MX | cadena-chica | hamburguesería | 4,7 | 4.120 | sí (reds.mx) | Rappi, Uber Eats | 2 |
| `mx-ladina-bar-roma-norte` | MX | bar | bar | 4,6 | 782 | sí (jardinmx.com/ladina) | ninguno | n/d |
| `mx-la-taqueria-del-pueblo-tlahuac` | MX | mala-presencia | taquería | 5,0 | 8 | no | ninguno | n/d |
| `cl-casa-salvo-cafe-providencia` | CL | bien-posicionado | cafetería | 4,9 | 3.117 | sí (casasalvo.cl) | PedidosYa, Uber Eats | 1 (inferido) |
| `cl-davvero-pizzeria-nunoa` | CL | pizzeria-delivery | pizzería | 4,8 | 218 | sí (davveropizzeria.cl) | Rappi, Uber Eats (+ pedido propio) | 1 |
| `co-come-como-en-casa-dark-kitchen-bogota` | CO | dark-kitchen | dark kitchen | n/d | n/d | no encontrada | Rappi | n/d |
| `co-el-social-tienda-mixta-medellin` | CO | bar | bar (de salsa) | 4,5 | 4.016 | sí (elsocial.com.co) | Rappi (+ pedido propio) | n/d (≥2 direcciones) |
| `br-diavola-pizzaria-pinheiros` | BR | cadena-chica | pizzería | 4,8 | 1.247 | sí (diavola.com.br) | iFood (+ app propio) | 2 |

Reparto por país: AR 4 · MX 4 · CL 2 · CO 2 · BR 1. Perfiles: pizzeria-delivery 2, bar 3, cadena-chica 3, dark-kitchen 1, mala-presencia 2, bien-posicionado 2.

## De dónde salió cada dato

| Campo | Fuente típica |
|---|---|
| name, address, businessType, rating, reviewCount, openingHours, priceLevel, takeout, deliveryOffered, dineIn | Ficha de Google en la búsqueda (2026-10-26). Excepciones: la dark kitchen (nombre, dirección, horarios, precio) sale de la ficha de Rappi (datos estructurados de la página); el nombre de Red's sale del sitio oficial |
| website | Botón "Sitio web" de la ficha de Google o dominio oficial en los resultados; `absent` si es Instagram/Facebook o "Agregar sitio web" |
| instagram | Enlace en el sitio oficial, botón "Sitio web" de la ficha, o resultado de Instagram en Google |
| delivery | Ficha real abierta en PedidosYa/Rappi/Uber Eats; iFood desde el sitio oficial de Diavola |
| locationsCount | Sitio oficial (Red's, Davvero, Diavola), bio de Instagram (Las Palmas), o inferencia de dirección única |

## Qué no se encontró (campos mayormente vacíos)

- **Cantidad de sucursales** (`locationsCount`): `not_found` en 5 de 13 (El Campeón, Ladina, Taquería del Pueblo, dark kitchen, El Social). En 4 más es una inferencia de "dirección única".
- **Retiro en local** (`takeout`): `not_found` en 7 de 13; la ficha solo lo informa cuando muestra el botón "Pedir para llevar".
- **Delivery** (`delivery`): `null` en 4 locales (Piki, Hola El Güero, Ladina, Taquería del Pueblo); en todos los demás hay al menos una plataforma abierta y confirmada. Para las plataformas restantes de cada local (por ejemplo DiDi Food) no se verificó dentro de la app: quedan `null`, no `absent`.
- **Consumo en el local** (`dineIn`): `not_found` en 4.
- **Sitio web propio**: `absent` en 5 (Las Palmas, El Campeón, Piki, Hola El Güero, Taquería del Pueblo); `not_found` en la dark kitchen.
- **Instagram**: `not_found` en la dark kitchen y en La Taquería del Pueblo.
- **Horarios**: `not_found` en Piki y La Taquería del Pueblo (la ficha de Google pide "Agregar el horario de atención").
- **Rating y reseñas**: `not_found` solo en la dark kitchen (no tiene ficha de Google detectada; Rappi no los publica). Google Maps es difícil de leer con fetch: se leyó desde navegador y la cifra de reseñas puede venir redondeada (p. ej. Hola El Güero muestra "1,600").

## Advertencias para quien use el snapshot

- Rating y reseñas son de la **sucursal indicada** en `address` (Red's: Tchaikovsky; Diavola: Pinheiros). Las otras sucursales tienen cifras propias.
- Se forzó el país (`gl=`) en cada búsqueda para evitar el sesgo de ubicación del navegador. Si la ficha cambió después del 2026-10-26, el snapshot no lo refleja.
- Casos útiles para el demo: **Piki** (3 reseñas, sin horarios ni web) y **La Taquería del Pueblo** (5,0 con 8 reseñas, sin horarios ni web) para "mala presencia"; **Come como en Casa Dark Kitchen** como solo-delivery sin ficha de Google; **Hola El Güero** como "muy reconocida pero sin web ni delivery" (por eso su perfil `bien-posicionado` es solo de reputación en Google: no tiene web ni delivery, ver `notes`).
