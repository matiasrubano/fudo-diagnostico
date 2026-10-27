# Log de prompts — Caso Fudo: Diagnóstico + Tu Fudo ya armado

> Entregable pedido por el caso: "los prompts o el historial de conversación con la IA que usaste".
> Archivado por A9 (Archivista de prompts) el 2026-10-27 05:22 (-03). Los briefs y los prompts del usuario están **textuales**, copiados de los transcripts de las sesiones. Los resúmenes de cada agente son míos y están marcados como tales.
> Horarios en hora de Argentina (UTC-3), la misma zona del repo y del PLAN.
> Una sola redacción: en los briefs de A2, A5 y A9 aparecen los patrones del comando de búsqueda de secretos; los reemplacé por `<patrones de claves redactados>` para que este archivo pase su propio chequeo. Todo lo demás es literal.
> Cada brief que recibió un subagente llegó con un recordatorio del harness (entregar el reporte por `SubagentHandback`) agregado como segundo mensaje; no es parte del brief y no se transcribe.
> Los bloques usan cercas de cuatro acentos graves porque varios briefs contienen bloques de código.

## Índice
1. [Cómo se trabajó](#1-cómo-se-trabajó)
2. [Prompts del usuario](#2-prompts-del-usuario)
3. [Briefs por agente](#3-briefs-por-agente-orden-cronológico)
4. [Decisiones clave y correcciones](#4-decisiones-clave-y-correcciones)
5. [Cronología de commits](#5-cronología-de-commits)

---

## 1. Cómo se trabajó

**Esquema.** Un **orquestador** (Claude Opus en Claude Code) lee `PLAN.md` —la única fuente de verdad: norte, goals G1–G8, agentes A1–A9, estructura del repo, gates— y no escribe el código grande: delega, revisa, integra, actualiza el PLAN y hace los commits. Cada goal se delega a **subagentes Claude Sonnet** (`model: "sonnet"`) con **briefs autocontenidos**: ruta del PLAN, el goal, rutas de entrada y salida, regla de oro y criterio "Listo cuando". Los cuatro investigadores (A1a–A1d) corrieron en paralelo; el constructor (A2) y el redactor del blog (A2b) también. Los agentes que simulan dueños (A4) están pensados para recibir solo una persona y la URL, sin contexto del proyecto. Antes de dar un goal por cerrado, el orquestador verifica el criterio él mismo (abre archivos, corre tests, mira la app en 375 y 1280 px) y, si falta algo, devuelve el trabajo con feedback concreto (`SendMessage`).

**Gates humanos.** El orquestador se detiene y pregunta en G-OK0 (nombre y visibilidad del repo, primer deploy), G-OK1 (app final), G-OK2 (guion) y G-OK3 (entrega). El único gate pasado hasta ahora es G-OK0 (el usuario eligió `fudo-diagnostico`, público, con el riesgo de ToS declarado). Las credenciales nunca las escribe un agente: el orquestador instaló `gh` y `vercel`, y el usuario hizo el login.

**Reglas permanentes.** (1) No inventar datos: lo real lleva fuente y fecha de captura (`provenance`), lo simulado se marca como simulado, lo no encontrado dice "no encontrado". (2) Cero secretos en el repo: `.env.example` documentado y `git grep` de claves antes de cada commit. (3) Todo dentro de `C:\Users\m_rubano\FUDO\`. (4) Los subagentes no editan el PLAN. (5) Responsive obligatorio (360, 375, 768, 1024, 1280 px, sin scroll horizontal, objetivos táctiles ≥44 px) y código fácil de tocar para el cambio en vivo de 15 minutos.

**Herramientas.** Claude Code (sesiones de orquestador y subagentes), navegador integrado de Claude (captura del snapshot de locales y verificación visual), WebSearch/WebFetch, Playwright (241 capturas de A2) y axe-core (accesibilidad), Vite + React + TypeScript + Tailwind, Vitest, ESLint/Prettier, GitHub Actions (CI), `gh` 2.103.3 y Vercel CLI 65.3.1. Previstos para después: skills `docx`/`pdf` (informe), Remotion y el conector de ElevenLabs (video).

**Cómo se manejaron los límites de los planes gratuitos** (detalle y fuentes en `docs/research/costos.md`, §5–§6):

| Servicio | Límite del plan gratuito | Qué hicimos |
|---|---|---|
| LLM (Gemini) | Tier gratis con límites que solo se ven en AI Studio; los datos del tier gratis se usan para mejorar productos | **Sin LLM en runtime (D3).** Recomendaciones por reglas y plantillas, marcadas como simuladas. Si se activa en producción: tier pago, razonamiento mínimo y sin mandar contenido de Places |
| Google Places | Topes gratis por SKU desde marzo 2025: Text Search Pro 5.000/mes, **Place Details Enterprise 1.000/mes** (cuello de botella); requiere cuenta de facturación | La demo corre con **snapshot estático** fechado (USD 0, sin key). Places está implementado detrás de `DATA_SOURCE=places`; para activarlo: cuota diaria, alerta de presupuesto en USD 1, key restringida, límite por IP y **fallback automático al snapshot** si hay error o 429. Costo documentado: USD 0,057 por diagnóstico; los primeros 1.000 por mes salen USD 0 |
| Vercel Hobby | 1 M de invocaciones, 100 GB de transferencia, 300 s por función, 100 deploys por día; **uso no comercial**; al pasarse se pausa 30 días (no cobra); Git solo con cuentas personales | Sin dependencia de LLM, snapshot estático, un solo proyecto y un solo repo bajo cuenta personal; PageSpeed con timeout corto; README e informe aclaran que es una demo no comercial y que producción va en Pro |
| GitHub Free | Actions gratis en repos públicos | Un solo workflow `ci.yml` (lint + typecheck + test + build) con caché y `concurrency` |
| Plan de uso de Claude | Un límite de uso cortó la sesión el 27/10 a las 00:27 con A2 a mitad de un arreglo | Se detuvo A2, se dejó el estado anotado en la Bitácora del PLAN y se retomó al renovarse el límite, revisando `git status` antes de seguir |

---

## 2. Prompts del usuario

Textuales. Los prompts 2.1 a 2.4 son de la sesión de planificación (hora local, 26/10); del 2.5 en adelante, de la sesión del orquestador.

### 2.1 Planteo del caso (26/10, 22:36)
````text
@"C:\Users\m_rubano\Downloads\Caso AI-driven Organic Growth - Fudo.pdf"
Tengo que armar este caso para Fudo. Vamos a empezar, voy a plantearte mi plan y quiero que salgas a cuestionarlo sinceramente. ponele una nota del 1 al 10 antes de empezar a construir y dime que opinas. Primero, vamos a definir el problema, el cliente (dueño de restaurant viene por el contenido, te adjunto varios angulos que encontre en FUDO desde su biblioteca de anuncios para que analices con 
/watch el enfoque que yo veo mayoritariamente es la idea de una empresa que busca posicionarse como una herramienta en la que podes hacer todo para tu negocio. y en este ultimo tiempo le estan metiendo foco a IA agentica. esta dentro de sus soluciones pro. (screappea el sitio web y revisalo) hablan mucho de un agente de reseñas, un agente de recepcion para reservas. que propongo yo; el problema, dueños de restaurantes que no saben como llenarlos y si lo tienen lleno no saben como gestionarlos. con fudo eso se termina. Con respecto al segmento, fudo no le pega a un solo segmento, le pega a varios, dark kitchnens, cadenas multisucursales, food trucks,bares, pizzerias, restos, todo eso esta en su sitio. Por lo tnato, la herramienta de diagnostico me parece una genial idea, pero quiero algo que destaque. como vamos a hacerlo? vamos a hacer un quiz funnel, el lead entra frio/tibio de un contenido de pauta o organico. el tema es que todos entran por problemas diferentes, una dark kitchen entra porque no puede gestionar todos sus pedidos y facturacion y una cadena de sucursales entra porque no puede llevar  acabo la operacion. Por lo tanto, el quiz debe filtrar pero de manera tal que al final sea obvio que fudo es la solucion correcta, vamos a atacar cualquier posible objecion que pueda tener el cliente final. Falta definir cual seria el metodo(si es un diagnostico o algo mas pro, puedes investigar que hacen otros en el mercado, peudes ver internacionalmente) tambien tenemos que responder el resto de las preguntas, sin olvidarnos del numero. Necesito que este primer output vengas a rostear mi pensamiento, criticarlo de todas las maneras que encuentres siendo sincero si es que encuentras una buena logica tambien y dandome al menos 3 opciones de herrmaientas justificandomelas
````

### 2.2 Elección de la opción A y crítica a "un solo país" (26/10, 22:45)
````text
okay, me interesa la opcion A, tengamos en cuenta que esto es una demo para una entrevista y no una solucion que tiene que estar lista hoy, lo unico que me hace ruido es que NO entiendo porque deberiamos limitarlo a un solo pais, no me parece un criterio correcto. ya que dice que tenemos 80.000 vistas mensuales de todos los paises, lo que nos pide es que lo filtremos, nada mas, no podemos reconocer la ip para saber de donde vienen? o cuando pongan el nombre del restaurante usarlo?
````

### 2.3 Pedido del PLAN en Markdown y del equipo de agentes (26/10, 22:48)
````text
bien, no lo que vamos a hacer es idear un plan con un archivo MD, vas a trabajar con goals en ese MD. Vas a pedir; ejecutar subagentes de sonnet para la investigacion , construccion(SI O SI RESPONSIVE) , luego quiero otro agente que simule ser un dueño de restaurante(este no tendra memoria de lo que estamos haciendo) y otro para construir el informe. Mantendras los colores de fudo eres libre de que estos agentes busquen o usen skills disponible. Por ultimo; cuando el sitio este terminado y con mi ok un subagente creara el video con una voz neutra de eleven labs y motion graphics de la app. Eres libre tambien de crear subagentes que creas necesarios para esto. Dame el MD, el output de ese MD es la app, el video y el informe
````

### 2.4 Decisiones D1 (gateway) y D2 (GitHub + Vercel) y pedido del prompt de ejecución (26/10, 22:53)
````text
D1, me interesa que sea funcional, pero literalmente en el informe dice (que harias despues, api, etc ) asi que vamos a hacer un gateway para que los casos de uso sean de restauratnes reales. d2, para esto dile al md que me de la ubicacion lo publicaremos en vercel, tambien dile que lo publique en un repo de github(sera leido por el equipo tecnico asi que es vital la estructura de ese documento y de el codigo en general) como output dame un prompt para que otra sesion de la llm ubique el MD y lo ejecute correctamente
````

### 2.5 Prompt de ejecución, versión del archivo `PROMPT-EJECUCION.md`
````text
Sos el orquestador del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". Trabajás en la carpeta C:\Users\m_rubano\FUDO\ (si la sesión no está ahí, movete a esa carpeta antes de hacer cualquier cosa).

1. Leé COMPLETO C:\Users\m_rubano\FUDO\PLAN.md. Es la única fuente de verdad: decisiones, goals (G1–G8), agentes (A1–A9), estructura del repo, gates y entregables. No reabras las decisiones de la §0 ni de la §4.
2. Si existe C:\Users\m_rubano\Downloads\Caso AI-driven Organic Growth - Fudo.pdf, leelo como contexto del caso (son los requisitos de Fudo).
3. Revisá la Bitácora (§8) y los checkboxes para saber en qué goal estamos. Si todo está en [ ], arrancás por G1.
4. Ejecutá los goals en el orden de la §3:
   - Delegá cada goal a subagentes con la herramienta Agent y model "sonnet", tal como dice la tabla de la §1.
   - Cada brief tiene que ser autocontenido: ruta del PLAN, el goal completo, las rutas de entrada y salida, y el criterio de "Listo cuando".
   - Los agentes A4 (dueños simulados) reciben SOLO la persona y la URL de la app. Nada del proyecto, ni de Fudo, ni del caso.
   - Corré en paralelo lo que el plan permite (A4 ×4; G6 y G7 después de G-OK1).
5. Antes de dar un goal por terminado, verificá vos mismo el criterio de "Listo cuando": abrí los archivos, corré los tests y mirá la app en el navegador en 375 y 1280 px. Si algo falta, devolvéselo al subagente con feedback concreto.
6. Al cerrar cada goal: actualizá los checkboxes, la §7 y la Bitácora del PLAN, y hacé commit (desde G3) con conventional commits.
7. Gates 🔒 (G-OK0, G-OK1, G-OK2, G-OK3): frená y preguntame. No sigas sin mi respuesta. Al empezar G2 preguntame por D3 (key de Gemini).
8. Nunca escribas credenciales ni secretos. Si `gh` o `vercel` no están logueados, frená y pedime que me loguee.
9. No inventes datos: todo lo simulado se marca como simulado y todo lo real lleva fuente y fecha de captura.
10. Cuando termines cada goal, mandame un resumen corto: qué se hizo, qué verificaste, qué falta y dónde quedó cada archivo. Al final, dame la tabla de la §7 completa: URL del repo, URL de Vercel, ruta del informe, ruta del video y ruta del log de prompts.

Empezá ahora: leé el PLAN y arrancá el goal pendiente que corresponda.
````

### 2.6 Prompt de ejecución tal como llegó a la sesión del orquestador (26/10, 23:00)
Es el archivo anterior con dos agregados del usuario: "no vamos a usar keys de gemini, es simulacion" dentro del ítem 7, y el ítem 11 (blog GEO, MCP y SEO no genérico). Texto textual de lo enviado:
````text
Sos el orquestador del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". Trabajás en la carpeta C:\Users\m_rubano\FUDO\ (si la sesión no está ahí, movete a esa carpeta antes de hacer cualquier cosa).

1. Leé COMPLETO C:\Users\m_rubano\FUDO\PLAN.md. Es la única fuente de verdad: decisiones, goals (G1–G8), agentes (A1–A9), estructura del repo, gates y entregables. No reabras las decisiones de la §0 ni de la §4.
2. Si existe C:\Users\m_rubano\Downloads\Caso AI-driven Organic Growth - Fudo.pdf, leelo como contexto del caso (son los requisitos de Fudo).
3. Revisá la Bitácora (§8) y los checkboxes para saber en qué goal estamos. Si todo está en [ ], arrancás por G1.
4. Ejecutá los goals en el orden de la §3:
   - Delegá cada goal a subagentes con la herramienta Agent y model "sonnet", tal como dice la tabla de la §1.
   - Cada brief tiene que ser autocontenido: ruta del PLAN, el goal completo, las rutas de entrada y salida, y el criterio de "Listo cuando".
   - Los agentes A4 (dueños simulados) reciben SOLO la persona y la URL de la app. Nada del proyecto, ni de Fudo, ni del caso.
   - Corré en paralelo lo que el plan permite (A4 ×4; G6 y G7 después de G-OK1).
5. Antes de dar un goal por terminado, verificá vos mismo el criterio de "Listo cuando": abrí los archivos, corré los tests y mirá la app en el navegador en 375 y 1280 px. Si algo falta, devolvéselo al subagente con feedback concreto.
6. Al cerrar cada goal: actualizá los checkboxes, la §7 y la Bitácora del PLAN, y hacé commit (desde G3) con conventional commits.
7. Gates 🔒 (G-OK0, G-OK1, G-OK2, G-OK3): frená y preguntame. no vamos a usar keys de gemini, es simulacion 8. Nunca escribas credenciales ni secretos. Si `gh` o `vercel` no están logueados, frená y pedime que me loguee.
9. No inventes datos: todo lo simulado se marca como simulado y todo lo real lleva fuente y fecha de captura.
10. Cuando termines cada goal, mandame un resumen corto: qué se hizo, qué verificaste, qué falta y dónde quedó cada archivo. Al final, dame la tabla de la §7 completa: URL del repo, URL de Vercel, ruta del informe, ruta del video y ruta del log de prompts.
11- No esta en el MD pero suma tambien una parte de blog GEO para que responda a las dudas que pueden estar teniendo los usuarios y asi aparecer en las LLM. Suma la en el informe para el post, la idea de generar un MCP para usar estas herraminetas dentro de la propia LLM el sitio ademas, tiene que tener una clara inclinacion a un SEO sin ser generico ni obvio
Empezá ahora: leé el PLAN y arrancá el goal pendiente que corresponda.
````

### 2.7 Mensajes posteriores en la sesión del orquestador
| Cuándo | Mensaje (textual) |
|---|---|
| 26/10, 23:03 | "Instalá gh y vercel CLI vos (con winget/npm), después yo me logueo." |
| 27/10, 00:18 | Respuestas al gate G-OK0 (pregunta de opciones): nombre del repo = "fudo-diagnostico (Recomendado)"; visibilidad = "Público + riesgo declarado (Recomendado)" |
| 27/10, 00:21 | "Ya me logueé en gh y vercel. Seguí con G3." |
| 27/10, 04:56 | "sigue, hazla menos generica. y termina" |
| 27/10, después de 05:12 (informado por el orquestador; el transcript archivado termina antes) | "te paso el logo de fudo, tanto para el video como para el sitio" |

La elección entre las 3 herramientas del primer análisis (el usuario eligió la **opción A**, diagnóstico híbrido) y los demás puntos de decisión se resumen en la sección 4.

---

## 3. Briefs por agente (orden cronológico)

Cada bloque trae: objetivo, métricas de la corrida (tool calls y duración, sacadas del transcript), el brief **completo** que envió el orquestador, el feedback posterior (si hubo) y un resumen de lo que devolvió. Los resúmenes son míos, tomados del reporte final de cada agente.

**Agentes archivados (8):** A1a, A1b, A1c, A1d, A2, A2b, A5, A9. No hay A3, A4, A6, A7 ni A8: todavía no corrieron.

| Agente | Lanzado (-03) | Tool calls | Estado al archivar |
|---|---|---|---|
| A1a | 2026-10-26 23:02 (-03) | 153 | terminado |
| A1b | 2026-10-26 23:02 (-03) | 108 | terminado |
| A1c | 2026-10-26 23:02 (-03) | 80 | terminado |
| A1d | 2026-10-26 23:02 (-03) | 115 | terminado |
| A2 | 2026-10-26 23:36 (-03) | 126 | interrumpido por límite de uso (reporte parcial entregado) |
| A2b | 2026-10-26 23:36 (-03) | 90 | terminado |
| A5 | 2026-10-27 05:12 (-03) | 32+ | en curso al momento de archivar |
| A9 | 2026-10-27 05:12 (-03) | 37+ | en curso al momento de archivar |

### A1a · Investigador: marca, países, herramientas de Fudo, benchmark

- **Objetivo:** Sacar de fu.do los tokens exactos de marca y armar la tabla de países (moneda, ente fiscal, apps de delivery, planes, URL de alta), más el catálogo de herramientas de Fudo y un benchmark de graders.
- **Salidas:** `docs/research/brand.md`, `paises.md`, `fudo-tools.md`, `benchmark.md`, `app/src/config/countries.json`
- **Corrida:** lanzado 2026-10-26 23:02 (-03); 153 tool calls registrados; duró ~31 min.

**Brief (completo):**

````text
Sos A1 (Investigador), instancia (a), del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". Fudo (https://fu.do) es un SaaS de gestión para restaurantes en AR, MX, CL, CO y BR. Estamos armando una herramienta gratuita de diagnóstico de presencia online para restaurantes que termina en "tu cuenta de Fudo ya viene con tu nombre, horarios y carta cargados". Plan completo (contexto, leelo primero): C:\Users\m_rubano\FUDO\PLAN.md (§0 y §2-G1). No edites el PLAN.

Fecha de captura de hoy: 2026-10-26. Escribí todo en español.

REGLA DE ORO: nada inventado. Cada dato lleva link a su fuente. Lo que no encuentres se escribe literalmente "no encontrado" (y en JSON `null` + una nota). Nunca rellenes con estimaciones sin marcarlas como "estimado".

TU PARTE (otras 3 instancias hacen snapshots de restaurantes, datos/APIs/costos y distribución/GEO; no las hagas vos):

1. **Marca** → `C:\Users\m_rubano\FUDO\docs\research\brand.md`
   - Sacá los tokens exactos del sitio fu.do: bajá el HTML de https://fu.do (y /es-ar/ u otras variantes de país si existen), encontrá los .css enlazados y extraé: hex del naranja/rojo principal, del azul de acento, neutros (fondos, texto, bordes), tipografías (font-family y de dónde se cargan), radios de borde, sombras si son características. Podés usar WebFetch o `curl` vía Bash (guardá descargas temporales en C:\Users\m_rubano\FUDO\.tmp\ y no las dejes en otro lado). Indicá en qué archivo CSS / selector apareció cada token.
   - Al final del .md, un bloque `ts` sugerido para `src/theme/tokens.ts` con esos valores. Si la tipografía es paga/propietaria, proponé una alternativa de Google Fonts y marcala como "sustituto".
2. **Tabla de países** → `C:\Users\m_rubano\FUDO\app\src\config\countries.json` (JSON válido) con claves `AR, MX, CL, CO, BR`. Esquema por país:
   ```json
   {"code":"AR","name":"Argentina","language":"es-AR","currency":{"code":"ARS","symbol":"$"},
    "fiscal":{"authority":"ARCA","system":"Factura electrónica","url":"...","notes":"..."},
    "deliveryApps":[{"name":"PedidosYa","url":"...","source":"..."}],
    "fudoPlans":[{"name":"...","priceMonthly":0,"currency":"ARS","billing":"mensual|anual","source":"url","capturedAt":"2026-10-26"}] | null,
    "fudoSignupUrl":"...","fudoSiteUrl":"...",
    "sources":["..."]}
   ```
   Precios de Fudo: buscalos en las páginas de precios de fu.do por país. Si no están publicados, `fudoPlans: null` y explicá en `brand.md`? No: explicalo en `docs/research/paises.md` (creá ese archivo con la tabla legible, fuentes y notas de cada país). Apps de delivery dominantes por país con fuente (ej. reportes, notas de prensa). Ente fiscal: ARCA (ex AFIP) AR, SAT/CFDI MX, SII CL, DIAN CO, NF-e/SEFAZ BR — verificá y linkeá.
3. **Herramientas existentes de Fudo** → `C:\Users\m_rubano\FUDO\docs\research\fudo-tools.md`: revisá tools.fu.do (Especialista en Google, Analista de Reseñas, Fudo Sitios, Carga asistida de carta y lo que haya). Para cada una: qué hace, qué pide al usuario, qué devuelve, si pide crear cuenta, URL. Después una sección "Cómo las unifica nuestro flujo": qué paso de nuestro diagnóstico reemplaza o enlaza a cada una. Listá también los módulos del producto Fudo (facturación, delivery/integraciones, stock, reportes, tienda online, etc.) con URL, porque las recomendaciones del diagnóstico enlazan a módulos.
4. **Benchmark** → `C:\Users\m_rubano\FUDO\docs\research\benchmark.md`: Owner.com Restaurant Grader (o como se llame hoy), Upserve/Lightspeed Marketing Grader si sigue existiendo (si no, decilo y buscá el reemplazo), y 1–2 quizzes/diagnósticos de SaaS gastronómico de LATAM o España. Para cada uno: URL, qué pide, qué mide, cómo califica/captura el lead, qué copiaríamos y qué no.

**Listo cuando:** existen los 5 archivos (brand.md, paises.md, countries.json, fudo-tools.md, benchmark.md), el JSON parsea (verificalo con `node -e "JSON.parse(require('fs').readFileSync('C:/Users/m_rubano/FUDO/app/src/config/countries.json','utf8'))"`), y cada dato tiene link o dice "no encontrado". Borrá C:\Users\m_rubano\FUDO\.tmp\ al terminar.

Devolveme un resumen corto: qué encontraste, qué quedó "no encontrado", y los hex/tipografía finales.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- Tokens de marca: naranja `#FF5023`, azul `#3937FF`, azul noche `#0F1B4E`, Barlow + Inter, radios píldora/16/24. Blanco sobre `#FF5023` da 3,27:1 (no pasa AA en texto chico): se usa `#D03F00` (4,78:1).
- `countries.json` con los 5 países y precios de planes publicados en todos. Hallazgo: **Brasil se vende como Deli**, no como Fudo (se sumó `productName`).
- El formulario de alta de fu.do solo lee `promotional_code`, `gclid`, `fbclid` y `utm_source`: no hay precarga de nombre, horarios ni carta, así que "Tu Fudo ya armado" es **simulado**. "Carga asistida de carta" corresponde a Carta QR.
- Benchmark: Owner Restaurant Website Grader sigue activo; el Marketing Grader de Upserve está discontinuado (404). Declaró lo que no pudo verificar (portal del SAT dinámico).

---

### A1b · Investigador: snapshot de locales reales

- **Objetivo:** Capturar 13–15 restaurantes reales (AR 4, MX 4, CL 2, CO 2, BR 1) con provenance por campo, sin datos personales, cubriendo seis perfiles.
- **Salidas:** `app/data/snapshots/*.json` (+ `index.json`) y `docs/research/snapshot.md`
- **Corrida:** lanzado 2026-10-26 23:02 (-03); 108 tool calls registrados; duró ~26 min.

**Brief (completo):**

````text
Sos A1 (Investigador), instancia (b), del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". Estamos armando una demo de una herramienta gratuita que diagnostica la presencia online de un restaurante (Google, reseñas, web, delivery, Instagram) y lo lleva a crear una cuenta en Fudo (SaaS de gestión gastronómica). La demo corre sobre un **snapshot fechado de restaurantes reales**. Plan completo (leelo primero para contexto): C:\Users\m_rubano\FUDO\PLAN.md (§0 y §2-G1 "Snapshot de restaurantes reales"). No edites el PLAN.

Fecha de captura: 2026-10-26. Todo en español.

TU TAREA: capturar **13–15 locales reales**: 4 de Argentina, 4 de México, 2 de Chile, 2 de Colombia, 1 de Brasil. Mezcla de perfiles (cubrí todos al menos una vez): `pizzeria-delivery` (pizzería con mucho delivery), `bar`, `cadena-chica` (2–5 sucursales), `dark-kitchen` (solo delivery), `mala-presencia` (pocas reseñas / sin web / sin horarios cargados), `bien-posicionado` (muchas reseñas, buen rating, web, delivery). Preferí locales independientes o cadenas chicas (1–3 locales es nuestro segmento), no McDonald's. Idealmente: una pizzería del conurbano bonaerense (ej. Lanús/Avellaneda), una taquería en CDMX, una dark kitchen en Bogotá, una cafetería en Santiago.

REGLAS DURAS:
- **Solo datos públicos del negocio**: nombre, dirección, ciudad, país, tipo, rating, cantidad de reseñas, horarios, web, Instagram, links a apps de delivery (PedidosYa, Rappi, Uber Eats, DiDi Food, iFood), cantidad de sucursales, nivel de precio.
- **Cero datos personales**: ni nombres ni textos de reseñas, ni nombres de dueños/empleados, ni teléfonos personales. No descargues fotos.
- **Nada inventado**. Cada campo con su `provenance`. Si un dato no se encuentra, `value: null` y `status: "not_found"`. Distinguí "no lo encontré" de "verifiqué que no existe" (`status: "absent"`, por ejemplo: busqué en PedidosYa y no está). Rating y reseñas: Google Maps es difícil de leer con fetch; intentá vía búsqueda web (los snippets suelen mostrar "4,5 (1.234)"), la web del local, TripAdvisor, Restorando/TheFork, o la ficha de la app de delivery. Siempre aclarando en `source` de dónde salió (p. ej. "Google (snippet de búsqueda)", "TripAdvisor"). No mezcles: si el rating es de TripAdvisor, el campo es `rating` con source TripAdvisor.

FORMATO: un archivo por local en `C:\Users\m_rubano\FUDO\app\data\snapshots\<pais-minuscula>-<slug>.json` (ej. `ar-pizzeria-x-lanus.json`), JSON válido con este esquema exacto:
```json
{
  "id": "ar-pizzeria-x-lanus",
  "country": "AR",
  "profile": "pizzeria-delivery",
  "capturedAt": "2026-10-26",
  "fields": {
    "name":        {"value": "Pizzería X", "status": "found", "provenance": {"source": "Google (snippet)", "url": "https://...", "capturedAt": "2026-10-26", "real": true}},
    "address":     {"value": {"street": "...", "city": "Lanús", "region": "Buenos Aires", "postalCode": null, "country": "AR"}, "status": "found", "provenance": {...}},
    "businessType":{"value": "pizzeria|bar|restaurante|cafeteria|dark-kitchen|taqueria|hamburgueseria|otro", ...},
    "rating":      {"value": 4.5, "status": "found", "provenance": {...}},
    "reviewCount": {"value": 1234, ...},
    "openingHours":{"value": ["lunes: 19:00–00:00", "..."], ...},
    "website":     {"value": "https://...", ...},
    "instagram":   {"value": {"handle": "@...", "url": "https://instagram.com/..."}, ...},
    "delivery":    {"value": {"pedidosya": "url|null", "rappi": "url|null", "ubereats": "url|null", "didi": "url|null", "ifood": "url|null"}, ...},
    "locationsCount": {"value": 1, ...},
    "priceLevel":  {"value": "$|$$|$$$|null", ...},
    "dineIn": {"value": true, ...}, "takeout": {...}, "deliveryOffered": {...}
  },
  "notes": "por qué encaja en el perfil"
}
```
Además creá `C:\Users\m_rubano\FUDO\app\data\snapshots\index.json` con `[{ "id", "country", "name", "city", "profile", "file" }]` y `C:\Users\m_rubano\FUDO\docs\research\snapshot.md` con: tabla de los locales, perfil, de dónde salió cada dato, qué no se encontró, y la nota de que es un snapshot solo para demo (los ToS de Google no permiten cachear; en producción se consulta la API).

**Listo cuando:** 13–15 archivos JSON válidos (verificalos con node: `node -e "for (const f of require('fs').readdirSync('C:/Users/m_rubano/FUDO/app/data/snapshots')) JSON.parse(require('fs').readFileSync('C:/Users/m_rubano/FUDO/app/data/snapshots/'+f,'utf8'))"`), todos los perfiles cubiertos, el reparto por país es el pedido, cada campo tiene provenance con URL real o status not_found/absent, y no hay ningún dato personal.

Devolveme un resumen: la tabla de locales (id, país, perfil, rating, reseñas) y qué campos quedaron mayormente sin encontrar.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- 13 locales reales (AR 4, MX 4, CL 2, CO 2, BR 1) y 6 perfiles cubiertos; los pedidos puntuales quedaron (pizzería de Lanús, taquería CDMX, dark kitchen Bogotá, cafetería Santiago).
- WebSearch/WebFetch daban poco: capturó con el **navegador integrado** leyendo la ficha de Google (con `gl=` por país) y abriendo los links de PedidosYa, Rappi, Uber Eats e iFood. Cada campo trae `provenance` (source, url, capturedAt, real) y distingue `not_found` de `absent`.
- Sin nombres ni textos de reseñas, sin teléfonos, sin fotos. La dark kitchen de Bogotá quedó sin rating ni reseñas (n/d).
- Los JSON pasaron el comando de validación con node.

---

### A1c · Investigador: Places API, ToS, costos y límites de planes gratuitos

- **Objetivo:** Documentar Google Places API (New): campos, SKUs, tier gratis, ToS de caché; otras fuentes; y calcular el costo por diagnóstico y los límites de Vercel/GitHub/Places en plan gratuito.
- **Salidas:** `docs/research/datos.md`, `docs/research/costos.md`
- **Corrida:** lanzado 2026-10-26 23:02 (-03); 80 tool calls registrados; duró ~18 min.

**Brief (completo):**

````text
Sos A1 (Investigador), instancia (c), del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". Es una herramienta gratuita que diagnostica la presencia online de un restaurante (Google, reseñas, web, delivery, Instagram) en AR/MX/CL/CO/BR y lo lleva a crear cuenta en Fudo (SaaS gastronómico). Arquitectura: un gateway de datos con proveedores intercambiables (SnapshotProvider por defecto, GooglePlacesProvider activo con GOOGLE_PLACES_API_KEY, MockProvider). Plan completo (leelo primero): C:\Users\m_rubano\FUDO\PLAN.md (§0, §2-G1, §2-G2). No edites el PLAN. Hoy: 2026-10-26. Todo en español.

REGLA DE ORO: cada dato con link a fuente oficial y fecha de consulta. Lo no encontrado dice "no encontrado". Precios: siempre de la página oficial de pricing, citando la fecha; si cambió recientemente, decilo.

TU PARTE:
1. → `C:\Users\m_rubano\FUDO\docs\research\datos.md`
   - **Google Places API (New)**: endpoints Text Search (New) y Place Details (New); para cada campo que nos sirve (`displayName`, `formattedAddress`, `addressComponents`, `rating`, `userRatingCount`, `regularOpeningHours`, `websiteUri`, `delivery`, `takeout`, `dineIn`, `priceLevel`, `photos`, `googleMapsUri`, `businessStatus`, `primaryType`) decí a qué SKU/tier pertenece (Essentials / Pro / Enterprise / Enterprise + Atmosphere). Field masks: ejemplo concreto de `X-Goog-FieldMask` para search y details mínimo. Ejemplo de request/response real de la documentación (forma del JSON) para que el Constructor escriba el fixture del test. `locationBias` y `regionCode`/`languageCode`.
   - Precio por 1.000 llamadas de cada SKU relevante y el **tier gratuito** vigente (Google cambió en marzo 2025 de crédito de USD 200 a cuotas gratis por SKU: verificá lo vigente hoy).
   - **ToS de caché**: qué permite cachear (place_id sí, el resto no / límites temporales) con cita al documento de Políticas/ToS de Maps Platform. Conclusión: por qué el snapshot es solo para la demo.
   - **Otras fuentes** y cómo se conseguirían en producción: Instagram (Graph API / Instagram Business Discovery: requisitos, límites, qué datos se pueden leer de una cuenta de terceros), PedidosYa, Rappi, Uber Eats, DiDi Food, iFood (¿hay API pública o de partners? ToS sobre scraping), web propia (fetch + **PageSpeed Insights API**: cuota gratuita, campos útiles), y si aplica Meta/Facebook Pages. Para cada una: real o simulado en la demo (propuesta: Google = snapshot real; Instagram/apps = presencia real del link pero métricas simuladas; web = real si existe).
   - Tabla final "Fuente · Cómo en producción · Restricción · Costo · Demo (real/simulado)".
2. → `C:\Users\m_rubano\FUDO\docs\research\costos.md`
   - **Costo estimado por diagnóstico** en USD: 1 Text Search + 1 Place Details con el field mask mínimo; PageSpeed (gratis con cuota); LLM opcional (precio de Gemini Flash por 1M tokens, de la página oficial de Google AI, estimando ~1.500 tokens entrada / 500 salida por diagnóstico — marcá los tokens como "estimado"); hosting Vercel Hobby (límites del plan gratuito: invocaciones, duración, ancho de banda — verificá en la página oficial y aclarar que Hobby es no comercial).
   - Escenarios: 1.000 / 10.000 / 50.000 diagnósticos al mes, cuánto queda dentro del gratuito y costo marginal. Comparación con el CAC de pauta del caso (USD 20 por cuenta creada, USD 200 por cliente pagante).
   - Límites de los planes gratuitos que usamos (Vercel Hobby, GitHub free, Places free tier) y cómo los manejamos.

**Listo cuando:** existen los 2 archivos, cada precio/límite tiene link oficial y fecha, y el costo por diagnóstico está calculado con la fórmula a la vista. Devolveme un resumen corto con el costo por diagnóstico y los riesgos de ToS.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- Costo por diagnóstico: **USD 0,052** (mínimo), **0,057** (con delivery/takeout/dineIn, recomendado), 0,025 con Autocomplete por sesión; PageSpeed USD 0; LLM opcional +0,003 (se duplica el 2027-01-01). Los **primeros 1.000 diagnósticos por mes salen USD 0** (cuello de botella: Place Details Enterprise).
- Escenarios (variante mínima, sin LLM): 1.000 = USD 0; 10.000 = USD 340; 50.000 = USD 2.420. ~0,3% de un CAC por cuenta.
- Vercel Hobby alcanza (el único riesgo es memoria aprovisionada si se espera 20 s a PageSpeed) pero es **no comercial**, y el repo debe estar en cuenta personal.
- Riesgo de ToS ordenado: **alto = snapshot en repo público** (Google prohíbe cachear y volver a publicar contenido de la ficha). Lo marcó para G-OK0.

---

### A1d · Investigador: distribución, blog GEO y MCP

- **Objetivo:** Responder "una herramienta sin tráfico no genera clientes": keywords SEO/AEO por país, páginas programáticas, alianzas, plan de 6–8 artículos GEO (D4) y propuesta de MCP.
- **Salidas:** `docs/research/distribucion.md`, `geo-blog.md`, `mcp.md`
- **Corrida:** lanzado 2026-10-26 23:02 (-03); 115 tool calls registrados; duró ~22 min.

**Brief (completo):**

````text
Sos A1 (Investigador), instancia (d), del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". Fudo (https://fu.do) es un SaaS de gestión para restaurantes en AR, MX, CL, CO y BR. Armamos una herramienta gratuita de diagnóstico de presencia online para restaurantes (segmento núcleo: restaurantes, bares y pizzerías de 1–3 locales, con volumen y delivery) que termina en crear cuenta en Fudo. La pregunta del caso es: "una herramienta sin tráfico no genera clientes, ¿cómo llega el dueño?". Plan completo (leelo primero): C:\Users\m_rubano\FUDO\PLAN.md (§0, §2-G1 "Distribución", §4-D4). No edites el PLAN. Hoy: 2026-10-26. Todo en español.

REGLA DE ORO: nada inventado. Volúmenes de búsqueda: si no tenés una fuente (Google Keyword Planner no es accesible sin cuenta), no pongas números: usá señales verificables (aparece en "Más preguntas" de Google, autocompletado, Google Trends comparativo, hilos de Reddit/foros con link) y marcá "volumen: no disponible". Todo con link.

TU PARTE:
1. → `C:\Users\m_rubano\FUDO\docs\research\distribucion.md`
   - **Keywords SEO/AEO por país** (AR, MX, CL, CO; BR breve en portugués): de alta intención y **específicas, no genéricas**. Pensá en el momento del dueño: "cómo hacer factura electrónica ARCA restaurante", "comisión PedidosYa restaurante 2026", "cómo aparecer primero en Google Maps restaurante", "sistema para pizzería con delivery", "alternativa a <POS competidor> México", "CFDI 4.0 restaurante propinas", "boleta electrónica SII restaurante", etc. Agrupalas por intención (diagnóstico/presencia, facturación/fiscal, delivery/comisiones, switch de sistema, abrir un local) y por país. Para cada grupo: qué página la captura (diagnóstico, artículo del blog, página programática).
   - **Páginas programáticas**: proponé plantillas concretas (p. ej. "/diagnostico/<ciudad>/<tipo>": "Pizzerías en Lanús: cómo están en Google" con datos agregados; "/comisiones/<app>/<país>"; "/facturacion/<país>/<tipo-de-negocio>") con estimación honesta de cuántas páginas salen y el riesgo de contenido delgado (thin content / spam policies de Google, con link) y cómo evitarlo.
   - **Competencia SEO**: qué rankean hoy para 4–5 de esas keywords (Fudo, competidores como Maxirest, Bistrosoft, Poster, Toast, Loyverse, Soft Restaurant, Wansoft, etc. según país). Solo lo que puedas ver con búsquedas.
   - **Alianzas**: cámaras gastronómicas por país (FEHGRA / AHRCC AR, CANIRAC MX, Achiga/Gastronomía Chile, ACODRES CO, Abrasel BR), estudios contables/contadores, proveedores de hardware (impresoras fiscales, posnets), bancos/fintech (Mercado Pago, Clip). Con links. Qué le ofrecería la herramienta a cada aliado (p. ej. embed del diagnóstico, informe compartible).
   - **Herramienta compartible / loops**: informe con URL pública, comparativa con locales de la zona, badge.
   - **Pauta solo para validar**: cómo usarla (presupuesto chico, qué medir).
2. → `C:\Users\m_rubano\FUDO\docs\research\geo-blog.md` (GEO = Generative Engine Optimization: que los LLM citen el sitio)
   - Preguntas reales que hacen los dueños (People Also Ask, autocompletado, Reddit r/argentina r/mexico r/Colombia r/chile, foros, grupos) con link a la evidencia.
   - Buenas prácticas GEO/AEO con fuentes (paper "GEO: Generative Engine Optimization" de Princeton/2023, documentación de Google sobre AI Overviews y datos estructurados, `llms.txt` (propuesta de llmstxt.org, aclarar que no es estándar oficial), schema `FAQPage`/`Article`/`HowTo` (y qué dejó de mostrar Google como rich result), contenido con datos citables, respuesta directa en el primer párrafo, fecha de actualización, autor).
   - **Plan de 6–8 artículos** para el blog del sitio, al menos 2 de AR y 2 de MX, 1 CL, 1 CO: para cada uno título, slug, país, keyword principal, pregunta que responde, intención, "respuesta directa" de 2–3 líneas, outline H2, 3–5 preguntas FAQ, qué datos/fuentes oficiales cita (con link: ARCA, SAT, SII, DIAN, páginas de comisiones de las apps, Google Business Profile Help), y cómo conecta con el diagnóstico (CTA). Nada genérico tipo "10 tips para tu restaurante".
3. → `C:\Users\m_rubano\FUDO\docs\research\mcp.md`
   - Qué es MCP (Model Context Protocol, spec en modelcontextprotocol.io), estado actual de distribución dentro de los LLM: Apps en ChatGPT / Apps SDK de OpenAI, conectores/directorio de Claude, soporte en Gemini; requisitos (servidor remoto, auth OAuth, revisión), con links y fecha.
   - Ejemplos de empresas que ya distribuyen herramientas así (si encontrás del rubro gastronomía/reservas/delivery, mejor).
   - Propuesta concreta para Fudo: un MCP server "Fudo Diagnóstico" con 3–5 tools (p. ej. `diagnosticar_local(nombre, ciudad)`, `estimar_comisiones_delivery(app, ventas)`, `requisitos_facturacion(pais, tipo)`, `preparar_cuenta_fudo(...)` que devuelve link con datos precargados), qué datos expone, riesgos (privacidad, abuso, costos de Places) y cómo se mide (eventos con `utm_source=mcp`). Esto va al informe, no se construye ahora.

**Listo cuando:** existen los 3 archivos, cada afirmación tiene link, los volúmenes sin fuente dicen "no disponible", y el plan del blog tiene 6–8 artículos completos según el formato pedido. Devolveme un resumen corto con la lista de artículos y la propuesta de MCP en 3 líneas.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- Plan de 8 artículos (AR 3, MX 3, CL 1, CO 1) con keyword, pregunta, respuesta directa, outline, FAQ, fuentes y lista "verificar antes de publicar". Sin volúmenes de búsqueda ni hilos de Reddit verificables: los declaró "no disponible".
- Hallazgos que cambian el plan: **FAQPage ya no da rich result** (se mantiene la FAQ visible); `llms.txt` es propuesta, no estándar; las **páginas por ciudad** son doorway y chocan con la política de Places, así que 0 páginas viables. Fudo no aparece en ninguna de 6 consultas relevadas.
- MCP: servidor remoto "Fudo Diagnóstico", solo lectura, 4 tools (`diagnosticar_local`, `estimar_comisiones_delivery`, `requisitos_facturacion`, `preparar_cuenta_fudo`), atribución con `utm_source=mcp`; no verificó que un dueño de LATAM pueda usar conectores.

---

### A2 · Constructor: app, gateway de datos, repo local

- **Objetivo:** Construir la app (Vite + React + TS + Tailwind, funciones serverless, gateway con Snapshot/Places/Mock, scoring por reglas, blog prerenderizado) con README, ARCHITECTURE, ADR y CI, y un historial de commits convencionales.
- **Salidas:** `app/`, `README.md`, `docs/ARCHITECTURE.md`, `docs/adr/`, `.github/workflows/ci.yml`
- **Corrida:** lanzado 2026-10-26 23:36 (-03); 126 tool calls registrados; duró ~52 min.

**Brief (completo):**

````text
Sos A2 (Constructor) del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". Es una demo para una entrevista en Fudo (SaaS de gestión para restaurantes, AR/MX/CL/CO/BR): una herramienta gratuita que diagnostica la presencia online de un restaurante y lo lleva a crear cuenta. El equipo técnico de Fudo va a leer el repo, y en la entrevista se hace un **cambio en vivo de 15 min**: el código tiene que ser simple, prolijo y fácil de tocar.

LEÉ PRIMERO, COMPLETO: `C:\Users\m_rubano\FUDO\PLAN.md` (§0 Norte, §2-G2 y §2-G3 enteros, §4 decisiones D1–D4). No reabras decisiones y no edites el PLAN (lo actualiza el orquestador).

ENTRADAS (salidas de la investigación G1, léelas):
- `docs/research/brand.md` → tokens de marca (bloque ts al final). Naranja #FF5023, azul #3937FF, azul noche #0F1B4E, tinta #1A1A2E, crema #FFFAEC, Barlow (títulos) + Inter (cuerpo), radios píldora/16/24. **Contraste:** blanco sobre #FF5023 da 3,27:1 → solo para texto grande/bold; texto chico naranja en #D03F00.
- `app/src/config/countries.json` → moneda, ente fiscal, apps de delivery, planes con precio, `fudoSignupUrl`, `productName` (BR = "Deli": en Brasil el CTA dice Deli, no Fudo).
- `app/data/snapshots/*.json` + `index.json` → 13 locales reales. Esquema: `fields.<campo> = { value, status: found|not_found|absent, provenance: { source, url, capturedAt, real, note? } }`. Respetá `not_found` (no sabemos) vs `absent` (verificado que no existe) en el scoring y en la UI.
- `docs/research/datos.md` (Places API New: field masks, SKUs, forma del JSON; §1.4-B tiene un fixture ficticio para el test), `docs/research/costos.md`, `docs/research/fudo-tools.md` (módulos de Fudo con URL → las recomendaciones enlazan ahí; "Carga asistida de carta" = Carta QR), `docs/research/paises.md`, `docs/research/benchmark.md`, `docs/research/geo-blog.md` (buenas prácticas GEO), `docs/research/distribucion.md`.

QUÉ CONSTRUÍS (todo dentro de `C:\Users\m_rubano\FUDO\`, con la estructura exacta de §2-G3):
1. **App** en `app/`: Vite + React + TypeScript strict + Tailwind. Funciones serverless de Vercel en `app/api/` (`diagnose.ts`, `places-search.ts`). Para que `npm run dev` ande **sin** Vercel CLI ni login, montá esos mismos handlers como middleware del dev server de Vite (plugin chico en `vite.config.ts`).
2. **Gateway** (`app/src/gateway/`): `PlaceDataProvider` (search/getDetails), `SnapshotProvider` (default), `GooglePlacesProvider` (fetch a Places API New con field mask mínimo de datos.md; activo si `DATA_SOURCE=places` y hay `GOOGLE_PLACES_API_KEY`), `MockProvider`, `index.ts` con selección por `DATA_SOURCE` y fallback places→snapshot con log. El frontend nunca ve el proveedor ni keys. `x-vercel-ip-country` solo sesga la búsqueda; el país final sale de la dirección. Nombre no encontrado → "en la demo cubrimos estos locales reales: …" con sugerencias clickeables.
3. **Dominio puro** (`app/src/domain/`): `scoring.ts` (nota general + por área: Google, reseñas, web, delivery, operación; **pesos y umbrales en constantes arriba del archivo**, comentadas), `recommendations.ts` (plantillas por reglas y por país, cada una enlaza a un módulo de Fudo con URL de fudo-tools.md; sin LLM, D3), `leadTier.ts` (caliente / switcher / nutrir / descartar / por-abrir según volumen proxy = reseñas, sistema actual, canales, locales; segmento núcleo: 1–3 locales con volumen y delivery), y el cálculo de **"cuánta plata se te escapa por mes"** en moneda local: fórmula explícita con supuestos visibles en la UI ("¿cómo calculamos esto?"), marcada como **estimación simulada**. Un dueño desconfiado tiene que poder ver de dónde sale el número.
4. **Flujo mobile-first** (§2-G2 pasos 1–6): hero + buscador → confirmación (sin fotos: avatar con inicial, dirección, rating, badge de fuente) → 4 preguntas, una por pantalla, con progreso → resultado (notas, recomendaciones, plata perdida) → ruteo por tier:
   - caliente → "Tu {productName} ya armado": preview de la cuenta precargada (nombre, dirección, horarios del snapshot; carta = simulada) + botón que **simula** crear la cuenta (modal/confirmación y link a `fudoSignupUrl` con `utm_source=diagnostico&utm_medium=tool&utm_campaign=<tier>`). Declarar en la UI que hoy el alta de fu.do no acepta precarga (dato de G1) → "simulado".
   - switcher → mismo CTA + "migramos tus datos"; nutrir → descargable + email (simulado, no se envía nada); por-abrir → Consultor de Nuevos Negocios de Fudo.
   - BR: banner "contenido en español; la versión en portugués está fuera del alcance de la demo".
   - **Badges de procedencia** en cada dato: "real · capturado el 26/10/2026" / "en vivo" / "simulado". Footer con tabla real vs simulado.
5. **Instrumentación** (`app/src/analytics/events.ts`): `diag_start`, `place_selected`, `q_answered_n`, `result_viewed`, `lead_tier`, `cta_click` → guardados en localStorage + panel `/debug` (tabla de eventos + embudo + botón limpiar).
6. **Un archivo por responsabilidad** para el cambio en vivo: copy en `src/content/copy.ts`, tokens en `src/theme/tokens.ts`, pesos en `src/domain/scoring.ts`, recomendaciones en `src/domain/recommendations.ts`.
7. **Blog GEO (D4) — vos hacés el pipeline; otro agente (A2b) escribe en paralelo los 8 artículos** en `app/content/blog/*.md` con este frontmatter YAML: `title, slug, country (AR|MX|CL|CO), lang (es-AR…), description, keyword, question, updatedAt (YYYY-MM-DD), author, status ("borrador-demo"), faq: [{q, a}], sources: [{label, url}], verifyNotes: [string], cta: {text}`. El cuerpo es markdown y arranca con un párrafo de respuesta directa. Hasta que lleguen, usá 1 artículo de ejemplo propio (`app/content/blog/_ejemplo.md`, borralo al final si ya hay artículos reales). Requisitos:
   - **Prerender a HTML estático** en el build: `/blog/` (índice por país) y `/blog/<slug>/` tienen que devolver el artículo completo **en el HTML, sin JS** (verificalo con `curl` o leyendo `dist/blog/<slug>/index.html`). Podés hacerlo con un script de build (p. ej. `marked` + plantilla que reutiliza el CSS de Tailwind) o un plugin de SSG; elegí lo más simple y documentalo en un ADR.
   - Cada página: `<title>` y meta description específicos, canonical, OG/Twitter, `inLanguage`, JSON-LD `Article` (author, datePublished/dateModified) + `FAQPage` (aclaración: Google ya no muestra el rich result de FAQ desde 2026; se mantiene por los LLM y la FAQ queda visible en el HTML), breadcrumbs, fuentes al pie con links, caja "Pendiente de verificación" si `verifyNotes` no está vacío, CTA al diagnóstico.
   - `public/robots.txt`, `sitemap.xml` generado en el build con todas las URLs, `public/llms.txt` generado (propuesta llmstxt.org, no estándar) listando la herramienta y los artículos.
   - La home también prerenderizada con título/meta **no genéricos** (p. ej. "Diagnóstico gratis de tu restaurante: Google, reseñas, PedidosYa y Rappi en 60 segundos"), JSON-LD `WebApplication`, y links al blog. Nada de "10 tips".
8. **Repo** (§2-G3): `README.md` (arranca con demo + video [placeholders "pendiente"], qué es, 3 comandos para correrlo, diagrama del gateway, tabla real/simulado), `docs/ARCHITECTURE.md` (gateway, flujo de datos, cómo agregar un proveedor o un país, cómo funciona el blog prerenderizado), `docs/adr/0001-gateway-de-datos.md`, `0002-snapshot-vs-api.md` (incluí el riesgo de ToS de Maps: el snapshot viene de la ficha de Google; ver datos.md), `0003-scoring-por-reglas.md`, `0004-blog-prerenderizado-geo.md`. `.github/workflows/ci.yml` (en `app/`: lint + typecheck + test + build). ESLint + Prettier. `.gitignore` (node_modules, dist, .env*, .vercel, video/out, .tmp) y `app/.env.example` documentado (`DATA_SOURCE=snapshot`, `GOOGLE_PLACES_API_KEY=` vacío). `app/vercel.json` con rewrites de SPA que **no** pisen `/blog/*`, `/api/*`, `sitemap.xml`, `robots.txt`, `llms.txt`.
9. **Tests (Vitest)**: `domain/` (scoring por perfil, leadTier por las 5 rutas, plata perdida, recomendaciones por país) y `gateway/` (SnapshotProvider sobre los JSON reales, MockProvider, GooglePlacesProvider con fixture de datos.md §1.4-B marcado ficticio y `fetch` mockeado, fallback places→snapshot).
10. **Git**: `git init` en `C:\Users\m_rubano\FUDO\` (rama `main`) y **commits chicos con conventional commits** a medida que avanzás (chore: scaffold, feat(gateway): …, feat(domain): …, test: …, docs: …), para que el historial cuente cómo se construyó. Cada mensaje termina con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Incluí `PLAN.md`, `docs/research/` y los snapshots. **NO** crees remoto, **NO** pushees, **NO** uses `gh` ni `vercel` (eso está atrás de un gate humano). No toques `app/content/blog/*.md` que no sean tuyos (son de A2b), salvo para leerlos. Antes de cada commit: `git grep -nE "<patrones de claves redactados>|token"` y que no haya secretos.

RESPONSIVE (no negociable): 360, 375, 768, 1024, 1280 px sin scroll horizontal, objetivos táctiles ≥44 px, contraste AA, foco visible y navegable con teclado. Verificalo vos con capturas (podés usar la skill `webapp-testing` / Playwright): flujo completo en 375 y 1280, guardadas en `C:\Users\m_rubano\FUDO\.tmp\shots\` (fuera de git). Probá al menos un local de cada país y los 4 ruteos (caliente, switcher, nutrir, por-abrir) + "local no encontrado".

NO INVENTES DATOS: todo lo que no venga del snapshot/countries/research se marca "simulado" en la UI. No pongas métricas de Instagram/apps como reales.

**Listo cuando** (el orquestador lo va a verificar): en `app/`, `npm ci && npm run lint && npm run typecheck && npm test && npm run build` pasan; el flujo completo anda en 375 y 1280 con `DATA_SOURCE=snapshot`; `GooglePlacesProvider` compila y tiene test con fixture; `dist/blog/<slug>/index.html` contiene el texto del artículo y el JSON-LD; existen README, ARCHITECTURE, 4 ADRs, CI, `.env.example`; hay historial de commits convencionales en `main` sin secretos.

Devolveme: comandos para correrlo, lista de commits (`git log --oneline`), resultado de tests (cantidad), qué capturas tomaste y dónde, decisiones que tomaste vos y cualquier cosa que no hayas podido cerrar.
````

**Feedback recibido:**

1. (2026-10-26 23:49 (-03)) del orquestador, al terminar A2b:

````text
Los 8 artículos del blog ya están en C:\Users\m_rubano\FUDO\app\content\blog\ (A2b terminó): aparecer-google-maps-restaurante, boleta-electronica-restaurante-sii, cambiar-de-soft-restaurant, cfdi-4-restaurante-propinas, comision-pedidosya-rappi-restaurante, comision-uber-eats-didi-food-rappi, factura-electronica-pos-restaurante-dian, factura-electronica-restaurante-arca. Frontmatter según el esquema que te pasé; el `slug` va sin prefijo de país, armá la ruta como /blog/<slug>/ (o /guias/<pais>/<slug>/ si preferís, pero que sea consistente con sitemap, llms.txt y canonical). Prerenderizá los 8 y borrá `_ejemplo.md` si lo creaste. No edites el contenido de los artículos. Ojo: en C:\Users\m_rubano\FUDO\.tmp\ A2b dejó js-yaml y check-blog.cjs; no los commitees (.tmp va en .gitignore).
````

2. (2026-10-27 00:27 (-03)) del orquestador, ya con el repo en GitHub y el deploy en Vercel dando 500 en `/api/*`. A los pocos segundos de recibirlo el orquestador detuvo a A2 por el límite de uso:

````text
Arreglo pendiente: las funciones de app/api fallan en producción en Vercel (FUNCTION_INVOCATION_FAILED). El repo ya está en GitHub (https://github.com/matiasrubano/fudo-diagnostico, origin/main) y el proyecto Vercel `fudo-diagnostico` existe con rootDirectory=app, Node 22.x, DATA_SOURCE=snapshot. Ya corregí yo `app/vercel.json` (tenía `\.` inválido en JSON → ahora `\\.`), está sin commitear: incluilo en tu commit.

Diagnóstico (lo reproduje con `vercel build --prod` en C:\Users\m_rubano\FUDO y corriendo `.vercel/output/functions/api/places-search.func/app/api/places-search.js` con node):
1. @vercel/node emite ESM (respeta "module": "ESNext" del tsconfig) y Node no resuelve imports relativos sin extensión: `ERR_MODULE_NOT_FOUND .../app/src/server/diagnosisService`. Fix pedido: en todo el código que corre en el servidor (app/api, src/server, src/gateway, src/domain, src/config y lo que importen) usá imports relativos con extensión `.js` (`'../src/server/diagnosisService.js'`, `'./types.js'`; el import de directorio `'../gateway'` → `'../gateway/index.js'`). Con moduleResolution "bundler" TS y Vite lo aceptan. El `import ... from './countries.json'` en src/config/countries.ts necesita `with { type: 'json' }` en ESM de Node (o leerlo con fs del lado servidor; elegí lo que funcione en Vite, Vitest y Node).
2. `defaultSnapshotDir()` usa `join(process.cwd(), 'data', 'snapshots')`, pero en la Lambda cwd es /var/task y los archivos quedan en /var/task/app/data/snapshots (ver filePathMap en .vc-config.json). Resolvelo probando candidatos (`cwd/data/snapshots`, `cwd/app/data/snapshots`, y relativo al módulo con import.meta.url) y usando el primero que exista; lo mismo para cualquier otra lectura de disco del servidor. Agregá un test.

Cómo verificar antes de commitear (todo desde C:\Users\m_rubano\FUDO):
- `cd app && npm run lint && npm run typecheck && npm test && npm run build`
- `vercel build --prod` en la raíz y luego, desde `.vercel/output/functions/api/places-search.func`, `node -e` que importe `./app/api/places-search.js` y llame a `default.fetch(new Request('https://x/api/places-search?q=campeon'))` → tiene que devolver JSON con El Campeón. Lo mismo para diagnose.func con un POST de ejemplo.
- Luego commit convencional (`fix(api): ...`, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`), `git grep` de secretos, y `git push origin main`. NO hagas `vercel deploy` (lo hago yo) y NO toques variables de Vercel. No commitees `.vercel/` ni `.env.local` (están ignorados).

De paso, arreglá los 3 bugs menores que encontré en la verificación: (a) la recomendación de delivery dice "Hoy vendés solo por apps" aunque se marcó también mostrador/salón: ajustá el texto según los canales; (b) `place_selected.from_suggestion` da false al elegir un chip de sugerencia de la home; (c) `/debug` hereda el `<title>` de la home: poné uno propio. Devolveme el hash del commit pusheado y la salida de las dos pruebas de las funciones.
````

Consecuencia: el arreglo quedó a medias; el orquestador lo cerró al retomar (commits `0ef1c93` y `84ca323`, ver secciones 4 y 5).

**Qué devolvió (resumen mío):**

- App completa con `npm ci/lint/typecheck/test/build` en verde (**64 tests, 7 archivos**); 10 commits convencionales en `main`; `GooglePlacesProvider` probado con fixture ficticio y fallback a snapshot con log.
- 241 capturas con Playwright (9 recorridos, 5 países, 4 ruteos; 375/768/1280), 0 px de scroll horizontal, axe-core sin violaciones, foco visible.
- Decisiones propias: botón primario en `#D03F00`, voseo rioplatense, "Todavía no abrí" corta el cuestionario, scoring con "sin datos suficientes" (un 5,0 con 8 reseñas se topa en 60), plata perdida con rango ±40% y supuestos marcados como simulados, `GPTBot` permitido en `robots.txt`.
- No pudo probar Vercel ni Places en vivo (sin CLI ni key). Luego, ya desplegado, `/api/*` dio 500: ver feedback y sección 4.

---

### A2b · Redactor del blog GEO

- **Objetivo:** Escribir los 8 artículos de `geo-blog.md` en Markdown con frontmatter (respuesta corta arriba, H2 como preguntas, FAQ, fuentes, `verifyNotes`).
- **Salidas:** `app/content/blog/<slug>.md` (8 archivos)
- **Corrida:** lanzado 2026-10-26 23:36 (-03); 90 tool calls registrados; duró ~13 min.

**Brief (completo):**

````text
Sos A2b (Redactor del blog GEO) del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". Es una demo para una entrevista en Fudo (SaaS de gestión para restaurantes en AR/MX/CL/CO/BR): una herramienta gratuita que diagnostica la presencia online de un restaurante. El sitio suma un blog pensado para GEO/AEO, es decir, para que lo citen los LLM (ChatGPT, Gemini, Claude, AI Overviews) cuando un dueño les hace una pregunta concreta. Plan: `C:\Users\m_rubano\FUDO\PLAN.md` (§0 y §4-D4; no lo edites).

ENTRADA PRINCIPAL: `C:\Users\m_rubano\FUDO\docs\research\geo-blog.md`, que trae el plan de 8 artículos (título, slug, país, keyword, pregunta, respuesta directa, outline H2, FAQ, fuentes y lista "verificar antes de publicar"). También podés leer `docs/research/distribucion.md`, `docs/research/paises.md` y `docs/research/fudo-tools.md` (módulos de Fudo con URL, para el CTA y los links internos).

SALIDA: 8 archivos `C:\Users\m_rubano\FUDO\app\content\blog\<slug>.md`, uno por artículo del plan. No toques nada más del repo (otro agente construye la app en paralelo).

FORMATO EXACTO (frontmatter YAML válido, después el cuerpo en markdown):
```markdown
---
title: "..."            # ≤ 65 caracteres, con la keyword, específico (nada de "10 tips")
slug: "..."
country: "AR"            # AR | MX | CL | CO
lang: "es-AR"            # es-AR | es-MX | es-CL | es-CO
description: "..."       # 140–160 caracteres, responde la pregunta
keyword: "..."
question: "..."          # la pregunta literal que haría un dueño a un LLM
updatedAt: "2026-10-26"
author: "Equipo del diagnóstico (borrador de demo)"
status: "borrador-demo"
faq:
  - q: "..."
    a: "..."
sources:
  - label: "ARCA — Factura electrónica"
    url: "https://..."
verifyNotes:
  - "..."               # lo que geo-blog.md marcó como a verificar (🔶) o contradictorio
cta:
  text: "..."           # invita al diagnóstico gratis, específico al tema
---

**Respuesta corta:** 2–3 líneas que responden la pregunta de una (esto es lo que va a citar un LLM).

## ...
```

REGLAS DE CONTENIDO (no negociables):
- **Nada inventado.** Solo afirmás lo que está en geo-blog.md o en una fuente oficial que abras y linkees. Cada número (comisión, fecha, monto, UVT, resolución) lleva su fuente en `sources` y, si viene de una fuente secundaria (🔶 en geo-blog.md), entra también en `verifyNotes`. Si no hay dato oficial (por ejemplo, no hay tabla pública de comisiones de PedidosYa), lo decís así y das el rango con su fuente secundaria, o una calculadora en texto ("si vendés X y la comisión es Y%…") sin afirmar un porcentaje como oficial.
- **Específico y útil:** pasos concretos, nombres reales de trámites y pantallas, ejemplos con números de ejemplo marcados como ejemplo. Escribí para el dueño de una pizzería o un bar de 1–3 locales, en el español del país (voseo en AR; tú en MX, CL y CO).
- **Estructura GEO:** respuesta corta arriba, H2 que son preguntas o pasos, una tabla cuando ayude, datos citables en frases cortas y autocontenidas, "Actualizado el 26/10/2026", FAQ de 3–5 preguntas en el frontmatter (no la repitas en el cuerpo: la plantilla la muestra).
- **Fudo sin humo:** como máximo una mención natural de un módulo de Fudo relevante (con URL de fudo-tools.md) y el CTA al diagnóstico. No es publicidad: el artículo tiene que servir aunque el lector nunca use Fudo.
- Largo: 600–1.000 palabras de cuerpo por artículo.
- Los artículos fiscales llevan en `verifyNotes`: "Revisión de un contador matriculado en <país> pendiente antes de publicar".

**Listo cuando:** existen los 8 archivos, el frontmatter de todos parsea (verificalo con node: instalá temporalmente `js-yaml` en `C:\Users\m_rubano\FUDO\.tmp\` o parseá con un script propio, y no dejes nada de eso fuera de `.tmp`), cada número del cuerpo tiene fuente en `sources`, y lo marcado 🔶 en geo-blog.md está en `verifyNotes`. Devolveme la lista de slugs con su país, la cantidad de palabras de cada uno y los `verifyNotes` más importantes.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- 8 artículos de 610 a 727 palabras (AR 3, MX 3, CL 1, CO 1); frontmatter validado con js-yaml (título ≤65, descripción 140–160, FAQ de 5, slug = nombre de archivo).
- **Corrigió a A1d**: el 25–35% de comisión de PedidosYa no sale de la guía de Develop Argentina (que dice 20–30% PedidosYa y 18–28% Rappi) sino de iProfesional (14/05/2026) sin fuente primaria; todo queda como dato secundario.
- Las páginas que no pudo abrir (sat.gob.mx 403, PDF de la DIAN, etc.) no sostienen ninguna cifra. Los artículos fiscales llevan "revisión de un contador pendiente".
- Una sola mención natural de Fudo por artículo, con URL verificada.

---

### A5 · Constructor (iteración): rediseño "menos genérico", landings por país y 3 bugs

- **Objetivo:** Rehacer la cara de la app a pedido del dueño ("hacela menos genérica"): logo real, hero desde la escena del cliente, ticket de ejemplo real, resultado como comanda, comparación con vecinos, voz por país, landings /ar /mx /cl /co y 3 bugs menores.
- **Salidas:** `app/` (UI, copy, dominio, prerender), README/ARCHITECTURE si cambia la estructura
- **Corrida:** lanzado 2026-10-27 05:12 (-03); 32+ tool calls registrados; **en curso al momento de archivar**.

**Brief (completo):**

````text
Sos A5 (Constructor, iteración) del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado": una herramienta gratuita que diagnostica la presencia online de un restaurante y lo lleva a crear cuenta en Fudo (SaaS gastronómico, AR/MX/CL/CO; BR se vende como "Deli"). Es una demo para una entrevista; el equipo técnico de Fudo lee el repo y en la entrevista se hace un cambio en vivo de 15 min.

Leé primero: `C:\Users\m_rubano\FUDO\PLAN.md` (§0, §2-G2, §4-D4), `C:\Users\m_rubano\FUDO\README.md`, `C:\Users\m_rubano\FUDO\docs\ARCHITECTURE.md`. El código está en `C:\Users\m_rubano\FUDO\app\` (Vite + React + TS strict + Tailwind; copy en `src/content/copy.ts`, tokens en `src/theme/tokens.ts`, dominio puro en `src/domain/`, gateway en `src/gateway/`, UI en `src/ui/`, blog prerenderizado con `scripts/prerender.ts` + `scripts/blog.ts`). Producción: https://fudo-diagnostico.vercel.app. Repo: https://github.com/matiasrubano/fudo-diagnostico (rama `main`, ya pusheada).

PEDIDO DEL DUEÑO DEL PROYECTO: "hacela menos genérica". Hoy parece una plantilla SaaS cualquiera (fondo crema, hero "¿Cómo está tu restaurante online?", chips, tarjetas con barras de progreso). Tiene que sentirse hecha para un dueño de pizzería/bar/taquería de LATAM y con la marca de Fudo, con un SEO de intención clara. Dirección (seguila; podés usar la skill `ui-ux-pro-max` para ejecutar bien, pero no cambies la dirección):

1. **Marca Fudo real**: usá el logo oficial que ya está en `app/public/brand/fudo-logo.svg` (naranja #FF5023) y `fudo-logo-white.svg` (para fondos oscuros) en header y footer, con una etiqueta chica "demo · no oficial". Para BR mostrás "Deli" en texto (no tenemos su logo). Favicon simple con la "F"/marca naranja (no hace falta el logo completo). Tokens de `src/theme/tokens.ts` (naranja #FF5023, azul #3937FF, azul noche #0F1B4E, Barlow + Inter). Recordá el contraste: texto chico naranja = #D03F00; blanco sobre #FF5023 solo en texto grande/bold.
2. **El momento del cliente, no "presencia online"**: el hero arranca desde la escena real: "Viernes 21:30. Alguien busca 'pizza en Lanús'. ¿Te encuentra, ve que estás abierto y te puede pedir?" (adaptá: es un ejemplo con un local real del snapshot, no un dato inventado). Debajo, el buscador.
3. **Prueba en vez de promesas**: en la home mostrá un **ticket de ejemplo real** de un local del snapshot (p. ej. El Campeón de la Pizza, Lanús: 4,2 · 6.167 reseñas, ficha de Google sin web propia, en PedidosYa y Rappi), leído de los datos reales (no hardcodees números: tomalos del snapshot vía el dominio/gateway o de un JSON generado en build), con su badge "real · capturado el 26/10/2026" y botón "Ver su diagnóstico completo".
4. **El resultado como una comanda / ticket de cocina**: papel de ticket (borde dentado o perforado), números en tipografía tabular/mono, cada área como un renglón de la comanda con su puntaje, y al pie "TOTAL QUE SE TE ESCAPA POR MES" en moneda local (sigue siendo **estimación simulada**, con el desplegable "¿cómo calculamos esto?" intacto). Áreas en lenguaje de dueño: Google → "¿Te encuentran?", Reseñas → "¿Te eligen?", Web y redes → "¿Te pueden pedir sin comisión?", Delivery → "¿Estás en las apps que usa tu barrio?", Operación → "¿Cobrás y facturás sin errores?" (mantené el id interno del área; esto es copy).
5. **Comparación con vecinos reales**: en el resultado, "Cómo estás contra otros locales de la demo en <ciudad/país>": usá los otros locales del snapshot del mismo país (y misma ciudad o tipo si hay) para mostrar rango real de reseñas y rating, con badge real. Si no hay pares, no lo muestres. Esto va en `src/domain/` como función pura con test. Nada inventado.
6. **Voz por país**: hoy todo está en voseo. Del resultado en adelante (cuando ya sabemos el país del local) usá voseo para AR y tuteo para MX, CL y CO, con los nombres locales (ARCA/SAT/SII/DIAN, PedidosYa/Rappi/DiDi/Uber Eats según countries.json). Hacelo simple y fácil de tocar: copy por país en `src/content/copy.ts` (un objeto base + overrides por país), no lógica dispersa.
7. **SEO con intención clara (D4)**: además de la home y el blog, prerenderizá **landings por país** `/ar/`, `/mx/`, `/cl/`, `/co/` (HTML estático indexable, mismo flujo React montado encima) con H1, title y description específicos (p. ej. AR: "Diagnóstico gratis para tu restaurante en Argentina: Google Maps, PedidosYa, Rappi y factura ARCA"), los locales reales de la demo de ese país, las guías del blog de ese país, `hreflang` entre home y landings, JSON-LD `WebApplication` + `BreadcrumbList`, y agregalas a `sitemap.xml` y `llms.txt`. Nada de relleno: cada landing nombra las apps, el ente fiscal y la moneda del país desde countries.json.
8. **Arreglá 3 bugs**: (a) la recomendación de delivery dice "Hoy vendés solo por apps" aunque se marcó también mostrador/salón → el texto tiene que depender de los canales marcados; (b) `place_selected.from_suggestion` da `false` al elegir un chip/sugerencia → tiene que dar `true`; (c) `/debug` hereda el `<title>` de la home → título propio.

RESTRICCIONES:
- No rompas la arquitectura ni el cambio en vivo: copy en `copy.ts`, pesos en `scoring.ts`, tokens en `tokens.ts`. Nada de LLM en runtime (todo por reglas). Todo lo simulado sigue marcado como simulado; lo real con su fecha.
- El código del servidor (`app/api`, `src/server`, `src/gateway`, `src/domain`, `src/config`) es ESM con imports relativos **con extensión `.js`** (así funciona en Vercel; el paquete tiene `"type": "module"`). Mantenelo así en todo archivo nuevo de esas carpetas.
- Responsive no negociable: 360, 375, 768, 1024, 1280 sin scroll horizontal, objetivos táctiles ≥44 px, AA, foco visible, teclado. Verificalo con Playwright (skill `webapp-testing`): flujo completo en 375 y 1280 para un local AR (El Campeón), uno MX (Red's Burger) y la ruta "Todavía no abrí"; capturas en `C:\Users\m_rubano\FUDO\.tmp\shots-v2\` (fuera de git). Corré axe en home, landing /mx/, resultado y artículo.
- Tests: `cd app && npm run lint && npm run typecheck && npm test && npm run build` en verde, con tests nuevos para la comparación con vecinos y para la copy por país.
- Git: commits chicos convencionales (feat(ui): …, feat(seo): …, fix: …), cada uno terminando con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; `git grep -nE "<patrones de claves redactados>"` antes de cada commit; al final `git push origin main`. **No** corras `vercel deploy` ni toques la config de Vercel (lo hace el orquestador). No toques `PLAN.md` ni `docs/prompts/` (otro agente escribe ahí). No commitees `.tmp/`, `.vercel/` ni `.env.local`.
- Actualizá README/ARCHITECTURE si cambió algo estructural (landings por país, comparación con vecinos).

**Listo cuando:** todo lo anterior está en `main` pusheado, CI local en verde, y las capturas de 375 y 1280 muestran el ticket, la comparación con vecinos y la voz por país. Devolveme: lista de commits, cantidad de tests, rutas de capturas clave (home 375/1280, resultado AR y MX en 375/1280, landing /ar/), resultado de axe y cualquier cosa que no hayas podido cerrar.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- **En curso al momento de archivar**: todavía no devolvió reporte final (llevaba 32 tool calls y ya había commiteado parte del trabajo, ver sección 5). Su resumen se agrega cuando el orquestador lo reciba.

---

### A9 · Archivista de prompts (este documento)

- **Objetivo:** Reconstruir el historial de prompts y briefs en `docs/prompts/LOG.md`.
- **Salidas:** `docs/prompts/LOG.md`
- **Corrida:** lanzado 2026-10-27 05:12 (-03); 37+ tool calls registrados; **en curso al momento de archivar**.

**Brief (completo):**

````text
Sos A9 (Archivista de prompts) del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". El caso de Fudo pide como entregable "los prompts o el historial de conversación con la IA que usaste". Plan: `C:\Users\m_rubano\FUDO\PLAN.md` (leelo entero: §1 agentes, §8 Bitácora). No edites el PLAN ni nada fuera de `docs/prompts/`.

FUENTES:
- Los transcripts de los subagentes están como JSONL en `C:\Users\m_rubano\AppData\Local\Temp\claude\C--Users-m-rubano-AppData-Roaming-Claude-scratch-workspaces-df7ca0e0-4712-40f6-81ca-d77ad91fa96e-c9abf53e-a6c9-42c3-a048-5ba376a5eb5f-scratch-2026-10-27-acd8df\7768c317-4574-4b7d-927a-fc4213f2d995\tasks\*.output`. Son archivos grandes: **no los leas enteros**. Escribí un script (node o python, guardalo en `C:\Users\m_rubano\FUDO\.tmp\a9\`) que de cada archivo extraiga: el primer mensaje de usuario (= el brief que le mandó el orquestador), los mensajes posteriores del orquestador (feedback/SendMessage, si aparecen como mensajes de usuario), la cantidad de tool calls y el último mensaje del asistente (su reporte final, recortado a ~1.500 caracteres). Algunos archivos pueden ser de agentes todavía en curso: tomá lo que haya y marcalo "en curso al momento de archivar".
- El prompt inicial del usuario: `C:\Users\m_rubano\FUDO\PROMPT-EJECUCION.md`. Además, el usuario agregó en chat (copialo textual): "No esta en el MD pero suma tambien una parte de blog GEO para que responda a las dudas que pueden estar teniendo los usuarios y asi aparecer en las LLM. Suma la en el informe para el post, la idea de generar un MCP para usar estas herraminetas dentro de la propia LLM el sitio ademas, tiene que tener una clara inclinacion a un SEO sin ser generico ni obvio", "no vamos a usar keys de gemini, es simulacion", y más tarde "sigue, hazla menos generica. y termina" y "te paso el logo de fudo, tanto para el video como para el sitio".
- `git -C C:\Users\m_rubano\FUDO log --format="%h %ad %s" --date=iso` para la cronología de construcción.

SALIDA: `C:\Users\m_rubano\FUDO\docs\prompts\LOG.md` (en español) con:
1. **Cómo se trabajó** (½ página): un orquestador (Claude Opus en Claude Code) que lee PLAN.md y delega en subagentes Claude Sonnet con briefs autocontenidos; gates humanos; reglas (no inventar datos, marcar simulado, sin secretos); herramientas usadas (Claude Code, navegador integrado, Playwright, gh, Vercel CLI); y **cómo se manejaron los límites de los planes gratuitos** (sin LLM en runtime, snapshot estático, Vercel Hobby, Places con tier gratis documentado) — sacalo del PLAN y de `docs/research/costos.md`.
2. **Prompts del usuario** (textuales).
3. **Briefs por agente** en orden cronológico: para cada subagente, título (A1a, A1b, A1c, A1d, A2, A2b, A5, …: inferilo del contenido del brief), objetivo en una línea, el brief **completo** dentro de un bloque ```text```, el feedback que recibió (si hubo) y un resumen de 3–5 líneas de lo que devolvió.
4. **Decisiones clave y correcciones** (tabla: fecha · decisión/problema · por qué · dónde quedó), p. ej. D3 sin Gemini, D4 blog GEO + MCP, BR = Deli, FAQPage sin rich result, páginas por ciudad descartadas, riesgo de ToS del snapshot y repo público (G-OK0), fallo de las funciones en Vercel (imports ESM sin `.js`, cwd de la Lambda, `"type": "module"`), rediseño "menos genérico". Sacalo del PLAN (§4, §8 y evidencias) y del git log.
5. **Cronología de commits** (del git log).

Revisá que el LOG no contenga secretos ni tokens (grep de <patrones de claves redactados en este log>), ni datos personales (el email del usuario no tiene que aparecer). Borrá `C:\Users\m_rubano\FUDO\.tmp\a9\` al terminar. No hagas commits (lo hace el orquestador).

**Listo cuando:** `docs/prompts/LOG.md` existe con las 5 secciones, incluye todos los briefs que encontraste completos, y el grep de secretos da vacío. Devolveme la lista de agentes archivados y el tamaño del archivo.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- Es el agente que escribe este archivo. Fuentes usadas: los JSONL de la sesión del orquestador y de cada subagente (los `.output` de la carpeta `tasks` estaban vacíos o eran de procesos auxiliares), `PLAN.md`, `PROMPT-EJECUCION.md`, `docs/research/costos.md` y `git log`.

---

## 4. Decisiones clave y correcciones

Fechas en hora de Argentina. "Dónde quedó" apunta al archivo del repo o a la sección del PLAN.

| Fecha | Decisión / problema | Por qué | Dónde quedó |
|---|---|---|---|
| 26/10 22:45 | **Opción A**: diagnóstico híbrido (datos reales del local + 3–4 preguntas → nota por área → CTA "tu cuenta de Fudo ya viene armada"). Elegida entre 3 herramientas propuestas | El usuario la eligió; el caso es una demo para entrevista, no una solución lista hoy | PLAN §0 |
| 26/10 22:45 | **Los 5 países, no uno**; el país sale de la dirección del local y la IP solo sesga la búsqueda | El usuario objetó limitar a un país: las 80.000 visitas son de todos los países y el caso solo pide filtrar | PLAN §0, §2-G2 |
| 26/10 22:53 | **D1: gateway de datos** con proveedores intercambiables (Snapshot por defecto, GooglePlaces con variable de entorno, Mock) | El informe pide "qué harías después (API, etc.)"; así ya está en el código y la demo usa restaurantes reales | PLAN §4-D1; `docs/adr/0001-gateway-de-datos.md`; `app/src/gateway/` |
| 26/10 22:53 | **D2**: código en GitHub y deploy en Vercel conectado al repo | Lo lee el equipo técnico de Fudo: la estructura del repo es parte de la evaluación | PLAN §4-D2, §2-G3 |
| 26/10 23:00 | **D3: sin keys de Gemini**, todo lo "IA" en runtime es simulación por reglas y plantillas, marcada como simulada | Orden del usuario ("no vamos a usar keys de gemini, es simulacion"); además evita límites del plan gratuito y el uso de datos del tier gratis para mejorar productos | PLAN §4-D3; `docs/adr/0003-scoring-por-reglas.md`; `docs/research/costos.md` §3.3 |
| 26/10 23:00 | **D4: blog GEO + MCP + SEO no genérico** (8 guías que responden preguntas reales del dueño, JSON-LD, `llms.txt`, sitemap, HTML prerenderizado; MCP como idea para el informe) | Pedido del usuario fuera del MD original: aparecer cuando el dueño le pregunta a un LLM | PLAN §4-D4; `docs/research/geo-blog.md`, `mcp.md`; `app/content/blog/`; `docs/adr/0004-blog-prerenderizado-geo.md` |
| 26/10 23:34 | **Brasil se vende como Deli**; el CTA de BR no dice "Fudo" | A1a vio que fu.do enlaza deli.com.br (`pt-br`) con el mismo producto, aunque ninguna página lo afirma textualmente | `app/src/config/countries.json` (`productName`); PLAN G1 evidencia |
| 26/10 23:34 | **"Tu Fudo ya armado" es simulado** | El alta de fu.do no acepta precarga de nombre, horarios ni carta (solo `promotional_code`, `gclid`, `fbclid`, `utm_source`) | PLAN G1 evidencia; copy de la app con badge "simulado" |
| 26/10 23:34 | **Texto chico naranja en `#D03F00`**, no `#FF5023` | Blanco sobre `#FF5023` da 3,27:1, no pasa AA | `docs/research/brand.md`; `app/src/theme/tokens.ts` |
| 26/10 23:25 | **FAQPage ya no da rich result**: se mantiene el JSON-LD y la FAQ visible, sin prometer rich result | Google retiró el rich result de FAQ (7/05/2026) | `docs/research/geo-blog.md`; ADR 0004 |
| 26/10 23:25 | **Páginas programáticas por ciudad descartadas**; fase 1 = 8 guías + ~33–41 páginas curadas | Son doorway pages para Google y chocan con la política de Places que prohíbe guardar datos; con el snapshot salen 0 viables | `docs/research/distribucion.md`; PLAN G1 evidencia |
| 26/10 23:25 | `llms.txt` se publica pero sin esperar impacto | Es una propuesta, no estándar, y Google dice que su buscador no lo usa; cuesta poco | `app/scripts/prerender.ts` (lo genera en el build); ADR 0004 |
| 26/10 23:49 | Comisión de PedidosYa 25–35% de `geo-blog.md` corregida: la guía citada dice 20–30% (y Rappi 18–28%); el 25–35% sale de un medio sin fuente primaria | A2b leyó las fuentes originales; queda como dato **secundario** y sin tarifa oficial | `app/content/blog/comision-pedidosya-rappi-restaurante.md` (`verifyNotes`) |
| 26/10 23:49 | Artículos fiscales marcados "revisión de un contador local pendiente"; fuentes que dieron 403 no sostienen cifras | Honestidad de fuentes (nada inventado) | `app/content/blog/*.md` |
| 26/10 23:20 | **Riesgo de ToS: el snapshot trae datos de la ficha de Google** y el ToS de Maps prohíbe cachear y volver a publicar contenido | Riesgo alto si el repo es público | `docs/research/datos.md` y `costos.md`; ADR 0002; PLAN G1 |
| 27/10 00:13 | Scoring con **"sin datos suficientes"** (si lo legible pesa menos de la mitad) y tope de 60 puntos para un 5,0 con 8 reseñas | La captura de un local con horarios sin leer daba 100/100 en Google | `app/src/domain/scoring.ts`; ADR 0003 |
| 27/10 00:13 | "Todavía no abrí" corta el cuestionario tras la pregunta 1 y rutea a **por abrir** (Consultor de Nuevos Negocios); `descartar` = 4+ locales o rubro "otro" | No frustrar a quien no abrió; los grandes se derivan a ventas | `app/src/domain/leadTier.ts` |
| 27/10 00:13 | "Plata que se escapa por mes": tres componentes, rango ±40%, supuestos **simulados** salvo la comisión de AR | Ticket y pedidos por país no son datos reales; el cálculo se muestra paso a paso | `app/src/domain/moneyLost.ts` |
| 27/10 00:13 | La búsqueda con Places no pide `rating` en la máscara | Subiría al SKU Enterprise y al costo | `app/src/gateway/GooglePlacesProvider.ts`; `docs/research/datos.md` |
| 27/10 00:18 | **G-OK0**: repo `fudo-diagnostico`, **público**, con el riesgo declarado en el ADR 0002 y en el informe (alternativas descartadas: privado con evaluadores invitados; público sin datos de Google) | Lo lee el equipo técnico sin fricción; son datos públicos de 13 negocios, fechados y con fuente; producción usaría la API oficial | PLAN §2-G3 y Bitácora; `docs/adr/0002-snapshot-vs-api.md` |
| 27/10 | Vercel Hobby es no comercial y exige el repo en una cuenta personal | Condiciones del plan; la demo es una zona gris y se declara | `docs/research/costos.md` §5.2 |
| 27/10 00:27 | **Límite de uso del plan de Claude** cortó la sesión; A2 quedó a mitad de un arreglo | Límite del plan | PLAN Bitácora (2026-10-27, G3) |
| 27/10 ~00:25 | **Fallo de `/api/*` en Vercel** (500, `FUNCTION_INVOCATION_FAILED`). Tres causas: (1) `@vercel/node` emite ESM y Node no resuelve imports relativos sin extensión (`ERR_MODULE_NOT_FOUND`); (2) `defaultSnapshotDir()` usaba `process.cwd()`, pero en la Lambda el cwd es `/var/task` y los datos quedan en `/var/task/app/data/snapshots`; (3) `app/vercel.json` tenía un escape `\.` inválido | A2 no pudo probar Vercel sin CLI; el orquestador lo reprodujo con `vercel build --prod` y ejecutando la función con node | Commit `0ef1c93` (imports con `.js`, `with { type: 'json' }`, candidatos de ruta con test, `vercel.json`) |
| 27/10 05:09 | Segundo fallo: el launcher de Vercel no carga ESM en un paquete sin `"type"` | Se declara **`"type": "module"`** (todos los configs ya eran ESM), Node 22.x como en CI y los handlers pasan a la firma `export GET/POST(request)` | Commit `84ca323`; `app/package.json`, `app/api/*` |
| 27/10 | 3 bugs menores de la verificación: recomendación "vendés solo por apps" aunque se marcó mostrador; `place_selected.from_suggestion` en `false` al elegir un chip; `/debug` heredaba el `<title>` de la home | Hallazgos del orquestador al recorrer el flujo en 375 y 1280 | Pedidos a A2 (interrumpido) y luego a A5 (bug de cada punto en el brief); corregidos en el commit `9a0f085` |
| 27/10 04:56 | **Rediseño "menos genérico"**: logo real de Fudo, hero desde la escena del cliente, ticket de ejemplo real del snapshot, resultado como comanda, comparación con vecinos, voz por país (voseo AR, tuteo MX/CL/CO), landings /ar /mx /cl /co | Pedido del usuario ("sigue, hazla menos generica. y termina"): parecía una plantilla SaaS cualquiera | Brief de A5 (sección 3); resultado pendiente |
| 27/10 | **Logo oficial de Fudo** en `app/public/brand/` (para el sitio y el video) | El usuario lo aportó ("te paso el logo de fudo, tanto para el video como para el sitio"); para BR se muestra "Deli" en texto | `app/public/brand/` (sin commitear al archivar) |

---

## 5. Cronología de commits

Salida de `git log --format="%h %ad %s" --date=iso` (del más viejo al más nuevo; la hora incluye la zona -0300). No incluye el trabajo sin commitear al momento de archivar (A5, logo).

| Hash | Fecha | Mensaje |
|---|---|---|
| `a971f05` | 2026-10-26 23:54:49 -0300 | chore: scaffold Vite + React + TS strict + Tailwind, ESLint, Prettier, Vitest |
| `6a8c11c` | 2026-10-26 23:54:50 -0300 | docs: plan del proyecto, investigacion G1 y snapshot de 13 locales reales |
| `b8ed1dc` | 2026-10-26 23:55:02 -0300 | feat(gateway): PlaceDataProvider con Snapshot, GooglePlaces, Mock y fallback |
| `a27ffd3` | 2026-10-26 23:55:03 -0300 | feat(domain): scoring por reglas, leadTier, plata perdida y recomendaciones por pais |
| `959a29a` | 2026-10-26 23:55:04 -0300 | test: domain y gateway (snapshot real, mock, Places con fixture ficticio, fallback) |
| `8c31ab9` | 2026-10-27 00:07:41 -0300 | feat(analytics): eventos diag_start..cta_click en localStorage y copy centralizado |
| `5d07c2d` | 2026-10-27 00:07:42 -0300 | feat(ui): flujo mobile-first hero, confirmacion, 4 preguntas, resultado y ruteo por tier |
| `7d146aa` | 2026-10-27 00:07:46 -0300 | feat(blog): prerender a HTML estatico de las guias GEO, sitemap, llms.txt y robots |
| `57af4ba` | 2026-10-27 00:08:32 -0300 | docs(blog): 8 guias GEO en borrador (AR x3, MX x3, CL, CO) con fuentes y pendientes de verificar |
| `74117c1` | 2026-10-27 00:10:01 -0300 | docs: README, ARCHITECTURE y 4 ADR (gateway, snapshot vs API, scoring por reglas, blog GEO) + CI |
| `9830c1b` | 2026-10-27 00:17:59 -0300 | docs(plan): cerrar G1 y G2 con evidencia y bugs para QA |
| `1dd84ff` | 2026-10-27 00:18:41 -0300 | docs(plan): registrar G-OK0 (repo público fudo-diagnostico) |
| `0ef1c93` | 2026-10-27 05:00:41 -0300 | fix(api): imports ESM con extensión .js y ruta de snapshots en Vercel |
| `84ca323` | 2026-10-27 05:09:51 -0300 | fix(api): ESM declarado y handlers GET/POST para el runtime de Vercel |
| `9a0f085` | 2026-10-27 05:18:20 -0300 | fix: delivery según canales marcados, from_suggestion con chips y título propio en /debug |
| `2e1ac08` | 2026-10-27 05:20:44 -0300 | feat(domain): comparación con vecinos reales y vidriera por país |

Total: 16 commits.
