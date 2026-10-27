# Benchmark de diagnósticos y graders gratuitos para restaurantes

Fecha de captura: **2026-10-26**. Método: abrí las páginas públicas, leí el HTML y el árbol de la página, y complementé con búsquedas. **No envié formularios ni ingresé datos de contacto** en ninguna herramienta, así que lo que ocurre después del primer paso (resultado, captura del lead) lo tomo de fuentes secundarias y lo marco como tal. Lo que no pude verificar dice "no verificado" o "no encontrado".

## 1. Resumen comparativo

| | Owner.com Restaurant Website Grader | Upserve / Lightspeed Restaurant Marketing Grader | Qamarero "Diagnóstico gratuito para restaurantes" | Soamee "Diagnóstico digital para tu restaurante" |
|---|---|---|---|---|
| País / tipo | EE. UU., SaaS (web + pedidos online + marketing) | EE. UU., POS | España, SaaS gastronómico (TPV, reservas, pedidos) | España, **agencia de software** (no es un POS) |
| URL | https://grader.owner.com/ | **Ya no existe en vivo** (ver 3) | https://analiza.qamarero.com/ | https://soamee.com/tools/diagnostico-digital-restaurante |
| Estado | Activo | Discontinuado o movido (URL original da 404) | Activo | Activo |
| Entrada | Nombre del restaurante (buscador) | Nombre del negocio | Nombre del restaurante (buscador) | 6 preguntas de opción múltiple + 2 números |
| Usa datos reales del local | Sí (web, Google, competidores) | Sí (Google, Facebook, Yelp) | Sí (ficha, reseñas, fotos, competencia cercana) | **No** ("no consultamos tu ficha ni tus reseñas") |
| Puntaje | Score /100 (ejemplos 94 y 36) | Score global (escala no publicada) | "Puntuación de salud" (escala no verificada) | **/100** y áreas ordenadas por urgencia |
| Captura del lead | Datos de contacto + demo comercial (según buscador) | Contacto para ver el score completo | No verificado | Email solo para el plan completo; call opcional |

## 2. Owner.com Restaurant Website Grader (activo)

- **URL:** https://grader.owner.com/ (también `https://www.owner.com/grader`, que redirige ahí). Título de la página: "Restaurant Website Grader | Owner". Verificado el 2026-10-26.
- **Qué pide (verificado en la página):** un solo campo, "Find your restaurant" (buscador/combobox), y el botón "Get your score". Mensaje: "Enter your restaurant name to see your online health score. Scan your site in seconds and make sure you're beating your competitors." Tres chips de promesa: "How's my Google SEO?", "What's broken on my site?", "Who's beating me and how?". No hay formulario previo ni login para empezar (hay un enlace "Log in" arriba).
- **Qué mide (fuentes secundarias, no verificado en vivo):**
  - El score va sobre 100 y se apoya en tres bloques: resultados de búsqueda, experiencia del sitio web y listados locales (se citan 40 puntos por bloque en un snippet de https://www.owner.com/demo-quiz-grader, URL que hoy redirige a `/demo`).
  - Páginas de Owner muestran ejemplos de score alto (94/100) y bajo (36/100) con un aviso de ventas mensuales perdidas.
  - La nota de Restaurant Business sobre la demanda de Popmenu contra Owner dice que el grader califica la presencia online con factores como fotos, reseñas de Google y el sitio web (https://www.restaurantbusinessonline.com/technology/restaurant-tech-supplier-popmenu-sues-rival-ownercom-over-website-grading-tool; devolvió 403 al abrirla, la cito vía el resumen del buscador).
- **Cómo califica y captura el lead (snippet de buscador, no verificado en vivo):** el reporte completo está atado a un pitch comercial: ofrecen reservar una demo de 20 minutos con un especialista de Owner "para revisar tu reporte completo y ver a los competidores", y el quiz pide nombre, e-mail, celular y datos del restaurante, con aviso de tarifas de mensajes. Una página de un competidor (DevourNow, parte interesada) dice que el grader "termina con un pitch de USD 249 a 499 por mes"; es una afirmación de un competidor, no la tomo como hecha.
- **Riesgo documentado:** Popmenu demandó a Owner en 2025 alegando que el grader da puntajes artificialmente bajos a sitios de Popmenu porque el escaneo choca con los protocolos de seguridad y queda incompleto. Owner lo negó. No encontré sentencia. **Lección:** un grader que escanea webs de terceros puede dar falsos negativos y volverse un problema legal.
- **Qué copiaríamos:**
  1. **Un único campo de entrada** (nombre del local con autocompletado) y tres promesas concretas en forma de pregunta.
  2. El score sobre 100 con **sub-puntajes por bloque** y una cifra de "plata que se pierde por mes".
  3. La comparación con **competidores cercanos** como gancho emocional ("quién te está ganando").
- **Qué NO copiaríamos:**
  1. El pedido de teléfono y la derivación directa a una demo de ventas antes de dar valor: nuestro lead se califica con 3 o 4 preguntas y el resultado se ve completo sin dejar datos.
  2. Un puntaje opaco: publicamos las reglas (`src/domain/scoring.ts`) y marcamos qué dato es real, en vivo o simulado, para no repetir el problema del falso negativo.
  3. El escaneo agresivo de sitios de terceros como fuente única.

## 3. Upserve / Lightspeed Restaurant Marketing Grader (discontinuado o movido)

- **Qué fue:** Upserve lanzó en junio de 2019 su "Restaurant Marketing Grader" gratuito (https://restauranttechnologynews.com/2019/06/upserve-launches-free-restaurant-marketing-grader-tool/). Ingresabas solo el **nombre del negocio** y obtenías un **score global de marketing digital** basado en cuatro factores: consistencia de datos, sitios de reseñas, redes sociales y visibilidad online (Google, Facebook, Yelp). El score inicial era gratis; para ver el **score completo con recomendaciones accionables había que dejar datos de contacto**. La nota no publica escala ni fórmula.
- **Estado hoy:**
  - `https://www.upserve.com/restaurant-marketing-grader/` responde **404** (verificado el 2026-10-26).
  - `https://www.lightspeedhq.com/restaurant-marketing-grader/` y `.../grader/` también dan 404.
  - Existe una copia archivada del 2022-12-22: http://web.archive.org/web/20221222162453/https://upserve.com/restaurant-marketing-grader/ (página "Restaurant Marketing Grader · Powered by [widget]" con contenido SEO y consejos; el widget no se puede evaluar en el archivo).
  - Lightspeed adquirió Upserve en 2020 por unos USD 430 M (https://techcrunch.com/2020/12/01/lightspeed-acquires-upserve).
  - **No encontré un reemplazo directo y gratuito de Lightspeed.** Lo más cercano que aparece es "Lightspeed Benchmarks and Trends" (comunicado de septiembre de 2024: https://www.nasdaq.com/press-release/lightspeed-launches-trailblazing-benchmarks-trends-us-using-ai-transform-comparative), que compara datos de restaurantes clientes con IA. No pude abrir el comunicado (timeout), así que **no verifiqué qué mide ni si es gratis o abierto**.
- **Reemplazo útil para el benchmark:** el grader activo de Owner (sección 2). Otros graders de web de restaurantes que aparecen en las búsquedas y que **no analicé a fondo**: https://richmenu.io/restaurant-website-grader/ (6 categorías) y el audit de DevourNow citado arriba (parte interesada).
- **Qué copiaríamos:** el patrón "**score inicial gratis, detalle accionable a cambio de contacto**" funciona, pero en nuestro caso el detalle se desbloquea con la creación de la cuenta ("tu Fudo ya armado"), no con un formulario de contacto.
- **Qué NO copiaríamos / lección:** el grader murió con la integración de la empresa. Una herramienta de adquisición que depende de scraping de varias fuentes es cara de mantener; por eso nuestro gateway tiene proveedores intercambiables y un snapshot fechado.

## 4. Qamarero: "Diagnóstico gratuito para restaurantes" (España, SaaS gastronómico, activo)

- **URL:** https://analiza.qamarero.com/ (subdominio aparte de https://qamarero.com/, "Software para hostelería y restaurantes", TPV, reservas, pedidos y cocina; "Primer mes de software gratis para nuevas altas; después, desde 119 €/mes"). Pie: © 2026 QR Payments S.L. Verificado el 2026-10-26.
- **Qué pide (verificado):** un único campo "Buscar restaurante por nombre" (ejemplo "El Rinconcito de María") y el botón "Analizar restaurante seleccionado". Nada más para empezar.
- **Qué mide (según la propia página):** "qué falla en tu ficha, tus reseñas y tus fotos"; descripción: "puntuación de salud, competencia cercana y oportunidades de mejora con inteligencia artificial". Tres promesas: "¿Cómo te encuentran en Google?", "¿Qué clientes pierdes cada mes?", "¿Quién te gana en tu zona?".
- **Cómo califica / lead:** la promesa es una puntuación de salud; la escala y el detalle del resultado **no los verifiqué** (habría que enviar la búsqueda). Cómo captura el lead después del resultado: **no verificado**. En la portada no hay campo de e-mail.
- **Textos de confianza:** "Gratis · Sin compromiso · 30 segundos" y prueba social "+2.500 restaurantes ya usan Qamarero".
- **Qué copiaríamos:**
  1. El **titular en forma de pérdida**: "¿Cuántos clientes pierdes en Google cada mes?". Es el mismo gancho que "cuánta plata se te escapa por mes".
  2. El trío de confianza ("gratis, sin compromiso, 30 segundos") y la **prueba social** con un número.
  3. La entrada por **búsqueda de nombre**, igual que nuestro hero.
- **Qué NO copiaríamos:** se queda en reputación y ficha de Google; no mira operación (cobro, facturación, stock) ni califica al lead por volumen o sistema actual. Esa es nuestra diferencia.

## 5. Soamee: "Diagnóstico digital para tu restaurante" (España, agencia; formato quiz)

- **URL:** https://soamee.com/tools/diagnostico-digital-restaurante. Soamee se describe como "Agencia de desarrollo de software en Madrid" (home), o sea **no es un SaaS de restaurantes**; lo incluyo por el formato, que es el mejor ejemplo de quiz que encontré. Verificado el 2026-10-26.
- **Qué pide:** **6 preguntas** de 4 opciones cada una, en forma de escalera de madurez (de "no sé si la tengo reclamada" a "reseñas respondidas y ficha al día"):
  1. Ficha de Google. 2. Cómo pide un cliente sentado. 3. Cuánto cuesta cada plato (escandallos). 4. Control de inventario y mermas. 5. Cuadre de caja. 6. Qué reporta el TPV.
  Después "Ponle número" ("tres datos tuyos" según la página; yo vi dos campos: horas a la semana en inventario y cuadre, y coste por hora) y calcula el coste anual **mostrando la multiplicación**.
- **Qué mide:** seis áreas: ficha de Google, carta y pedidos, escandallos, inventario y mermas, control de caja, datos del negocio. Puntaje **/100**, con las áreas ordenadas "de la más urgente a la que ya tienes resuelta" y un "problema principal".
- **Cómo califica / lead (texto de la propia página):** el resultado sale solo de lo que se responde ("no consultamos tu ficha ni tus reseñas"). **Para ver la puntuación, el desglose y el problema principal no hace falta dejar el e-mail**; el e-mail se pide para el plan completo, y "solo te llamamos si lo pides". Siguiente paso: "Reservar 30 minutos" para repasarlo con sus datos. Ofrece también un "Test de madurez digital" y una "Calculadora de presupuesto".
- **Qué copiaríamos:**
  1. **Respuestas en escalera de 4 niveles**, que se puntúan solas y dan sensación de progreso. Sirven para nuestras 3 o 4 preguntas de calificación (cómo cobrás y facturás hoy, canales).
  2. **Mostrar la cuenta** de "cuánta plata se pierde": operación visible, sin porcentajes ocultos. Es justo la defensa que necesitamos para que el dueño (persona P1, desconfiado) crea el número.
  3. **Mostrar el resultado completo sin pedir e-mail** y decirlo, y la promesa "no te llamamos si no lo pedís".
  4. Las áreas **ordenadas por urgencia**.
- **Qué NO copiaríamos:** es 100% autodeclarado (no usa datos reales del local, el punto fuerte de nuestra demo) y termina en una llamada de agencia. Tampoco está pensado para derivar al lead a una cuenta.

## 6. LATAM: qué encontré

- Busqué un diagnóstico/quiz gratuito equivalente en proveedores de software gastronómico de la región (Toteat, Saipos, Goomer y otros) y en portugués para Brasil. **No encontré ninguno.** La búsqueda devolvió solo fichas de empresa (CB Insights, descubre.vc) y noticias sin relación.
- Lo más parecido en LATAM es **la propia Fudo**: Tu Especialista en Google y Tu Analista de Reseñas (ver `docs/research/fudo-tools.md`). Cada una resuelve un área, con su propio formulario, sin calificar al lead ni llevarlo a la cuenta. Eso valida el espacio libre para un diagnóstico integrado.
- Para México, Chile, Colombia y Argentina, la búsqueda de autodiagnósticos devolvió solo programas generales de digitalización de pymes (de España), no de restaurantes.

## 7. Síntesis: decisiones de diseño que salen del benchmark

| Decisión | Se apoya en |
|---|---|
| Hero con **un solo campo** (nombre del local) y 3 promesas | Owner, Qamarero |
| Titular centrado en la pérdida ("cuánta plata se te escapa") + prueba social con número de Fudo ("35.000+ negocios", dato del sitio de Fudo) | Qamarero |
| 3 o 4 preguntas con **respuestas en escalera** y puntaje automático | Soamee |
| Resultado **completo sin dejar datos**; el contacto/cuenta viene después como beneficio ("tu Fudo ya armado") | Soamee (e-mail solo para el plan completo), contra el gate de Owner y de Upserve |
| Mostrar la **cuenta del número** de plata perdida (operación visible) | Soamee |
| Score /100 con **sub-puntajes por área** y áreas ordenadas por urgencia | Owner, Soamee |
| Marcar cada dato como **real / en vivo / simulado** y publicar las reglas | Lección del caso Popmenu vs. Owner (puntajes opacos) |
| Gateway con snapshot + proveedores intercambiables | Lección de la discontinuación del grader de Upserve/Lightspeed |
| Calificar por volumen, sistema actual y canales y rutear a 4 destinos | Diferencial nuestro: ninguno de los 4 hace ruteo ni califica al lead |

## 8. No encontrado / sin verificar

- Resultado completo y paso de captura del lead en Owner, Qamarero y Soamee tras el primer paso (no envié datos).
- Los textos del reporte de Owner (40 puntos por bloque, demo de 20 minutos, pedido de nombre/e-mail/celular) vienen de un snippet de buscador sobre una URL que hoy redirige a `/demo`; podrían haber cambiado.
- Escala exacta del puntaje de Qamarero y del grader de Upserve.
- Contenido y gratuidad de "Lightspeed Benchmarks and Trends".
- Un quiz/diagnóstico equivalente de otro SaaS gastronómico de LATAM (Toteat, Saipos, Goomer, Fudo fuera de sus herramientas sueltas).
