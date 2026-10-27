# Herramientas y módulos existentes de Fudo

Fecha de captura: **2026-10-26**. Salvo que se indique lo contrario, solo miré las páginas públicas: **no envié ningún formulario, no subí archivos ni ingresé datos** en las herramientas. Por eso, lo que "devuelve" cada una sale de lo que la propia página promete (con ejemplos ilustrativos), no de un resultado real que yo haya generado.

## 1. Cómo está armado el ecosistema

- Hub: **https://tools.fu.do/recursos** ("Recursos gratis": herramientas IA + biblioteca de descargables). Listado de 9 agentes IA y 25 recursos descargables.
- Cada agente tiene una **ficha** en `tools.fu.do/recursos/<slug>` y una **app** en otra ruta de `tools.fu.do` (o en `sitios.fu.do`). La ficha trae un botón "Usar gratis" que abre la app en una pestaña nueva ("sin instalación ni configuración previa", FAQ del hub).
- Observación del código público (no es una declaración de Fudo): el HTML de la app del Especialista en Google trae un redirect de `*.lovable.app` hacia `tools.fu.do` y su bundle incluye el cliente de Supabase; es decir, parecen apps hechas con Lovable. No revisé el resto.
- FAQ del hub (https://tools.fu.do/recursos): "Todos los agentes de IA y los recursos de esta biblioteca son gratuitos. Solo te pedimos nombre y correo para enviarte el acceso". Y a la pregunta "¿Necesito tener Fudo para usarlos?" responde que no: los recursos son independientes.
  - **Inconsistencia a tener en cuenta:** el hub dice que piden nombre y correo, pero las páginas de Fudo Snap y Tu Diseñador IA dicen "sin registro". No verifiqué cuál aplica en cada caso porque habría que enviar datos.
- Las herramientas comparten la marca de fu.do: Barlow, naranja `#FF5023` y azul `#3937FF` (ver `docs/research/brand.md`).

## 2. Herramientas, una por una

### 2.1 Tu Especialista en Google
- **Ficha:** https://tools.fu.do/recursos/tu-especialista-en-google · **App:** https://tools.fu.do/perfil-de-google
- **Qué hace:** analiza la presencia del local en Google Maps y entrega un diagnóstico con textos ya redactados. Título de la app: "Mejora la presencia de tu restaurante en Google" / "Empleado virtual de crecimiento".
- **Qué pide:** el **link del restaurante en Google Maps** (se busca el local, se toca "Compartir" y se pega el link). "Detectamos automáticamente tu país."
- **Qué devuelve (según la página; el ejemplo es ilustrativo, "La Buona Pasta"):** un **score de presencia sobre 100** (ejemplo 62/100) con chequeos de descripción del local, fotos actualizadas, horarios completos y reseñas respondidas; prioridades "qué hacer primero y por qué"; entregables listos: descripción, publicación de Google y respuestas a reseñas redactadas. Promete "menos de un minuto".
- **Datos que usa:** "Leemos datos públicos de Google Maps. No accedemos a tu cuenta. No prometemos aparecer primero."
- **¿Pide crear cuenta?** La página no lo menciona; no verifiqué el paso del resultado.

### 2.2 Tu Analista de Reseñas
- **Ficha:** https://tools.fu.do/recursos/tu-analista-de-resenas · **App:** https://tools.fu.do/analizar-resenas (la interfaz se carga dentro de un iframe: `https://tools.fu.do/analizar-resenas/api/auditor`)
- **Qué hace:** lee las reseñas de Google y dice qué aman los clientes, de qué se quejan y qué mejorar primero. "En 60 segundos."
- **Qué pide:**
  - Opción A: buscar el restaurante (buscador de negocios) y "Analizar mis reseñas".
  - Opción B ("¿No encuentras tu negocio? Cargar reseñas manualmente"): paso 1 de 2 con nombre del negocio, tipo (Restaurante, Bar, Café, Parrilla, Pizzería, Comida rápida, Otro), ciudad o zona y link para dejar reseña en Google (opcional); paso 2 de 2 con las reseñas por **Google Takeout** (ZIP/JSON, "método oficial, ~5 minutos"), **capturas** (hasta 5 imágenes), **texto pegado** o CSV.
- **Qué devuelve:** score global de reputación **/100** con análisis por dimensión (ejemplo: comida 92, servicio 74, tiempos 52, ambiente 85; también precio), temas que se repiten en reseñas positivas y negativas con citas reales, **plan de acción priorizado**; botones "Exportar PDF", "Compartir" y "Nuevo análisis". Guarda el último análisis en el navegador ("Tenemos guardado tu último análisis").
- **¿Pide crear cuenta?** No aparece en el flujo de entrada.

### 2.3 Fudo Sitios
- **Ficha:** https://tools.fu.do/recursos/fudo-sitios · **App:** https://sitios.fu.do/
- **Qué hace:** crea la web del restaurante "en minutos", gratis. Tres diseños listos (Elegante, Minimalista, Amigable), colores, tipografía, galería, ubicación y sucursales, botón de WhatsApp, y "estadísticas reales" de visitas y clicks. URL propia: `sitios.fu.do/s/tu-nombre`.
- **Qué pide:** elegir diseño, cargar fotos, horarios y sucursales, y publicar.
- **Qué devuelve:** un sitio publicado. "El menú completo con pedidos es opcional (pack Tienda Online)."
- **¿Pide crear cuenta?** La página tiene "Iniciar sesión", "¿Ya tenés web con Fudo?" y un módulo `auth-middleware` en el código, por lo que **es muy probable que pida cuenta para publicar** (inferido; no probé el registro). "Sin tarjeta de crédito."

### 2.4 Carta QR (es la "carga asistida de carta")
- **Ficha:** https://tools.fu.do/recursos/carta-qr · **App:** https://tools.fu.do/carta-qr
- **Nota de nombre:** no existe en el hub una herramienta llamada literalmente "Carga asistida de carta". La que cumple esa función es **Carta QR**: "Sube una foto o PDF de tu menú y en segundos te generamos tu carta digital con QR". El paso 2 del flujo es "La IA lee tu menú".
- **Qué pide:** una foto o PDF de la carta (JPG, PNG o PDF; arrastrar o elegir archivo).
- **Qué devuelve:** una carta digital navegable (categorías, productos, precios) con **QR y link para imprimir/compartir** en redes, WhatsApp o mesas. "Lista en 30 segundos." Hay un "Ver ejemplo de carta".
- **¿Pide crear cuenta?** No lo dice. Muestra "+30.000 negocios activos" como prueba social.
- **Otras vías de carga que existen en el producto (no son agentes del hub):** importar productos desde Excel (https://soporte.fu.do/es/articles/11730891-1-1-importar-productos-excel), cargar productos a mano (https://soporte.fu.do/es/articles/11712759-cargar-productos). En la tabla de planes figura "Carga de facturas por foto" (no incluida en los planes publicados que revisé).

### 2.5 Tu Experto en Menú
- **Ficha:** https://tools.fu.do/recursos/tu-experto-en-menu · **App:** https://tools.fu.do/optimizar-menu ("Ingeniería de menú")
- **Qué pide:** dos caminos: "Tengo Tienda Fudo" (pegar la URL de la tienda, que empieza con `menu.fu.do`) o "Subo mi carta".
- **Qué devuelve (ejemplo ilustrativo en la página):** puntaje de la tienda /100 (ejemplo 72) con subpuntajes de títulos de productos, descripciones completas, orden de categorías, fotos y presentación, combos y adicionales; títulos optimizados producto por producto; descripciones listas para pegar; orden sugerido; huecos de la carta.
- **¿Pide crear cuenta?** Si no tenés tienda en Fudo, ofrece subir la carta o crear una cuenta.

### 2.6 Fudo Snap
- **Ficha:** https://tools.fu.do/recursos/fudo-snap · **App:** https://tools.fu.do/mejorar-fotos
- **Qué hace:** convierte una foto casera de un plato en una imagen profesional con IA (ajusta iluminación, fondo, vajilla, tamaño y estilo). También "Crear imagen desde cero".
- **Qué pide:** una foto del plato. **Devuelve:** la imagen mejorada, con comparador antes/después. "30 segundos, gratis y sin registro."

### 2.7 Tu Diseñador IA ("Fudo Diseños")
- **Ficha:** https://tools.fu.do/recursos/tu-disenador-ia · **App:** https://tools.fu.do/disenos-para-redes
- **Qué pide:** la URL de la tienda en Fudo (`menu.fu.do`) o cargar todo manualmente. **Devuelve:** placas listas para WhatsApp, Instagram y stories (posts, cupones) para llevar gente a la tienda online. "Sin registro · Sin instalación · Tus datos quedan en tu navegador."

### 2.8 Consultor de Nuevos Negocios
- **Ficha:** https://tools.fu.do/recursos/consultor-de-nuevos-negocios · **App:** https://tools.fu.do/abrir-un-restaurante
- **Qué pide:** 3 pasos cortos: tipo de propuesta, dirección y a quién le vendés. "Toma 2 minutos, 100% gratis, sin tarjeta de crédito."
- **Qué devuelve:** 5 análisis con IA (identidad de marca, análisis de competidores, arquitectura de carta, planificador de compras, plan de redes de 4 semanas) más una guía de trámites y habilitaciones según la ubicación; descargables en PDF.
- **Rol en nuestro flujo:** destino del tier "por abrir".

### 2.9 Planificador de Equipamiento IA
- **Ficha:** https://tools.fu.do/recursos/tu-planificador-de-equipamiento-ia · **App:** https://tools.fu.do/equipamiento-gastronomico
- **Qué pide:** país, rubro, tamaño y presupuesto (3 min); opcionalmente el plano del local. **Devuelve:** lista priorizada (imprescindible, recomendado, a futuro), checklist imprimible, ubicación sugerida y acceso a la tienda de hardware de Fudo de cada país.

### 2.10 Biblioteca de descargables (25 recursos)
- https://tools.fu.do/recursos. Checklists, plantillas, calculadoras y guías en PDF/Excel. **Pide nombre y correo** (FAQ del hub). Los más útiles para un diagnóstico de presencia online:
  - Guía para mejorar el posicionamiento de tu restaurante en Google: https://tools.fu.do/recursos/guia-para-mejorar-el-posicionamiento-de-tu-restaurante-en-google
  - Instagram para restaurantes: https://tools.fu.do/recursos/instagram-para-restaurantes-recomendaciones-practicas-para-atraer-mas-clientes
  - Guía para fotos irresistibles de tus productos: https://tools.fu.do/recursos/guia-para-fotos-irresistibles-de-tus-productos
  - Buenas prácticas en redes sociales: https://tools.fu.do/recursos/buenas-practicas-en-redes-sociales-para-tu-negocio-gastronomico
  - Calculadora de comisiones para terminales: https://tools.fu.do/recursos/calculadora-de-comisiones-para-terminales
  - Analizador de rentabilidad (Menu Check): https://tools.fu.do/recursos/analizador-de-rentabilidad-gastronomica-menu-check
  - Plantilla de control de inventario: https://tools.fu.do/recursos/plantilla-de-control-de-inventario-gastronomico

### 2.11 Agentes de IA del producto (no son del hub, son módulos pagos)
- **Recepcionista IA** (reservas y consultas por WhatsApp): https://recursos.fu.do/recepcionista-ia · precio por país en `countries.json` (`fudoModules`).
- **Vendedor IA / Tu Delivery** (pedidos por WhatsApp que se toman solos): https://tudelivery.com y https://fu.do/es-ar/agentes-ia/.

## 3. Módulos del producto Fudo (para enlazar desde las recomendaciones)

Páginas de producto de AR (`/es-ar/`). En MX/CL/CO el patrón es el mismo con `/es-mx/`, `/es-cl/`, `/es-co/`; en Brasil (Deli) las URLs están en portugués (`https://deli.com.br/pt-br/sua-gestao/`, `.../delivery/`, `.../pedidos-qr/`, `.../reservas/`, `.../agentes-ia/`, `.../pre%C3%A7os/`).

| Módulo / capacidad | Qué cubre | URL de producto | Ayuda / precio |
|---|---|---|---|
| **Tu Gestión** (POS, comandas, stock, caja, reportes) | Comandas, stock, caja y reportes en tiempo real; usuarios ilimitados | https://fu.do/es-ar/tu-gestion/ | Planes: https://fu.do/es-ar/precios/ |
| **Facturación electrónica** (módulo) | Emisión de comprobantes fiscales según el país (ARCA en AR, SII en CL, etc.) | https://fu.do/es-ar/tus-cobros/ (facturación al instante con la terminal) | Intro: https://soporte.fu.do/es/articles/11731046-introduccion-a-la-factura-electronica · AR alta del módulo: https://soporte.fu.do/es/articles/11731382-argentina-alta-del-modulo-de-facturacion-electronica · AR emisión: https://soporte.fu.do/es/articles/11731389-argentina-emision-de-facturas-electronicas · CL video: https://soporte.fu.do/es/articles/11731402-video-tutorial-de-facturacion-electronica-en-chile |
| **Delivery Apps** (módulo) | Centraliza en una pantalla los pedidos de Uber Eats, PedidosYa y Rappi (AR) | https://fu.do/es-ar/tu-gestion/ | https://soporte.fu.do/es/articles/11730671-modulo-delivery-apps · https://soporte.fu.do/es/articles/11730848-8-delivery-apps-domicilio |
| **Tu Delivery** (tienda online propia) | Tienda personalizada, atención por WhatsApp con IA, fidelización, repartidores bajo demanda. "Prueba con 25 ventas gratis", "solo pagas si vendés", "hasta 76% más" (dato de marketing de Fudo, no verificado) | https://fu.do/es-ar/tu-delivery/ (alias `/delivery/`) | Colombia lista el módulo a COP 110.900/mes |
| **Control de stock e inventario** | Stock por producto, recetas, costos, conteo de inventario | https://fu.do/es-ar/tu-gestion/ | Plan Avanzado en adelante. https://soporte.fu.do/es/articles/11730940-control-de-stock-funcionamiento · https://soporte.fu.do/es/articles/11730950-conteo-de-inventario |
| **Reportes** | Ventas, productos, mesas, gastos, estado de resultados (Pro) | https://fu.do/es-ar/tu-gestion/ | Reportes gráficos: Plan Avanzado. https://soporte.fu.do/es/articles/11730974-reporte-de-ventas |
| **Tus Cobros / Terminal Fudo** | Terminal propia integrada: dividir cuentas, propinas, cobrar en la mesa, facturar | https://fu.do/es-ar/tus-cobros/ | Hardware: https://recursos.fu.do/hardware-ar/ |
| **Pedidos QR / Autoatención desde la mesa** | El cliente escanea, ve el menú y pide; la comanda entra a cocina y baja el stock | https://fu.do/es-ar/pedidos-qr/ | Carta QR: https://soporte.fu.do/es/ (colección "Carta QR") |
| **Reservas** | Reservas por WhatsApp, portal online y manuales, sin comisiones | https://fu.do/es-ar/reservas/ | |
| **Gestión de Mesas / Ventas por Comensal / KDS** | Salón, división de cuenta por comensal, monitor de cocina | https://fu.do/es-ar/tu-gestion/ | https://soporte.fu.do/es/articles/11730672-modulo-mesas · https://soporte.fu.do/es/articles/11730673-modulo-de-ventas-por-comensal |
| **Agentes IA (Recepcionista y Vendedor)** | WhatsApp 24/7: reservas y toma de pedidos | https://fu.do/es-ar/agentes-ia/ | https://recursos.fu.do/recepcionista-ia |
| **Multi-local** | Métricas consolidadas y gestión masiva de productos | https://fu.do/es-ar/precios/ ("Contactar a ventas") | https://soporte.fu.do/es/articles/11730681-reportes-consolidados |
| **Capacitaciones y Academia** | Gratis, en español y con una persona real | https://recursos.fu.do/capacitaciones/ · https://academiafudo.com/ | |
| **Crear cuenta / primeros pasos** | Alta gratis sin tarjeta | https://fu.do/es-ar/crear-cuenta/ | https://soporte.fu.do/es/articles/11712750-crear-la-cuenta · https://soporte.fu.do/es/articles/11712759-cargar-productos |

Centro de ayuda (colecciones: Primeros pasos, Mi cuenta, Impresoras, Manuales, Facturación electrónica, Tu Delivery, Delivery Apps, Terminales de cobro, Integraciones, Balanzas, Recepcionista IA, Apps móviles, Carta QR): https://soporte.fu.do/es/.

Datos de marketing de Fudo que aparecen en el sitio (los cito como "dicho por Fudo", sin verificar): "35.000+ negocios eligen Fudo" (https://fu.do/es-ar/), "los locales que activaron Tu Delivery venden hasta 76% más", "-40% de tiempo de espera por mesa" y "20% de ahorro en costos operativos" (https://fu.do/es-ar/pedidos-qr/).

## 4. Cómo las unifica nuestro flujo

Idea central: **Fudo ya tiene un diagnóstico de Google y un analista de reseñas por separado, cada uno con su propio formulario.** Nuestro diagnóstico es la "puerta de entrada" que reúne esas miradas con los datos del local ya cargados (el usuario busca su local una sola vez), suma las áreas que hoy no tienen herramienta (**delivery y operación/facturación**), califica al lead y termina en la cuenta precargada. Las herramientas existentes quedan como **profundización opcional** a un clic, y como **entregables concretos** para quien todavía no es cliente.

| Paso o área de nuestro diagnóstico | Herramienta de Fudo que reemplaza o enlaza | Cómo |
|---|---|---|
| 1. Búsqueda y confirmación del local | Reemplaza el campo "pega el link de Google Maps" de **Especialista en Google** y el buscador de **Analista de Reseñas** | Buscamos el local por nombre/dirección (gateway de datos) y ya tenemos rating, cantidad de reseñas, horarios, web y fotos. El dueño no pega links |
| Área **Google** (ficha completa, horarios, fotos, web) | **Tu Especialista en Google** | Nuestra nota de Google cubre lo medible (campos faltantes, horarios, fotos, rating). Para los **textos listos para publicar** (descripción, publicación, respuestas) enlazamos a https://tools.fu.do/perfil-de-google. Es la superposición más fuerte: hay que diferenciarse con el resto de las áreas y el ruteo |
| Área **Reseñas** (rating, volumen, % sin responder) | **Tu Analista de Reseñas** | Mostramos rating y volumen (proxy gratis). La lectura del texto de las reseñas queda para https://tools.fu.do/analizar-resenas ("profundizá: qué dicen tus clientes") |
| Área **Web** (tiene web, es móvil, carga rápido) | **Fudo Sitios** | Si no hay web o es mala: "Armá tu web gratis" → https://sitios.fu.do/ |
| Área **Delivery** (en qué apps está, dependencia de comisiones) | Módulos **Delivery Apps** y **Tu Delivery** | Cada recomendación enlaza al módulo (ver tabla de la sección 3) y a la calculadora de comisiones de la biblioteca |
| Área **Operación** (cobro, facturación, stock, locales) | Módulos Gestión, Facturación electrónica, Terminal Fudo, Multi-local | Es la parte sin herramienta gratis en tools.fu.do: es lo que nos hace distintos y lo que dispara el tier "caliente"/"switcher" |
| Ruteo **"tu Fudo ya armado"** (nombre, horarios, carta) | **Carta QR** como motor de carga de la carta; datos del local del gateway | En la demo se simula la carga: nombre, horarios y dirección salen del snapshot; la carta es simulada. En producción la carta se cargaría con el flujo de https://tools.fu.do/carta-qr (foto/PDF → IA) y el alta con https://fu.do/es-ar/crear-cuenta/. **No encontré API pública de precarga** (ver `paises.md`, sección 9) |
| Ruteo **por abrir** | **Consultor de Nuevos Negocios** | Destino directo: https://tools.fu.do/abrir-un-restaurante |
| Ruteo **nutrir** | **Biblioteca de descargables** | Entregamos 2 o 3 guías según el área más floja (Guía SEO local, Instagram, fotos) y pedimos el correo, igual que hace el hub |
| Área **Carta** (precios, fotos, estructura) | **Tu Experto en Menú**, **Fudo Snap**, **Tu Diseñador IA** | Recomendaciones de "mejorá tus fotos" → https://tools.fu.do/mejorar-fotos; "ordená tu carta" → https://tools.fu.do/optimizar-menu; "promocioná" → https://tools.fu.do/disenos-para-redes |
| Equipamiento / hardware | **Planificador de Equipamiento IA** | Solo para "por abrir" y para quien cambia de sistema: https://tools.fu.do/equipamiento-gastronomico |

Reglas de enlace sugeridas:
- Todos los enlaces salientes llevan `utm_source=diagnostico&utm_medium=tool&utm_campaign=<area>`. En fu.do el formulario de crear cuenta lee `utm_source`, `gclid`, `fbclid` y `promotional_code` (https://fu.do/assets/js/components/signup_form-07f76b8f.js), así que la atribución se conserva hasta la cuenta; la medición del experimento depende de eso.
- No pedir nada que ya tengamos (no repetir el link de Maps ni el nombre).
- Marcar en la UI qué enlaces son **herramientas existentes de Fudo** y cuáles son **módulos de pago**.

## 5. No encontrado / sin verificar

- Resultado real de cada herramienta (no envié datos). Los "devuelve" son lo prometido por cada página y sus ejemplos ilustrativos.
- Si cada agente exige crear cuenta o dejar correo antes de mostrar el resultado (el hub dice que piden nombre y correo; otras fichas dicen "sin registro").
- API o endpoint público de Fudo para precargar cuenta, horarios o carta.
- Una herramienta con el nombre literal "Carga asistida de carta" (la función existe como Carta QR).
- El enlace exacto de la ficha de Fudo Sitios dentro de `tools.fu.do` apunta a `https://sitios.fu.do/` (la app vive en otro subdominio).
