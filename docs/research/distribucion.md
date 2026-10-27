# Distribución: cómo llega el dueño a la herramienta

> **Goal:** G1 · Distribución (A1, instancia d) · **Fecha de captura:** 2026-10-26
> **Pregunta del caso:** "una herramienta sin tráfico no genera clientes, ¿cómo llega el dueño?"
> **Regla:** nada inventado. Todo dato lleva link. Los volúmenes de búsqueda **no están disponibles** (Keyword Planner exige cuenta de Google Ads); se reemplazan por señales verificables y reproducibles.

---

## 0. Cómo leer este documento

**Leyenda de evidencia**

| Marca | Significa |
|---|---|
| ✅ | Leí la página (oficial o primaria) en esta sesión. |
| 🔶 | Fuente secundaria, o resumen de una búsqueda web que no pude abrir. Verificar antes de usar en producción. |
| ⚠ | Contradictorio, desactualizado o no verificado. No usar sin confirmar. |
| `AC` | Señal de **autocompletado** de Google, reproducible con el link de la fila (ver §0.2). |

### 0.1 Qué NO pude ver (declarado)

- **Volumen de búsqueda:** "no disponible" en todas las filas. No hay fuente gratuita accesible sin cuenta. Cuando se pueda, el paso siguiente es Keyword Planner con una cuenta de Google Ads (requiere crear la cuenta; no lo hice).
- **"Más preguntas" (People Also Ask):** Google devuelve una página que exige JavaScript a las consultas automáticas (probé con `curl`, [ejemplo de la respuesta](https://www.google.com/search?q=comision+pedidosya+restaurante&hl=es&gl=ar)). No hay PAA verificado en este documento.
- **Reddit:** la herramienta de búsqueda y de fetch no tiene acceso a `reddit.com` (error "domains not accessible", y `WebFetch` bloqueado). **No se encontraron hilos de Reddit verificados.** Sustituto: autocompletado + notas de prensa y consultoras que responden esas mismas preguntas. Pendiente para un humano: buscar a mano en r/argentina, r/mexico, r/chile, r/Colombia.
- **Ranking real:** la búsqueda web de la herramienta es de EE. UU. y no es un rastreador de posiciones. En §3 reporto **qué dominios aparecen** para cada consulta, no posiciones locales.
- **Autocompletado por país:** uso el parámetro `gl` (país) de [suggestqueries.google.com](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=comision%20pedidosya%20). **No siempre sesga al país** (por ejemplo, para AR devolvió sugerencias de México como "facturar restaurante toks"). Por eso asigno cada keyword a un país por su contenido (ARCA, CFDI, SII, DIAN), no solo por el parámetro.

### 0.2 Cómo reproducir una señal `AC`

```
https://suggestqueries.google.com/complete/search?client=firefox&hl=<es|pt>&gl=<ar|mx|cl|co|br>&q=<semilla>%20
```
Se consultó el 2026-10-26 con semillas cortas y un espacio final. Las semillas largas devuelven vacío; eso también es dato ("sin sugerencias"). Las sugerencias cambian con el tiempo y la ubicación del que consulta.

---

## 1. Keywords por país, agrupadas por intención

**Páginas que las capturan**
- **D** = el diagnóstico (home `/`), la herramienta en sí.
- **B** = artículo del blog (ver los 8 de [`geo-blog.md`](geo-blog.md)).
- **P** = página programática (plantillas en §2).

> Criterio: keywords **específicas del momento del dueño**, no genéricas. Las que parecen de dueño pero son de **cliente** (p. ej. "facturar restaurante toks", un comensal pidiendo su factura) se marcan y se descartan.

### 1.1 Argentina (AR)

| Intención | Keyword | Señal verificable | Volumen | Página |
|---|---|---|---|---|
| Diagnóstico / presencia | cómo aparecer primero en Google Maps restaurante | Guías que compiten: [SE Ranking](https://seranking.com/es/blog/como-aparecer-primero-en-google-maps/), [Qamarero](https://qamarero.com/blog/como-anadir-tu-restaurante-en-google-maps-guia-propietarios/) 🔶. AC de la frase larga: sin sugerencias | no disponible | **B** (Art. 3) + **D** |
| Diagnóstico / presencia | reseñas google restaurante | [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=resenas%20google%20restaurante%20) devuelve "reseñas google restaurante" | no disponible | **D** (área reseñas) |
| Diagnóstico / presencia | carta qr restaurante (gratis) | [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=carta%20qr%20restaurante%20): "crear qr carta restaurante gratis", "carta digital qr restaurante". Fudo ya tiene [Carta QR](https://tools.fu.do/recursos/carta-qr) ✅ | no disponible | **P** / herramienta existente |
| Facturación / fiscal | factura electrónica restaurante ARCA | ARCA incluye a [bares y restaurantes en un régimen especial](https://www.afip.gob.ar/fe/regimenes-especiales/operaciones-credito-fiscal.asp) ✅. AC genérico devuelve sesgo MX ([AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=factura%20electronica%20restaurante%20)) ⚠ | no disponible | **B** (Art. 1) |
| Facturación / fiscal | controlador fiscal restaurante | Mismo régimen especial ✅. AC: sin sugerencias | no disponible | **B** (Art. 1) |
| Facturación / fiscal | monotributo gastronomía | [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=monotributo%20gastronomia%20) devuelve "monotributo gastronomia" | no disponible | **B** (Art. 1) |
| Facturación / fiscal (con fecha) | RG 5893 comprobantes electrónicos 1 de noviembre 2026 | [Novedad ARCA](https://servicioscf.afip.gob.ar/publico/sitio/contenido/novedad/ver.aspx?id=5881) ✅: RG 5893/2026, monotributistas promovidos/sociales y no alcanzados en IVA; inicio 01/11/2026 (general) y 01/03/2027 (no alcanzados en IVA). Es **estacional**: la ventana es ahora | no disponible | **B** (actualización de Art. 1) |
| Delivery / comisiones | comisión PedidosYa | [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=comision%20pedidosya%20): "comisión pedidosya argentina", "pedidosya comision por venta" | no disponible | **B** (Art. 2) + **P** (`/comisiones`) |
| Delivery / comisiones | comisión Rappi restaurante | [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=rappi%20comision%20): "comision rappi argentina", "comision rappi restaurantes" | no disponible | **P** (`/comisiones`) |
| Delivery / comisiones | alternativa a PedidosYa / delivery propio | [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=alternativa%20a%20pedidosya%20): "alternativa a pedidosya"; [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=delivery%20propio%20): "restaurantes con delivery propio" | no disponible | **B** (Art. 2, sección delivery propio) |
| Delivery / alta en apps | abrir restaurante en PedidosYa / Rappi | [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=abrir%20restaurante%20): "abrir restaurante en pedidos ya", "abrir restaurante rappi" | no disponible | **B** (a futuro, fuera de los 8) |
| Switch de sistema | maxirest / bistrosoft (marca + precio / cloud) | [AC-ar maxirest](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=maxirest%20): "maxirest cloud", "maxirest online"; [AC-ar bistrosoft](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=bistrosoft%20): "bistrosoft precio" | no disponible | **P** (`/alternativa`) |
| Switch de sistema | sistema gastronómico (con marca) | [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=sistema%20gastronomico%20): "sistema gastronomico fudo", "sistema gastronomico maxirest" (Fudo ya aparece como sugerencia) | no disponible | **D** + **P** |
| Sistema para segmento | sistema para pizzería (gratis / pos / pedidos) | [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=sistema%20para%20pizzeria%20): "sistema para pizzeria gratis", "sistema pos para pizzeria", "sistema de pedidos para pizzeria". Fudo tiene página de [Pizzerías y Delivery](https://fu.do/es-ar/) ✅ | no disponible | **P** + landing de segmento |
| Abrir un local | cómo abrir un restaurante en Argentina | [AC-ar](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=ar&q=como%20abrir%20un%20restaurante%20en%20argentina%20) devuelve la frase | no disponible | **B** → ruta "por abrir" (Consultor de Nuevos Negocios, [herramienta de Fudo](https://tools.fu.do/recursos/consultor-de-nuevos-negocios) ✅) |

### 1.2 México (MX)

| Intención | Keyword | Señal verificable | Volumen | Página |
|---|---|---|---|---|
| Diagnóstico / presencia | cómo aparecer en Google Maps restaurante | AC sin sugerencias para la frase. Guías: [Tiendanube](https://www.tiendanube.com/blog/como-aparecer-en-google-maps/) 🔶 | no disponible | **B** (Art. 3) + **D** |
| Facturación / fiscal | CFDI restaurante / uso de CFDI restaurante | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=cfdi%20restaurante%20): "cfdi restaurante", "uso de cfdi restaurante" | no disponible | **B** (Art. 4) |
| Facturación / fiscal | propina en CFDI | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=propina%20cfdi%20): "propina en cfdi" | no disponible | **B** (Art. 4) |
| Facturación / fiscal | factura global restaurante | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=factura%20global%20restaurante%20): devuelve la frase | no disponible | **B** (sección de Art. 4) |
| **Descartada (intención de cliente)** | facturar restaurante Toks / Liverpool / El Bajío… | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=facturar%20restaurante%20): son comensales pidiendo su factura a una cadena. **No es el dueño.** Útil solo como idea para un "portal de autofactura" (Fudo ya lo ofrece en [es-mx](https://fu.do/es-mx/) ✅) | no disponible | (no apuntar) |
| Delivery / comisiones | comisión Uber Eats a restaurantes | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=uber%20eats%20comision%20): "uber eats comision a restaurantes", "uber eats cuanto cobra de comision". Dato oficial: [Uber, 13/03/2024](https://www.uber.com/es-MX/newsroom/uber-eats-comisiones-para-pymes-mexico) ✅ | no disponible | **B** (Art. 5) + **P** (`/comisiones`) |
| Delivery / comisiones | comisión DiDi Food | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=didi%20food%20comision%20): "didi food comision a restaurantes", "didi food cobra comision por pagar con tarjeta" | no disponible | **B** (Art. 5) |
| Delivery / comisiones | comisión Rappi restaurante México | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=rappi%20comision%20): "comision rappi restaurante mexico" | no disponible | **B** (Art. 5) |
| Switch de sistema | alternativa a Soft Restaurant | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=alternativa%20a%20soft%20restaurant%20): devuelve la frase exacta | no disponible | **B** (Art. 6) + **P** (`/alternativa`) |
| Switch de sistema | soft restaurant facturación / v11 / v12 / precio | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=soft%20restaurant%20): "soft restaurant facturacion", "soft restaurant v12 facturación", "soft restaurant precio". Intención mixta: soporte de usuarios actuales + switch | no disponible | **B** (Art. 6) |
| Sistema para segmento | punto de venta para taquería (gratis) | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=punto%20de%20venta%20taqueria%20): "punto de venta para taqueria gratis", "mejor punto de venta para taqueria" | no disponible | **P** + landing de segmento |
| Sistema para segmento | sistema punto de venta restaurante (gratis / precio) | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=sistema%20punto%20de%20venta%20restaurante%20) | no disponible | **D** |
| Abrir un local | cómo abrir un restaurante en México | [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=como%20abrir%20un%20restaurante%20en%20mexico%20) | no disponible | **B** → "por abrir" |

### 1.3 Chile (CL)

| Intención | Keyword | Señal verificable | Volumen | Página |
|---|---|---|---|---|
| Facturación / fiscal | boleta electrónica restaurante | [AC-cl](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=cl&q=boleta%20electronica%20restaurante%20) devuelve la frase. Cobertura de prensa: [The Clinic, 27/02/2025](https://www.theclinic.cl/2025/02/27/un-retroceso-y-costo-adicional-la-dura-critica-del-sector-gastronomico-a-la-resolucion-del-sii-que-obliga-a-emitir-boletas-en-restaurantes/) 🔶 | no disponible | **B** (Art. 7) |
| Facturación / fiscal | giro SII restaurante / código SII restaurante | [AC-cl](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=cl&q=sii%20restaurante%20): "giro sii restaurante", "codigo sii restaurante" | no disponible | **B** (a futuro, apertura) |
| Facturación / fiscal | boleta electrónica gratis SII | [Sistema gratuito del SII](https://www.sii.cl/servicios_online/3532-3810.html) 🔶 (existe; inscripción por el contribuyente) | no disponible | **B** (Art. 7) |
| Delivery / comisiones | comisión Uber Eats Chile | [AC-cl](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=cl&q=uber%20eats%20comision%20): "comisión uber eats chile". PedidosYa: sin sugerencia específica de Chile | no disponible | **P** (`/comisiones`) |
| Abrir un local | patente restaurante / resolución sanitaria restaurante | [AC-cl](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=cl&q=patente%20restaurante%20): "patente restaurante clase c", "patente restaurante precio"; [AC-cl](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=cl&q=resolucion%20sanitaria%20restaurante%20): "requisitos resolucion sanitaria restaurante" | no disponible | **B** → "por abrir" |
| Switch de sistema | sistema para restaurante Chile | AC sin sugerencias. Competidores en directorios: [Toteat vs. alternativas (Capterra)](https://www.capterra.cl/alternatives/1030238/toteat) 🔶, [Fundamental POS](https://www.capterra.co.uk/compare/142877/1089165/Restroworks/vs/Fundamental-POS) 🔶 | no disponible | **P** (`/alternativa`) |

### 1.4 Colombia (CO)

| Intención | Keyword | Señal verificable | Volumen | Página |
|---|---|---|---|---|
| Facturación / fiscal | POS electrónico gratuito DIAN / factura POS DIAN | [AC-co](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=co&q=pos%20dian%20): "pos electronico gratuito dian", "documento equivalente pos dian", "resolucion dian pos electronico". Fuente oficial: [DIAN, Documento Equivalente Electrónico](https://micrositios.dian.gov.co/sistema-de-facturacion-electronica/documento-equivalente-electronico/) 🔶 | no disponible | **B** (Art. 8) |
| Facturación / fiscal | impoconsumo restaurantes 2026 | [AC-co](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=co&q=impoconsumo%20): "impoconsumo restaurantes 2026", "impoconsumo cuanto es" | no disponible | **B** (Art. 8) |
| Facturación / fiscal | propina restaurante Colombia (Ley 1935) | [AC-co](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=co&q=propina%20restaurante%20): "propina restaurante colombia". [Siigo sobre Ley 1935](https://www.siigo.com/blog/propina-colombia-ley-1935/) 🔶 | no disponible | **B** (Art. 8) |
| Delivery / comisiones | comisión Rappi Colombia / DiDi Food Colombia | [AC-co](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=co&q=rappi%20comision%20): "comisión rappi colombia"; [AC-mx](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=mx&q=didi%20food%20comision%20): "comision didi food colombia". Contexto: [Publimetro 2023](https://www.publimetro.co/medellin/2023/04/28/restaurantes-crean-la-promocion-ratti-como-protesta-por-excesivas-comisiones-de-rappi/) 🔶 | no disponible | **P** (`/comisiones`) |
| Sistema para segmento | software para restaurantes en Colombia / sistema POS restaurante Colombia | [AC-co](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=co&q=software%20para%20restaurantes%20): "software para restaurantes en colombia", "software para restaurantes gratis colombia" | no disponible | **D** + **P** |
| Abrir un local | cómo abrir un restaurante en Colombia / RUT restaurante | [AC-co](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=co&q=rut%20restaurante%20): "rut restaurante bogota" | no disponible | **B** → "por abrir" |

### 1.5 Brasil (BR) — breve, en portugués

> BR es recorte declarado del caso. La marca de Fudo en BR es otra: el selector de país de fu.do apunta a [deli.com.br](https://deli.com.br/pt-br/) ✅.

| Intenção | Keyword | Sinal verificável | Volume | Página |
|---|---|---|---|---|
| Fiscal | emitir nota fiscal restaurante / NFC-e restaurante / nota fiscal MEI restaurante | [AC-br](https://suggestqueries.google.com/complete/search?client=firefox&hl=pt&gl=br&q=nota%20fiscal%20restaurante%20): "emitir nota fiscal restaurante", "emitir nota fiscal mei restaurante", "sistema nota fiscal restaurante" | não disponível | **B** (futuro) |
| Delivery / comissões | comissão iFood entrega própria / valor flexível / porcentagem | [AC-br](https://suggestqueries.google.com/complete/search?client=firefox&hl=pt&gl=br&q=ifood%20comissao%20): "comissão ifood de entrega própria", "comissão ifood valor flexível", "comissão ifood porcentagem fixa" | não disponível | **P** (`/comissoes`) |
| Sistema p/ segmento | sistema para pizzaria delivery | [AC-br](https://suggestqueries.google.com/complete/search?client=firefox&hl=pt&gl=br&q=sistema%20para%20pizzaria%20): "sistema para pizzaria delivery", "melhor sistema para pizzaria delivery", "sistema para pizzaria gratuito" | não disponível | **P** + landing |
| Troca de sistema | sistema restaurante (Saipos, Colibri…) / PDV restaurante gratuito | [AC-br](https://suggestqueries.google.com/complete/search?client=firefox&hl=pt&gl=br&q=sistema%20restaurante%20): "sistema restaurante saipos", "sistema restaurante colibri" | não disponível | **P** (`/alternativa`) |
| Presença | como fazer meu restaurante aparecer no Google Maps | [AC-br](https://suggestqueries.google.com/complete/search?client=firefox&hl=pt&gl=br&q=como%20aparecer%20no%20google%20maps%20restaurante%20): devolve a frase completa | não disponível | **D** |
| Abrir | abrir pizzaria vale a pena / investimento | [AC-br](https://suggestqueries.google.com/complete/search?client=firefox&hl=pt&gl=br&q=abrir%20pizzaria%20): "abrir pizzaria vale a pena", "abrir pizzaria investimento" | não disponível | **B** → "por abrir" |

### 1.6 Qué captura cada tipo de página (resumen)

| Intención | Página principal | Por qué |
|---|---|---|
| Diagnóstico / presencia | **D** (home) y Art. 3 | La keyword **es** el producto: "cómo estoy en Google". El artículo explica y cierra con "medilo gratis". |
| Facturación / fiscal | **B** (Arts. 1, 4, 7, 8) | Búsqueda de información con riesgo legal; gana quien cita la fuente oficial y la fecha. |
| Delivery / comisiones | **B** (Arts. 2, 5) + **P** `/comisiones` | Sirve una calculadora; el diagnóstico estima "plata que se escapa". |
| Switch de sistema | **B** (Art. 6) + **P** `/alternativa` | Intención comercial alta; ruta "switcher" con CTA de migración. |
| Sistema para segmento | Landing de segmento + **D** | Ya existen páginas de tipo de negocio en fu.do ([ejemplo](https://fu.do/es-ar/) ✅); el diagnóstico se enlaza desde ahí. |
| Abrir un local | **B** → Consultor de Nuevos Negocios | El plan rutea "por abrir" fuera del embudo de pago (PLAN §0). |

---

## 2. Páginas programáticas

### 2.1 El riesgo, con la política de Google

- **Scaled content abuse:** [Google lo define](https://developers.google.com/search/docs/essentials/spam-policies) ✅ como "many pages … generated for the primary purpose of manipulating search rankings"; entre los ejemplos, generar muchas páginas "without adding value for readers".
- **Doorway abuse:** [misma política](https://developers.google.com/search/docs/essentials/spam-policies) ✅: páginas creadas "to rank for specific, similar search queries"; ejemplo: páginas dirigidas a ciudades o regiones que **canalizan al usuario a una sola página**. Una plantilla "/diagnostico/<ciudad>/<tipo>" que solo cambia el nombre de la ciudad cae justo ahí.
- La [guía de Google sobre funciones de IA](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) ✅ (actualizada 2026-07-10) insiste en contenido "non-commodity" (original, de primera mano) y advierte contra producir páginas en masa para variantes de consulta.

### 2.2 Reglas para no caer en contenido delgado

1. **Cada página tiene datos únicos que la hacen distinta**, no solo el nombre. Si no hay un dato propio o una fuente oficial distinta, **no se genera**.
2. **Umbral mínimo de datos:** una plantilla solo se publica si supera un mínimo (propuesta: ≥30 locales analizados por celda de ciudad × tipo). Por debajo: `noindex` y fuera del sitemap. El umbral es una propuesta a calibrar, no un dato.
3. **Respuesta propia del producto:** cada página incluye una **calculadora o un diagnóstico** interactivo, no solo texto.
4. **Fuente y fecha por página:** link a la fuente oficial y "verificado el dd/mm/aaaa".
5. **Revisión humana de una muestra** antes de publicar cada lote; despliegue por lotes pequeños y vigilar indexación en Search Console ("Detectada, actualmente sin indexar" es la alarma).
6. **Estructura que varía por país** (no un texto con variables reemplazadas): los hechos fiscales son distintos en ARCA, SAT, SII, DIAN.
7. **Sin links en cascada hacia una sola página**: cada página enlaza a su pilar y a hermanas relevantes, no a un embudo único.

### 2.3 Plantillas propuestas (con conteo honesto)

> Los conteos de abajo son **aritmética de escenarios con supuestos declarados**, no datos de mercado. Ninguna cifra de volumen de búsqueda respalda estas estimaciones.

| # | Plantilla | Ejemplo | Dato único por página | Páginas posibles | Riesgo | Recomendación |
|---|---|---|---|---|---|---|
| **T1** | `/comisiones/<app>/<país>` | `/comisiones/uber-eats/mx` | Tabla oficial de planes (si existe), fecha, **calculadora** con las ventas del dueño | AR: PedidosYa, Rappi · MX: Uber Eats, DiDi Food, Rappi · CL: PedidosYa, Uber Eats, Rappi · CO: Rappi, DiDi Food · BR: iFood, Rappi → **≈12–14** | **Bajo–medio.** Solo publicar donde exista dato oficial; si no, la página dice "no publicada" y enseña el método | **Prioridad 1.** Dato oficial hoy: solo [Uber Eats MX](https://www.uber.com/es-MX/newsroom/uber-eats-comisiones-para-pymes-mexico) ✅. En AR no hallé tabla oficial; los rangos publicados son secundarios (ver Art. 2 de `geo-blog.md`) |
| **T2** | `/facturacion/<país>/<tipo>` | `/facturacion/mx/pizzeria` | Reglas del país + particularidades del tipo (propina, delivery, factura global) | 5 países × 5 tipos = 25 **teóricas**; solo se justifican las que difieren de verdad | **Alto** si se multiplica por tipo sin diferencia real (casi duplicadas) | **Prioridad 2, con poda:** 1 pilar por país (5) + 8–12 páginas específicas (propinas, factura global, boleta impresa, impoconsumo, documento equivalente POS). **≈13–17** |
| **T3** | `/alternativa/<sistema>/<país>` | `/alternativa/soft-restaurant/mx` | Checklist de **migración** (qué se mueve y qué hay que preguntar), no comparación de marketing | MX: Soft Restaurant, Wansoft · AR: Maxirest, Bistrosoft · CL: Toteat · CO: Loggro, Siigo · BR: Saipos → **≈8–10** | **Medio:** afirmaciones comparativas y marcas ajenas. Solo hechos verificables y con fecha | **Prioridad 2.** Hay precedente de competidores que ya publican "alternativa gratuita a Fudo/Soft Restaurant/Wansoft" ([Meniu](https://meniuapp.com/en/blog/alternativa-gratuita-soft-restaurant-software-restaurantes) 🔶) |
| **T4** | `/diagnostico/<país>/<ciudad>/<tipo>` | "Pizzerías en Lanús: cómo están en Google" | **Datos agregados** de locales de esa celda (nota promedio, % con web, % con horarios, etc.) | Escenario: 4 países hispanos × 10 ciudades × 5 tipos = 200 celdas candidatas; con umbral ≥30 locales y datos válidos, **supuesto 20–40% pasan = 40–80**. Con el snapshot actual (12–15 locales en total) **salen 0** | **Muy alto**: es la plantilla clásica de doorway/scaled. Además hay un **bloqueo de datos** (ver 2.4) | **Prioridad 3 / no lanzar hasta resolver datos.** Empezar por 5–10 celdas con redacción editorial |

**Total realista de fase 1 (T1+T2+T3): ≈33–41 páginas** curadas, más los 8 artículos. T4 queda como hipótesis.

### 2.4 Bloqueo de datos para T4 (importante)

La política de Google Places dice que **no se debe pre-buscar, cachear ni almacenar** contenido de la Places API salvo excepciones, y que el **place ID** está exento ([Places API policies](https://developers.google.com/maps/documentation/places/web-service/policies) ✅). Por eso:
- No se puede armar un "censo" de locales con datos de Places guardados para publicarlo en páginas.
- Alternativas viables (a validar con legal): (a) agregados **propios** a partir de diagnósticos de usuarios con consentimiento, (b) datos propios de Fudo (clientes, con consentimiento), (c) fuentes con licencia que lo permitan.
- El detalle de ToS y costos lo cubren `datos.md` y `costos.md` (otras instancias de A1). No lo repito.

### 2.5 Dato de contexto: la competencia en contenido (Fudo)

La primera página de [blog.fu.do](https://blog.fu.do/) ✅ (10 artículos, el último del 26/10/2026) tiene series de **precios por plato y provincia** y medios de pago, pero **no muestra** artículos sobre ARCA, CFDI, SII, DIAN, comisiones de delivery ni Google Maps. Solo vi la primera página del listado (las páginas 2 a 5 no las leí), así que no es una afirmación sobre todo el blog. Existen recursos gratuitos relacionados en [tools.fu.do](https://tools.fu.do/recursos) ✅: "Tu Especialista en Google", "Guía para mejorar el posicionamiento de tu restaurante en Google", "Calculadora de comisiones para terminales". Hay **hueco editorial** y activos que reutilizar.

---

## 3. Competencia SEO: qué aparece hoy

> **Método:** 6 consultas con la herramienta de búsqueda web, el 2026-10-26. **Es una búsqueda de EE. UU. y no equivale al ranking local.** Reporto dominios en el orden en que los devolvió. No hay datos de tráfico. Para posiciones reales hay que medir con Search Console (propio) o una herramienta de rank-tracking (no usada).

| # | Consulta | Dominios que aparecieron | ¿Aparece Fudo o un POS de restaurantes? | Lectura |
|---|---|---|---|---|
| 1 | comisión PedidosYa restaurante porcentaje 2026 | [developargentina.com](https://developargentina.com/blog/app-delivery-propia-vs-rappi-argentina-2026), conclusion.com.ar, santafe.gob.ar, elfinancierocr.com, elmostrador.cl, anbariloche.com.ar, iprofesional.com | **No** | Lo dominan medios y un estudio de software a medida. **Nadie publica una tabla oficial**: el hueco es "método + calculadora + fuente fechada" |
| 2 | cómo aparecer primero en Google Maps restaurante ficha de negocio | loading.es, [seranking.com](https://seranking.com/es/blog/como-aparecer-primero-en-google-maps/), [qamarero.com](https://qamarero.com/blog/como-anadir-tu-restaurante-en-google-maps-guia-propietarios/) (x2), xataka.com.co, godaddy.com, [tiendanube.com](https://www.tiendanube.com/blog/como-aparecer-en-google-maps/), emprendedor.com, crehana.com | **Qamarero** (blog de una empresa del rubro hostelería) sí. Fudo **no** apareció | Competidor directo de contenido: Qamarero. La respuesta oficial está en la [ayuda de Google Business Profile](https://support.google.com/business/answer/7091?hl=es-419) ✅, que casi nadie cita como fuente primaria |
| 3 | CFDI 4.0 restaurante propinas cómo facturar | [edifact.com.mx](https://www.edifact.com.mx/blog/facturacion-electronica-para-negocios-de-comida-rapida-en-mexico/) (x3), facturama.mx, tiendanube.com, shopify (CFDI Express), dolarapp.com | **Ningún POS de restaurantes** | Dominan facturadores genéricos. Fuera de esa búsqueda, aparecen también [Praxium](https://praxiumconsultores.com/blog/propinas-en-restaurante-iva-isr-y-como-registrarlas) y el [blog de Mercado Pago MX](https://www.mercadopago.com.mx/blog/propinas-fiscalidad-mexico-declarar-ingreso) 🔶 para propinas |
| 4 | alternativa a Soft Restaurant México | capterra.es (Avero Slingshot), comparasoftware.com, itsitio.com (National Soft), verdictfoodservice.com | **No**. En otra consulta apareció [Meniu](https://meniuapp.com/en/blog/alternativa-gratuita-soft-restaurant-software-restaurantes) con "alternativa gratuita a Soft Restaurant/Fudo/Wansoft" | La consulta casi no tiene respuesta útil: **hueco claro** para un contenido de migración |
| 5 | boleta electrónica SII restaurante propina obligatoriedad | theclinic.cl, [ccs.cl (PDF)](https://www.ccs.cl/wp-content/uploads/2025/06/Emision-FE-Supermercado-y-Restaurantes-y-Emision-impresa-BE.pdf), cnc.cl, meganoticias.cl, emol.com, latercera.com, libredte.cl | **No** | Medios y cámaras. Ningún proveedor de software explica el cumplimiento desde la óptica del dueño de restaurante |
| 6 | sistema para restaurantes Argentina facturación electrónica ARCA software gastronómico | [developargentina.com (25/06/2026)](https://www.developargentina.com/blog/software-para-restaurantes-argentina-2026), cloudbeds.com, capterra (bcnsoft), invopop | **No.** La comparativa de Develop Argentina ✅ lista Restoo, Sispyme Gastro, Liveware POS, Zettle, Bsale y "a medida"; **no incluye Fudo, Maxirest, Bistrosoft, Poster ni Menta** | Las "comparativas" locales ignoran a los líderes. Oportunidad de aparecer como referencia, siempre con datos verificables |

Observaciones adicionales (misma sesión):
- **Colombia:** el contenido fiscal de POS para restaurantes está dominado por el blog de [Siigo](https://www.siigo.com/blog/empezar-facturar-electronica-restaurantes-bares) 🔶 (varias entradas) y, en menor medida, Vendty, Defontana y Gestiopolis. Hay una comparativa de Klikit que [menciona a Fudo](https://klikit.io/en/learn/best-restaurant-pos-colombia-2026) 🔶 (como opción para domicilios).
- **México:** [Comparasoftware](https://www.comparasoftware.com/software-para-restaurantes) 🔶 y Meniu dominan las comparativas de software.
- **Chile:** directorios (Capterra, CB Insights); sin contenido propio de proveedores sobre boleta electrónica en lo que vi.

**Conclusión de competencia:** en las 6 consultas elegidas **Fudo no aparece**, y los resultados son medios generalistas, facturadores genéricos o consultoras. No es un mercado saturado por SaaS gastronómicos en estas keywords; sí hay competidores de contenido concretos (Qamarero, Siigo, Edifact, Meniu).

---

## 4. Alianzas

> Qué le da la herramienta a cada aliado: **(a)** diagnóstico embebible con marca compartida, **(b)** informe agregado de sus asociados (solo con consentimiento y mínimo de N para no re-identificar), **(c)** un link con `?ref=<aliado>`.

### 4.1 Cámaras gastronómicas

| País | Entidad | Link | Qué hay verificado | Qué le ofrece la herramienta | Riesgo / duda |
|---|---|---|---|---|---|
| AR | **FEHGRA** | [fehgra.org.ar](http://www.fehgra.org.ar) 🔶 (dominio por [ficha UN Tourism](https://www.unwto.org/content/federacion-empresaria-hotelera-gastronomica-de-la-republica-argentina-fehgra); no pude abrirlo) | Desde 1941; 63 filiales 🔶. Tuvo un rol en acuerdos de topes de comisión con apps de delivery (2020–21) 🔶 ([nota](https://www.baenegocios.com/amp/Pedidos-Ya-debera-bajar-sus-comisiones-para-pizzerias-heladerias-y-franquicias-20210302-0092/)) | Diagnóstico con marca para filiales; calculadora de comisiones para sus socios | Afiliación descentralizada por filial |
| AR | **AHRCC** (CABA) | [ahrcc.org.ar](http://www.ahrcc.org.ar) 🔶 ([ficha UN Tourism](https://unwto.org/content/asociacion-de-hoteles-restaurante-confiterias-y-cafes-ahrcc); el dominio varía según la fuente ⚠) | Fundada en 1905 🔶 | Informe de "presencia online del sector en CABA" (agregado) | Dominio sin confirmar |
| MX | **CANIRAC** | Sin dominio oficial confirmado en esta sesión ⚠. Hay delegaciones locales con **vicepresidencia de afiliación** ([El Imparcial Tijuana, 02/2026](https://www.elimparcial.com/tij/tijuana/2026/02/13/rebeca-aguilar-asume-presidencia-de-canirac-tijuana-con-el-respaldo-unanime-del-sector/)) 🔶 | La afiliación se gestiona **por delegación** | Piloto en 1–2 delegaciones, no a nivel nacional | Estructura federada: negociar delegación por delegación |
| CL | **Achiga** | [achiga.cl](https://www.achiga.cl/memorias/Memoria2025.pdf) 🔶 (memoria 2025) | Fundada en 1980; más de 4.500 puntos de venta 🔶. Criticó la resolución del SII de boleta impresa ([The Clinic](https://www.theclinic.cl/2025/02/27/un-retroceso-y-costo-adicional-la-dura-critica-del-sector-gastronomico-a-la-resolucion-del-sii-que-obliga-a-emitir-boletas-en-restaurantes/)) 🔶 | Contenido de cumplimiento (Art. 7) y diagnóstico para socios | El cumplimiento es tema sensible para la entidad |
| CO | **ACODRES** | [acodres.com.co](https://www.acodres.com.co/) 🔶 (por [UN Tourism](https://www.untourism.int/affiliate-member-organization/708013); no abrí el sitio) | Representa y defiende a los afiliados; reportes de transición interna ([Blu Radio](https://www.bluradio.com/noticias/acodres)) 🔶 | Informe de presencia online del sector | Posible inestabilidad institucional (una sola fuente) |
| BR | **Abrasel** | [abrasel.com.br](https://abrasel.com.br) 🔶 | En 2025 lanzó el **Plano Nacional de Restauração** con Ambev, Coca-Cola, **Google**, Rappi y Stone como primeras parceiras ([Mercado & Consumo, 06/05/2025](https://mercadoeconsumo.com.br/06/05/2025/foodservice/abrasel-lanca-projeto-para-apoiar-os-negocios-do-foodservice-em-parceria-com-grandes-empresas/)) 🔶 | Precedente de que la entidad acepta aliados privados; el diagnóstico encaja con el eje de "ferramentas de gestão" | BR es recorte del caso; solo para roadmap |

### 4.2 Contadores y estudios contables

El contador es el **canal natural** para las keywords fiscales: quienes hoy responden esas búsquedas son consultoras ([Praxium MX](https://praxiumconsultores.com/blog/factura-de-restaurante-requisitos-del-cfdi-para-que-el-cliente-deduzca) 🔶, [Contablix AR](https://contablix.ar/blog/factura-electronica-argentina-2026) 🔶) y el dueño les pregunta a ellos primero.

| Qué se ofrece | Cómo |
|---|---|
| Link "para tus clientes gastronómicos": diagnóstico + guía fiscal del país con la fuente oficial | `?ref=contador-<id>`; el informe resume la situación de facturación del local y se puede **reenviar al contador** (loop de §5) |
| Contenido co-firmado (contador revisa el Art. 1/4/7/8) | Aumenta confianza (autor con matrícula) y da backlink natural |
| Colegios profesionales (consejos/colegios de contadores) | Canal de difusión de las guías; **no verifiqué sitios ni contactos** de FACPCE (AR), IMCP (MX), Colegio de Contadores (CL), Junta Central de Contadores (CO) en esta sesión |

### 4.3 Proveedores de hardware

| Aliado | País | Evidencia | Oferta |
|---|---|---|---|
| Hasar, Epson (impresoras/cajas fiscales homologadas) | AR | Homologaciones en el Boletín Oficial: [RG 5706/2025 (Hasar)](https://www.boletinoficial.gob.ar/detalleAviso/primera/326370/20250603) 🔶; Epson aparece en [RG 4528/19](https://consejosalta.org.ar/wp-content/uploads/AFIP-4528.pdf) 🔶 | QR en caja/manual de instalación: "chequeá tu presencia online". Hay que confirmar vigencia de homologaciones |
| Terminales de cobro | LATAM | Fudo ya comercializa terminal propia con Geopagos en Chile ([Chocale](https://chocale.cl/2024/10/terminal-fudo-pos-gestion-y-pagos-restaurantes-y-bares/)) 🔶 | Interno: el diagnóstico puede recomendar "Tus Cobros" |

### 4.4 Bancos y fintech

| Aliado | Evidencia | Oferta | Duda |
|---|---|---|---|
| **Mercado Pago** (AR/MX/CL/BR) | [Partner Program](https://www.mercadopago.com.ar/developers/pt/news/2023/11/27/If-you-are-an-agency-or-platform--this-message-is-for-you) 🔶 (agencias y plataformas; postulación por formulario); tiene [servidor MCP oficial](https://www.mercadopago.com.ar/developers/en/docs/mcp-server/overview) ✅ | Integración como "plataforma" y co-marketing; ver §mcp.md | No hallé términos para software de gestión |
| **Clip** (MX) | [Clip Pin Pad / Clip Empresas](https://www.payclip.com/press-releases-list/clip-introduces-pin-pad-fixed-terminal-for-high-volume-businesses) 🔶 integra con el POS del negocio | Contenido de comisiones de terminal + diagnóstico | No encontré lista oficial de integradores |
| **Geopagos** | Ver 4.3 | — | — |

### 4.5 Plataformas de delivery

No son aliados (el diagnóstico las cuestiona), pero sí son una fuente de datos oficial para T1. No encontré integraciones oficiales de Rappi, PedidosYa o iFood con asistentes de IA (ver `mcp.md`).

---

## 5. Herramienta compartible y loops

**Principio:** cada diagnóstico completo produce algo que el dueño tiene motivos para mostrar a otro (socio, contador, empleado).

| Loop | Mecánica | Para qué | Riesgos |
|---|---|---|---|
| **Informe con URL pública** | `/r/<id-no-adivinable>` con nota por área, recomendaciones y fecha. Por defecto `noindex` y solo accesible con el link; el dueño elige hacerlo público. Imagen OG dinámica con la nota | Compartir por WhatsApp con socio/contador; cada vista externa es un nuevo visitante | Privacidad: mostrar solo datos públicos del local + respuestas que el dueño decide exponer. La estimación de "plata que se escapa" no debería ser pública por defecto |
| **Comparativa con locales de la zona** | "Estás por encima del X% de las pizzerías de tu zona" | Gamificación y motivo para volver | **Arranque en frío:** no hay base propia al inicio. Con Places no se puede almacenar el censo (§2.4). Mostrar la comparativa solo con N ≥ umbral propio y datos agregados, con aviso "simulado" en la demo |
| **Badge embebible** | "Presencia online evaluada por Fudo · 78/100 · oct-2026", con fecha y link al informe | Dueño lo pega en su web/Instagram; vuelve tráfico | **Link spam:** Google lista como ejemplo de spam los links "keyword-rich, hidden, or low-quality … embedded in widgets that are distributed across various sites" ([spam policies](https://developers.google.com/search/docs/essentials/spam-policies) ✅). Usar `rel="nofollow"` (o `sponsored`) y anchor de marca, no de keyword. Un badge sin verificación se vuelve vanidad: debe caducar y mostrar la fecha |
| **"Mandáselo a tu contador"** | Botón que envía el resumen fiscal (facturación) por mail/WhatsApp | Activa el canal contador (§4.2) | Mensaje prearmado, sin datos sensibles |
| **Re-diagnóstico** | Aviso a 30/60 días ("¿mejoró tu nota?") | Retención de los "nutrir" | Requiere email opt-in |

**Métricas del loop** (a sumar a los eventos del PLAN §2-G2): `report_shared{canal}`, `report_viewed_external`, `diag_start_from_report`, `badge_click`. Un número útil: diagnósticos nuevos generados por cada diagnóstico completado (k-factor); con muestra chica no hay que sobreinterpretarlo.

---

## 6. Pauta solo para validar

**Qué NO es:** una vía de adquisición a escala. El caso parte de CAC de pauta ≈ USD 200 y ticket USD 50 (PLAN §0), así que la pauta se usa para **medir**, no para crecer.

### 6.1 Qué se valida

| Pregunta | Prueba |
|---|---|
| ¿Qué promesa hace empezar el diagnóstico? | 3 variantes de titular: "tu nota en Google", "cuánta plata se te escapa", "tu comisión real de PedidosYa" |
| ¿Qué intención convierte mejor? | Búsqueda con keywords de §1 (comisión / fiscal / "sistema para pizzería") vs. social |
| ¿Funciona por país y segmento? | Un grupo de anuncios por país × tipo (núcleo: pizzería/bar/restaurante con delivery) |
| ¿Cuánto cuesta un diagnóstico completado y un "caliente"? | Eventos `diag_start`, `result_viewed`, `lead_tier`, `cta_click` |

### 6.2 Cómo

- **Presupuesto:** tope de primera ronda propuesto = **1 CAC de referencia (USD 200) por país-segmento**, o sea USD 800–1.000 para 4 países hispanos. Es un tope de pérdida acordado, no una predicción. Fórmula de duración: `visitas necesarias ÷ clics diarios`, donde el CPC real **no está disponible** hasta lanzar 2 días de prueba (no hay fuente gratuita para estimarlo).
- **Tamaño mínimo:** para estimar una tasa de inicio de diagnóstico de ≈20% con ±5 pp de margen (95%) hacen falta ≈246 visitas por celda (`1,96²·p(1−p)/e²`). Con menos, la prueba solo ordena hipótesis.
- **UTM estándar:** `utm_source=google|meta` · `utm_medium=cpc` · `utm_campaign=validacion-<pais>-<grupo>` · `utm_content=<hook>`.
- **Qué medir, en orden:** CTR → tasa de `diag_start` → tasa de completar las 4 preguntas → % `lead_tier=caliente|switcher` → `cta_click`. En la demo la cuenta es **simulada**, así que "cuenta creada" solo existirá en producción.
- **Criterio de corte (se fija antes):** matar una celda si, con ≥ el tamaño mínimo, el costo proyectado por cuenta (costo por diagnóstico ÷ tasa de cuenta observada) supera el CAC de referencia. El criterio es relativo, no inventa un CPC.
- **Mala práctica a evitar:** pagar tráfico a páginas programáticas finas; mandar la pauta siempre al diagnóstico o a un artículo con contenido propio.

### 6.3 Qué NO se concluye de la pauta

- No se concluye volumen orgánico (la pauta no lo mide).
- No se concluye cuenta→pago: eso es el experimento del PLAN (≈680 cuentas por brazo), que corre en producción.

---

## 7. Resumen ejecutivo

1. **Camino principal sin pauta:** 8 artículos que responden preguntas de dueños con fuente oficial y fecha + ≈33–41 páginas programáticas curadas (comisiones, facturación, alternativas) + el diagnóstico como CTA.
2. **Hueco de competencia:** en las 6 consultas elegidas no aparece Fudo ni otro POS gastronómico; compiten medios, facturadores genéricos y Qamarero/Siigo/Edifact/Meniu.
3. **Riesgo central:** páginas por ciudad (T4) = doorway/scaled content y además chocan con las políticas de caché de Places. No lanzar hasta tener datos propios.
4. **Canales de alianza con mejor encaje:** contadores (keywords fiscales) y cámaras (fiscal/comisiones). Abrasel ya tiene precedente con Google, Rappi y Stone.
5. **Pauta:** solo para validar promesa/segmento, con tope de USD 200 por país-segmento y criterio de corte relativo al CAC.
6. **Pendiente humano:** volúmenes (Keyword Planner), Reddit/foros, confirmar dominios de CANIRAC y colegios de contadores, y calibrar el umbral de T4.
