# Log de prompts — Caso Fudo: Diagnóstico + Tu Fudo ya armado

> Entregable pedido por el caso: "los prompts o el historial de conversación con la IA que usaste".
> Archivado por A9 (Archivista de prompts). **Segunda versión**, escrita al cierre (G8) el 2026-10-27 11:07 (-03). La primera cubría hasta el rediseño; esta suma QA, dueños simulados, la iteración, el informe, el guion y los gates G-OK1 y G-OK2. Los briefs y los prompts del usuario están **textuales**, copiados de los transcripts de las sesiones. Los resúmenes de cada agente son míos y están marcados como tales.
> Horarios en hora de Argentina (UTC-3), la misma zona del repo y del PLAN.
> Una sola redacción: en los briefs de A2, A5 (las dos iteraciones) y A9 aparecen los patrones del comando de búsqueda de secretos; los reemplacé por `<patrones de claves redactados>` para que este archivo pase su propio chequeo. Todo lo demás es literal.
> Cada brief que recibió un subagente llegó con un recordatorio del harness (entregar el reporte por `SubagentHandback`) agregado como segundo mensaje, y algunos cargaron una skill (webapp-testing, docx); no es parte del brief y no se transcribe.
> Los bloques usan cercas de cuatro acentos graves porque varios briefs contienen bloques de código.

## Índice
1. [Cómo se trabajó](#1-cómo-se-trabajó)
2. [Prompts del usuario](#2-prompts-del-usuario)
3. [Briefs por agente](#3-briefs-por-agente-orden-cronológico)
4. [Decisiones clave y correcciones](#4-decisiones-clave-y-correcciones)
5. [Cronología de commits](#5-cronología-de-commits)

---

## 1. Cómo se trabajó

**Esquema.** Un **orquestador** (Claude Opus en Claude Code) lee `PLAN.md` —la única fuente de verdad: norte, goals G1–G8, agentes A1–A9, estructura del repo, gates— y no escribe el código grande: delega, revisa, integra, actualiza el PLAN y hace los commits. Cada goal se delega a **subagentes Claude Sonnet** (`model: "sonnet"`) con **briefs autocontenidos**: ruta del PLAN, el goal, rutas de entrada y salida, regla de oro y criterio "Listo cuando". Corrieron en paralelo los cuatro investigadores (A1a–A1d), el constructor y el redactor del blog (A2, A2b), el QA y los cuatro dueños simulados (A3, A4 ×4), y la iteración, el informe y el guion (A5, A6, A7). Los **dueños simulados (A4) recibieron solo una persona y la URL**: nada del proyecto, de Fudo ni del caso. Antes de dar un goal por cerrado, el orquestador verifica el criterio él mismo (abre archivos, corre tests, mira la app en 375 y 1280 px) y, si falta algo, devuelve el trabajo con feedback concreto (`SendMessage`). Cuando un subagente no puede hacer algo (A3 no pudo escribir su informe), no lo fuerza: el orquestador recibe el texto y lo guarda.

**Gates humanos.** El orquestador se detiene y pregunta en G-OK0 (nombre y visibilidad del repo), G-OK1 (app final), G-OK2 (guion) y G-OK3 (entrega). Pasaron G-OK0 (repo `fudo-diagnostico`, público, con el riesgo de ToS declarado), **G-OK2** (guion aprobado) y **G-OK1** (app aprobada con dos cambios finales). Falta G-OK3. Las credenciales nunca las escribe un agente: el orquestador instaló `gh` y `vercel`, y el usuario hizo el login.

**Reglas permanentes.** (1) No inventar datos: lo real lleva fuente y fecha de captura (`provenance`), lo simulado se marca como simulado, lo no encontrado dice "no encontrado". (2) Cero secretos en el repo: `.env.example` documentado y `git grep` de claves antes de cada commit. (3) Todo dentro de `C:\Users\m_rubano\FUDO\`. (4) Los subagentes no editan el PLAN. (5) Responsive obligatorio (360, 375, 768, 1024, 1280 px, sin scroll horizontal, objetivos táctiles ≥44 px) y código fácil de tocar para el cambio en vivo de 15 minutos. (6) Los dueños simulados no conocen el proyecto.

**Herramientas.** Claude Code (sesiones de orquestador y subagentes), navegador integrado de Claude (captura del snapshot y verificación visual), WebSearch/WebFetch, Playwright (241 capturas de A2, recorridos de A3, A4 y A5) y axe-core (accesibilidad), Lighthouse móvil (A3), Vite + React + TypeScript + Tailwind, Vitest (177 tests al cierre), ESLint/Prettier, GitHub Actions (CI), `gh` 2.103.3 y Vercel CLI 65.3.1. Skills: `webapp-testing` (QA), `docx` (informe, exportado con Word lanzado desde PowerShell), `ui-ux-pro-max` (sugerida en el rediseño) y una skill propia, `escritura-humana`, creada para este proyecto porque no había ninguna en el catálogo. Pensados y no ejecutados: Remotion y el conector de ElevenLabs (video recortado).

**Cómo se manejaron los límites de los planes gratuitos** (detalle y fuentes en `docs/research/costos.md`, §5–§6):

| Servicio | Límite del plan gratuito | Qué hicimos |
|---|---|---|
| LLM (Gemini) | Tier gratis con límites que solo se ven en AI Studio; los datos del tier gratis se usan para mejorar productos | **Sin LLM en runtime (D3).** Recomendaciones por reglas y plantillas, marcadas como simuladas. Si se activa en producción: tier pago, razonamiento mínimo y sin mandar contenido de Places |
| Google Places | Topes gratis por SKU desde marzo 2025: Text Search Pro 5.000/mes, **Place Details Enterprise 1.000/mes** (cuello de botella); requiere cuenta de facturación | La demo corre con **snapshot estático** fechado (USD 0, sin key). Places está implementado detrás de `DATA_SOURCE=places`; para activarlo: cuota diaria, alerta de presupuesto en USD 1, key restringida, límite por IP y **fallback automático al snapshot** si hay error o 429. Costo documentado: USD 0,057 por diagnóstico; los primeros 1.000 por mes salen USD 0. Como la demo solo cubre 13 locales, el buscador de texto se sacó de la UI y se reemplazó por tarjetas de los locales reales |
| Vercel Hobby | 1 M de invocaciones, 100 GB de transferencia, 300 s por función, 100 deploys por día; **uso no comercial**; al pasarse se pausa 30 días (no cobra); Git solo con cuentas personales | Sin dependencia de LLM, snapshot estático, un solo proyecto y un solo repo bajo cuenta personal; PageSpeed con timeout corto; README e informe aclaran que es una demo no comercial y que producción va en Pro |
| GitHub Free | Actions gratis en repos públicos | Un solo workflow `ci.yml` (lint + typecheck + test + build) con caché y `concurrency` |
| ElevenLabs | Cuenta con créditos y permisos de voz propios | La generación de voz **falló en todos los intentos** (modelos v4 y multilingual_v2, e incluso con una sola frase): problema de la cuenta, no del guion. El usuario recortó el video; no se usó una voz de reemplazo |
| Plan de uso de Claude | Un límite de uso cortó la sesión dos veces: el 27/10 a las 00:27 (con A2 a mitad de un arreglo) y el 27/10 antes de las 09:51 (con A5 y A6 en marcha) | Se detuvo o se pausó el trabajo, se dejó el estado anotado en la Bitácora del PLAN y se retomó al renovarse el límite, con `SendMessage` a los agentes ("seguí donde quedaste, leé `git status` y `git log`") |

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
| 27/10, ~05:10 | "te paso el logo de fudo, tanto para el video como para el sitio" (no figura como texto en los transcripts archivados; es textual según el orquestador. Hora inferida: el brief de A5 de las 05:12 ya cita el logo en `app/public/brand/`) |
| 27/10, 06:47 | Respuesta al gate G-OK2 (guion de 77 s): la opción elegida es "Aprobado (Recomendado)" |
| 27/10, 09:51 | "I hit my usage limit while you were working, but it has reset now. Please continue from where you left off." |
| 27/10, 10:39 | Respuesta al gate G-OK1 (pregunta 1, app final): "si, esta aprobada, lo unico me gustaria que el hero sea dinamico, Viernes 21:30. Alguien busca “pizza en Lanús”. alguien busca taqueria en mexico, restaurant en peru etc. , luego elimina la barra de busqueda ya que no funciona, no busca locales reales" |
| 27/10, 10:39 | Respuesta sobre la voz del video (pregunta 2): "si no creaste aun el video no lo crees, solo termina la app y dame el informe , pon una skill de escritura humana" |

Los dos últimos mensajes responden a un gate con dos preguntas: aprobar la app final (G-OK1) y cómo seguir con el audio del video cuando ElevenLabs falla. Las opciones que se le ofrecieron eran subtítulos ahora, revisar ElevenLabs o usar la voz local de Windows; el usuario eligió escribir su propia respuesta. La elección entre las 3 herramientas del primer análisis (opción A, diagnóstico híbrido) y los demás puntos de decisión se resumen en la sección 4.

---

## 3. Briefs por agente (orden cronológico)

Cada bloque trae: objetivo, métricas de la corrida (tool calls y duración, sacadas del transcript), el brief **completo** que envió el orquestador, el feedback posterior (si hubo) y un resumen de lo que devolvió. Los resúmenes son míos, tomados del reporte final de cada agente.

**Agentes archivados (16 corridas):** A1a, A1b, A1c, A1d, A2, A2b, A5 (iteración 1), A9, A3, A4 ×4 (Rubén, Mariana, Andrés, Sofía), A5 (iteración 2), A6, A7. No hay A8: el video se recortó.

| Agente | Lanzado (-03) | Tool calls | Duración | Estado al archivar |
|---|---|---|---|---|
| A1a | 2026-10-26 23:02 (-03) | 153 | ~31 min | terminado |
| A1b | 2026-10-26 23:02 (-03) | 108 | ~26 min | terminado |
| A1c | 2026-10-26 23:02 (-03) | 80 | ~18 min | terminado |
| A1d | 2026-10-26 23:02 (-03) | 115 | ~22 min | terminado |
| A2 | 2026-10-26 23:36 (-03) | 126 | ~52 min | interrumpido por límite de uso (reporte parcial entregado) |
| A2b | 2026-10-26 23:36 (-03) | 90 | ~13 min | terminado |
| A5 (it. 1) | 2026-10-27 05:12 (-03) | 97 | ~33 min | terminado |
| A9 | 2026-10-27 05:12 (-03) | 47 | ~350 min | en curso (esta actualización) |
| A3 | 2026-10-27 05:50 (-03) | 200 | ~38 min | terminado |
| A4 Rubén | 2026-10-27 05:50 (-03) | 31 | ~16 min | terminado |
| A4 Mariana | 2026-10-27 05:50 (-03) | 43 | ~17 min | terminado |
| A4 Andrés | 2026-10-27 05:50 (-03) | 47 | ~19 min | terminado |
| A4 Sofía | 2026-10-27 05:50 (-03) | 51 | ~20 min | terminado |
| A5 (it. 2) | 2026-10-27 06:30 (-03) | 160 | ~266 min | terminado |
| A6 | 2026-10-27 06:31 (-03) | 101 | ~270 min | devolvió 2 versiones; ajuste de 170 a 177 tests confirmado (PDF en 2 páginas) |
| A7 | 2026-10-27 06:31 (-03) | 49 | ~10 min | terminado |

Nota sobre la duración de A5 (iteración 2) y A6: incluye las horas en que la sesión estuvo frenada por el límite de uso, no es tiempo de trabajo.

### A1a · Investigador: marca, países, herramientas de Fudo, benchmark

- **Objetivo:** Sacar de fu.do los tokens exactos de marca y armar la tabla de países (moneda, ente fiscal, apps de delivery, planes, URL de alta), más el catálogo de herramientas de Fudo y un benchmark de graders.
- **Salidas:** `docs/research/brand.md`, `paises.md`, `fudo-tools.md`, `benchmark.md`, `app/src/config/countries.json`
- **Corrida:** lanzado 2026-10-26 23:02 (-03); 153 tool calls registrados; ~31 min.

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
- **Corrida:** lanzado 2026-10-26 23:02 (-03); 108 tool calls registrados; ~26 min.

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
- **Corrida:** lanzado 2026-10-26 23:02 (-03); 80 tool calls registrados; ~18 min.

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
- **Corrida:** lanzado 2026-10-26 23:02 (-03); 115 tool calls registrados; ~22 min.

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
- **Corrida:** lanzado 2026-10-26 23:36 (-03); 126 tool calls registrados; ~52 min.

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
- **Corrida:** lanzado 2026-10-26 23:36 (-03); 90 tool calls registrados; ~13 min.

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

### A5 · Constructor (iteración 1): rediseño "menos genérico", landings por país y 3 bugs

- **Objetivo:** Rehacer la cara de la app a pedido del dueño ("hacela menos genérica"): logo real, hero desde la escena del cliente, ticket de ejemplo real, resultado como comanda, comparación con vecinos, voz por país, landings /ar /mx /cl /co y 3 bugs menores.
- **Salidas:** `app/` (UI, copy, dominio, prerender), README/ARCHITECTURE
- **Corrida:** lanzado 2026-10-27 05:12 (-03); 97 tool calls registrados; ~33 min.

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

- 7 commits en `main` (`9a0f085` a `b90ff5c`); tests de 65 a **105** (vecinos, vidriera, voz por país, landings). Lint, typecheck, test y build en verde.
- Marca: header y pie azul noche con el logo oficial y "demo · no oficial" (Deli en texto para BR), favicon con la F. Hero desde la escena "Viernes 21:30", ticket de ejemplo leído del snapshot, resultado como comanda con las áreas en lenguaje de dueño.
- Dominio: `compareWithNeighbors` (función pura, `null` si no hay pares) y vidriera por país; voz por país en `copy.ts` (voseo AR, tuteo MX/CL/CO) con un objeto base y overrides. Las recomendaciones pasaron a `copy.ts`.
- Landings `/ar/ /mx/ /cl/ /co/` prerenderizadas con `hreflang`, JSON-LD `WebApplication` + `BreadcrumbList`, sitemap y `llms.txt`. Corrigió los 3 bugs menores. 0 px de scroll horizontal en 5 anchos y axe limpio.
- Avisó dos límites: CO y BR no muestran vecinos (un solo local con datos) y agregó `ar|mx|cl|co` a la exclusión del rewrite de `app/vercel.json`.

---

### A9 · Archivista de prompts (este documento)

- **Objetivo:** Reconstruir el historial de prompts y briefs en `docs/prompts/LOG.md` y, al cierre (G8), actualizarlo con todo lo posterior.
- **Salidas:** `docs/prompts/LOG.md`
- **Corrida:** lanzado 2026-10-27 05:12 (-03); 47 tool calls registrados; ~350 min.

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

1. (2026-10-27 11:01 (-03)) del orquestador, al cierre del proyecto (G8): este mensaje pidió la segunda versión del log:

````text
Toca cerrar el log (G8). Actualizá `C:\Users\m_rubano\FUDO\docs\prompts\LOG.md` con todo lo que pasó después de tu versión, con el mismo formato y las mismas reglas (sin secretos, sin el email del usuario, grep final vacío):
- Prompts del usuario nuevos, textuales: "te paso el logo de fudo, tanto para el video como para el sitio"; respuesta a G-OK2: "Aprobado"; "I hit my usage limit while you were working, but it has reset now. Please continue from where you left off."; respuesta a G-OK1: "si, esta aprobada, lo unico me gustaria que el hero sea dinamico, Viernes 21:30. Alguien busca “pizza en Lanús”. alguien busca taqueria en mexico, restaurant en peru etc. , luego elimina la barra de busqueda ya que no funciona, no busca locales reales" y sobre la voz: "si no creaste aun el video no lo crees, solo termina la app y dame el informe , pon una skill de escritura humana".
- Briefs nuevos completos (sacalos de los transcripts en `~/.claude/projects/C--Users-m-rubano-FUDO/7768c317-4574-4b7d-927a-fc4213f2d995/subagents/agent-*.jsonl`, como hiciste antes): A5 rediseño "menos genérico" (completar resumen), A3 QA, A4 ×4 (Rubén, Mariana, Andrés, Sofía: aclarar que recibieron solo persona + URL), A5 iteración con feedback (+ los SendMessage de seguimiento: retomar tras límite, hero dinámico y sacar buscador), A6 informe (+ seguimiento: retomar, reescritura con skill escritura-humana, 170→177), A7 guion, y tu propio brief (A9).
- Decisiones/correcciones nuevas en la tabla: G-OK2 guion aprobado; ElevenLabs falló en todas las generaciones (v4, multilingual_v2 e incluso 1 frase) → problema de cuenta; Matías recortó el video; G-OK1 app aprobada con hero dinámico (solo los 5 países de Fudo: Perú no está en el caso) y sin buscador (tarjetas de los 13 locales; Places en producción); skill `.claude/skills/escritura-humana` creada porque no había una en el catálogo; A3 no pudo escribir su archivo y el orquestador lo guardó; los dueños simulados dieron 6/5/5/4 y ninguno crearía cuenta (alta simulada) → primer pedido a producto.
- Cronología de commits actualizada (`git log`).
Usá un script en `C:\Users\m_rubano\FUDO\.tmp\a9\` y borralo al final. No hagas commits. Devolveme tamaño y lista de agentes archivados.
````

**Qué devolvió (resumen mío):**

- Primera versión entregada y commiteada por el orquestador (`87d04aa`). Esta es la segunda versión: suma A3, A4 ×4, A5 (iteración 2), A6 y A7, los prompts nuevos del usuario, las decisiones posteriores y la cronología de commits completa.
- Fuentes: los JSONL de la sesión del orquestador y de cada subagente (los `.output` de la carpeta `tasks` estaban vacíos o eran de procesos auxiliares), `PLAN.md`, `PROMPT-EJECUCION.md`, `docs/research/costos.md` y `git log`.

---

### A3 · QA responsive y funcional (G4)

- **Objetivo:** Recorrer la app en producción en 360/375/768/1024/1280 con capturas, medir overflow, contraste, errores, teclado, los 4 ruteos y un local real por país, y entregar `docs/qa/report.md`.
- **Salidas:** `docs/qa/report.md`, `docs/qa/screenshots/`
- **Corrida:** lanzado 2026-10-27 05:50 (-03); 200 tool calls registrados; ~38 min.

**Brief (completo):**

````text
Sos A3 (QA responsive y funcional) del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". Leé `C:\Users\m_rubano\FUDO\PLAN.md` (§2-G2 requisitos y §2-G4 completo; no lo edites) y el `README.md`. App en producción: https://fudo-diagnostico.vercel.app (código en `C:\Users\m_rubano\FUDO\app\`, no lo modifiques: vos reportás, otro agente arregla).

CHECKLIST G4 (todo con navegador real; usá Playwright, ya instalado — skill `webapp-testing` — y axe-core):
1. Flujo completo en **375 / 768 / 1280** con capturas de cada paso → `C:\Users\m_rubano\FUDO\docs\qa\screenshots\` (nombres `<ancho>-<caso>-<paso>.png`; comprimí a PNG razonables, que la carpeta no pase de ~15 MB en total; elegí las capturas que documentan, no 200).
2. Revisá: scroll horizontal (también 360 y 1024), solapamientos, cortes de texto, contraste AA (axe), estados de carga, **errores**: local no encontrado (p. ej. "La Parrilla de Tito"), búsqueda con 1 letra, proveedor caído (simulalo bloqueando `/api/*` con `page.route` y mirá qué ve el usuario), doble click en botones, volver atrás en el navegador en medio del cuestionario, recarga en el resultado. **Teclado**: todo el flujo sin mouse, foco visible, orden lógico, Escape cierra el modal.
3. Los **4 ruteos**: caliente, switcher (cobra "con otro sistema"), nutrir (poco volumen / sin delivery), por-abrir ("Todavía no abrí"), más descartar (4+ locales). Y **al menos un local real por país** (AR, MX, CL, CO, BR: el de BR tiene que decir "Deli", no "Fudo", y avisar que el portugués está fuera de alcance). Voz: voseo en AR, tuteo en MX/CL/CO.
4. Landings `/ar/ /mx/ /cl/ /co/`, `/blog/` y 2 artículos: que el HTML sin JS traiga el contenido (`curl`), JSON-LD válido (parsealo), canonical, `hreflang`, `sitemap.xml` con todas las URLs y que todas devuelvan 200, `robots.txt`, `llms.txt`. Links internos rotos (crawl simple de todas las URLs del sitemap y sus links internos).
5. Datos: que cada dato real muestre su badge "real · capturado el 26/10/2026", que lo simulado diga simulado, que los números del ticket de un local coincidan con su JSON en `app/data/snapshots/`. Panel `/debug` registra los eventos del recorrido.
6. Performance básica: tamaño del JS, Lighthouse si podés correrlo (npx lighthouse con Chrome de Playwright), o al menos tiempos de carga.

SALIDA: `C:\Users\m_rubano\FUDO\docs\qa\report.md` en español: resumen ejecutivo, matriz (caso × ancho → ok/bug), lista de bugs con **severidad (bloqueante / alta / media / baja)**, pasos para reproducir, captura, y sugerencia de arreglo (archivo probable). Separá bugs de "mejoras sugeridas". No hagas commits.

**Listo cuando:** el reporte cubre los 6 puntos con evidencia y las capturas están en `docs/qa/screenshots/`. Devolveme la lista de bugs por severidad (una línea cada uno).
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- 200 tool calls (Playwright + axe-core + Lighthouse móvil + curl). **Sin bugs bloqueantes**; 1 alta y 8 medias para arreglar antes de la entrevista (doble clic, atrás/recarga en el resultado, texto largo en el buscador, ruteo "por abrir", tuteo mezclado en MX/CL/CO, jerga interna, etc.). Los 3 bugs menores del G2 ya estaban corregidos.
- Los 13 locales muestran en el ticket los números de su JSON (0 diferencias) con el badge "real · capturado el 26/10/2026"; lo simulado dice "simulado". Lighthouse móvil: performance 84 (home), 81 (`/ar/`), 89 (artículo); accesibilidad 98–100.
- **No pudo escribir `docs/qa/report.md`**: la herramienta Write rechazó el archivo ("los subagentes devuelven los hallazgos como texto"). No lo escribió por otro camino: devolvió el informe completo como texto y **el orquestador lo guardó** (commit `b2f69b4`). Las ~115 capturas sí quedaron en `docs/qa/screenshots/`.

---

### A4 · Dueño simulado P1: Rubén (pizzería, Lanús, AR)

- **Objetivo:** Hacer de Rubén, 52, pizzería en Lanús, desconfiado, y recorrer la app en el celular. Recibió **solo la persona y la URL**, sin contexto del proyecto, de Fudo ni del caso.
- **Salidas:** Informe de la persona (el orquestador lo guardó en `docs/feedback/`)
- **Corrida:** lanzado 2026-10-27 05:50 (-03); 31 tool calls registrados; ~16 min.

**Brief (completo):**

````text
Vas a hacer de una persona real usando una página web por primera vez. Quedate en el personaje todo el tiempo.

**Quién sos:** Rubén, 52 años. Tenés una pizzería en Lanús, provincia de Buenos Aires (Argentina): "El Campeón de la Pizza", un solo local. Vendés mucho por PedidosYa y también en el mostrador. Facturás a mano. Sos desconfiado: ya te quisieron vender de todo, odiás que te pidan datos y no creés en números que salen de la nada. No sos de la tecnología; usás el celular.

**La página:** https://fudo-diagnostico.vercel.app — un conocido te pasó el link por WhatsApp.

**Cómo hacerlo:** abrí la página con un navegador real automatizado (Playwright con Python o Node, ya instalado en la máquina; usá viewport de celular 375×812). Recorrela como lo haría Rubén: leé lo que aparece, buscá tu local, respondé las preguntas con la verdad de Rubén, mirá el resultado, abrí lo que te dé curiosidad y decidí si harías clic en lo que te propone. Si te ayuda, sacá capturas en una carpeta temporal tuya (no dentro de ninguna carpeta de proyecto) y miralas. No envíes datos personales reales a ningún formulario (si te pide un email, usá rubén@example.com y no hace falta enviarlo).

**Devolveme (en primera persona, como Rubén, en español rioplatense):**
1. Recorrido pensado en voz alta, paso por paso (qué viste, qué pensaste, qué hiciste).
2. Fricciones: en qué paso exacto y por qué.
3. Objeciones que te quedan.
4. ¿Crearías la cuenta? Sí / no / por qué.
5. Nota del 1 al 10.
6. La frase exacta de la página que más te convenció y la que más te espantó (citala textual).
7. ¿Le creíste al número de plata que "se te escapa"? ¿Por qué?
Al final, fuera del personaje, 3 líneas con los problemas concretos de la página que encontraste (texto, botones, cosas que no anduvieron).
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- Nota **6/10**; **no crearía la cuenta hoy** (el botón es una simulación). Le llegó el "Viernes 21:30" y le gustó que no pida datos; le asustó ver su propio local en la portada antes de entender que son datos públicos.
- Le creyó "a medias" al número de plata perdida: la lógica sí (comisión 25–35%, merma por cobro a mano), el total no (arranca de 4.000 pedidos estimados por reseñas). Valoró que el desplegable muestre la cuenta y los supuestos.
- Frase que lo convenció: "Estimación simulada con supuestos propios de la demo, no un dato real de tu negocio." La que lo espantó: "Hoy el alta de fu.do no acepta precarga de datos, así que este botón es una simulación."
- Bugs: la búsqueda devuelve locales de otros países sin avisar que no encontró el suyo; "× ×1" en la cuenta; nombre pegado al badge ("El Campeón De La Pizzavos"); infiere "canal propio: No" sin preguntarlo.

---

### A4 · Dueño simulado P2: Mariana (taquería, 2 sucursales, CDMX, MX)

- **Objetivo:** Hacer de Mariana, 34, taquería con 2 sucursales en CDMX que usa otro POS, y recorrer la app en celular y escritorio. Recibió **solo la persona y la URL**.
- **Salidas:** Informe de la persona (guardado en `docs/feedback/`)
- **Corrida:** lanzado 2026-10-27 05:50 (-03); 43 tool calls registrados; ~17 min.

**Brief (completo):**

````text
Vas a hacer de una persona real usando una página web por primera vez. Quedate en el personaje todo el tiempo.

**Quién sos:** Mariana, 34 años. Tenés una taquería en Ciudad de México: "Tacos Hola El Güero", con 2 sucursales. Ya usas otro sistema de punto de venta (Soft Restaurant) y lo pagas cada mes; cambiarlo te da flojera y miedo de perder tus datos y de tener problemas con la facturación del SAT. Vendes en el local y un poco por apps. Eres práctica: si algo te sirve lo usas, si te hace perder tiempo te vas.

**La página:** https://fudo-diagnostico.vercel.app — te apareció buscando en Google.

**Cómo hacerlo:** abre la página con un navegador real automatizado (Playwright con Python o Node, ya instalado en la máquina; viewport de celular 375×812 y luego mírala también en computadora 1280×800). Recórrela como lo haría Mariana: lee, busca tu taquería, responde las preguntas con la verdad de Mariana, mira el resultado, abre lo que te dé curiosidad y decide si harías clic en lo que te propone. Si te ayuda, saca capturas en una carpeta temporal tuya (no dentro de ninguna carpeta de proyecto). No envíes datos personales reales (si pide email, usa mariana@example.com sin enviarlo).

**Devuélveme (en primera persona, como Mariana, en español de México):**
1. Recorrido pensado en voz alta, paso por paso.
2. Fricciones: en qué paso exacto y por qué.
3. Objeciones para cambiarte de sistema que te quedan (y si la página las contesta).
4. ¿Crearías la cuenta? Sí / no / por qué.
5. Calificación del 1 al 10.
6. La frase exacta de la página que más te convenció y la que más te espantó (cítala textual).
7. ¿Sentiste que la página entendía que ya tienes un sistema?
Al final, fuera del personaje, 3 líneas con los problemas concretos de la página que encontraste.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- Nota **5/10**; no crearía la cuenta (el alta es simulada y no resuelve su miedo: facturar con el SAT sin perder datos al migrar). Se sintió switcher con el bloque "Ya tienes un sistema, así que lo que importa es no perder lo que cargaste"; la guía de Soft Restaurant le pareció muy buena.
- Objeciones: la raíz está en argentino ("pizza en Lanús", voseo) y mezcla tuteo con voseo; no hay "Taquería" en la pregunta 1; no le pregunta cuál sistema usa; la comparación "4 de 4" usa locales no comparables.
- Bugs: "Tacos Hola El Güerotú" (tú pegado al nombre), separador de miles inconsistente, jerga interna "Switcher" visible, notas internas ("Borrador de demo") en las guías.

---

### A4 · Dueño simulado P3: Andrés (dark kitchen, Bogotá, CO)

- **Objetivo:** Hacer de Andrés, 29, dark kitchen en Bogotá que vende solo por apps, y recorrer la app en el celular. Recibió **solo la persona y la URL**.
- **Salidas:** Informe de la persona (guardado en `docs/feedback/`)
- **Corrida:** lanzado 2026-10-27 05:50 (-03); 47 tool calls registrados; ~19 min.

**Brief (completo):**

````text
Vas a hacer de una persona real usando una página web por primera vez. Quedate en el personaje todo el tiempo.

**Quién sos:** Andrés, 29 años. Tienes una dark kitchen en Bogotá (Colombia): "Come Como en Casa". No hay salón: vendes solo por apps (Rappi sobre todo). Un solo local. Cobras lo que te paga la app y llevas las cuentas en Excel. Eres joven, rápido con el celular, impaciente, y te molesta cuando las herramientas asumen que tienes mesas y meseros.

**La página:** https://fudo-diagnostico.vercel.app — la viste en un grupo de emprendedores gastronómicos.

**Cómo hacerlo:** abre la página con un navegador real automatizado (Playwright con Python o Node, ya instalado en la máquina; viewport de celular 375×812). Recórrela como lo haría Andrés: busca tu negocio, responde con la verdad de Andrés, mira el resultado, abre lo que te dé curiosidad y decide si harías clic en lo que te propone. Si te ayuda, saca capturas en una carpeta temporal tuya (no dentro de ninguna carpeta de proyecto). No envíes datos personales reales (si pide email, usa andres@example.com sin enviarlo).

**Devuélveme (en primera persona, como Andrés, en español de Colombia):**
1. Recorrido pensado en voz alta, paso por paso.
2. Fricciones: en qué paso exacto y por qué.
3. Objeciones que te quedan.
4. ¿Crearías la cuenta? Sí / no / por qué.
5. Calificación del 1 al 10.
6. La frase exacta de la página que más te convenció y la que más te espantó (cítala textual).
7. ¿Sentiste que era para un negocio como el tuyo o para un restaurante con salón?
Al final, fuera del personaje, 3 líneas con los problemas concretos de la página que encontraste.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- Nota **5/10**; no crearía la cuenta. Lo retuvo "Sin tarjeta y sin registro" y encontrar su local a la primera; marcó "Dark kitchen (solo delivery)" y pensó "alguien pensó en mí".
- Pero se sintió en una app pensada para un restaurante con salón y otro país: la pregunta 3 asume que cobra y factura él ("me paga la app" no existe), recomienda "Deja de cobrar y facturar a mano (DIAN)" y lo compara con una tienda mixta de Medellín.
- Bugs: ejemplo, voseo y comisiones de Argentina en la home y el cálculo; "NO LO PUDIMOS LEER" repetido pero igual da nota general 62/100; 1.000 pedidos en el cálculo y 400/1.500/4.000 en los supuestos; el pie expone "/debug".

---

### A4 · Dueño simulado P4: Sofía (por abrir una cafetería, Santiago, CL)

- **Objetivo:** Hacer de Sofía, 26, "estoy por abrir una cafetería", y ver si la app la descarta bien hacia el Consultor sin frustrarla. Recibió **solo la persona y la URL**.
- **Salidas:** Informe de la persona (guardado en `docs/feedback/`)
- **Corrida:** lanzado 2026-10-27 05:50 (-03); 51 tool calls registrados; ~20 min.

**Brief (completo):**

````text
Vas a hacer de una persona real usando una página web por primera vez. Quedate en el personaje todo el tiempo.

**Quién sos:** Sofía, 26 años. Estás por abrir tu primera cafetería en Santiago de Chile (Providencia), todavía sin local abierto: tienes el nombre pensado ("Café Lumbre") y estás averiguando todo — permisos, boleta electrónica, qué sistema usar. Te entusiasma el proyecto pero te frustra cuando las herramientas te tratan como si ya tuvieras un negocio andando.

**La página:** https://fudo-diagnostico.vercel.app — te la recomendó una amiga.

**Cómo hacerlo:** abre la página con un navegador real automatizado (Playwright con Python o Node, ya instalado en la máquina; viewport de celular 375×812). Recórrela como lo haría Sofía: intenta buscar tu cafetería, responde con la verdad de Sofía, mira a dónde te lleva, abre lo que te dé curiosidad y decide si harías clic en lo que te propone. Si te ayuda, saca capturas en una carpeta temporal tuya (no dentro de ninguna carpeta de proyecto). No envíes datos personales reales (si pide email, usa sofia@example.com sin enviarlo).

**Devuélveme (en primera persona, como Sofía, en español de Chile):**
1. Recorrido pensado en voz alta, paso por paso.
2. Fricciones: en qué paso exacto y por qué.
3. Objeciones o dudas que te quedan.
4. ¿Harías clic en lo que te propone al final? Sí / no / por qué.
5. Calificación del 1 al 10.
6. La frase exacta de la página que más te convenció y la que más te frustró (cítala textual).
7. ¿Te sentiste descartada o bien encaminada?
Al final, fuera del personaje, 3 líneas con los problemas concretos de la página que encontraste.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- Nota **4/10**; no crearía la cuenta (sí haría clic en "Probar el Consultor de Nuevos Negocios", "a pesar de la página, no gracias a ella"). Se sintió vista con "Todavía no abrí", pero el resultado la trató como un café que ya vende.
- Bug clave: "Café Lumbre" se resuelve por coincidencia aproximada a Casa Salvo Café y le muestra un local ajeno como si fuera suyo, incluido el bloque "Tu Fudo ya viene con tu local cargado" con nombre, dirección y horarios de otro negocio.
- Además: "Aunque no marcaste las apps, tu local figura en 2" cuando no marcó nada; etiqueta interna "Caliente" visible; el Consultor, lo único pertinente, quedaba al final.
- No alcanzó a abrir la guía de boleta electrónica ni el link del Consultor (el entorno le cortó comandos): lo declaró.

---

### A5 · Constructor (iteración 2): los 5 cambios de mayor impacto + cambios finales de G-OK1

- **Objetivo:** Aplicar como máximo 5 cambios de mayor impacto salidos del QA y de los 4 dueños simulados (búsqueda honesta, "Estoy por abrir" como ruta propia, home por país, preguntas y "tus números", confianza), y después los 2 cambios finales pedidos al aprobar la app: hero dinámico y sin buscador.
- **Salidas:** `app/`, README/ARCHITECTURE; `docs/feedback/cambios.md` lo completa el orquestador
- **Corrida:** lanzado 2026-10-27 06:30 (-03); 160 tool calls registrados; ~266 min.

**Brief (completo):**

````text
Sos A5 (Constructor, iteración) del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado": una herramienta gratuita que diagnostica la presencia online de un restaurante y lo lleva a crear cuenta en Fudo (SaaS gastronómico; AR/MX/CL/CO; BR = "Deli"). Es una demo para una entrevista: el equipo técnico de Fudo lee el repo y se hace un cambio en vivo de 15 min.

LEÉ PRIMERO, completos: `C:\Users\m_rubano\FUDO\docs\feedback\cambios.md` (tu trabajo: los 5 cambios), `C:\Users\m_rubano\FUDO\docs\qa\report.md` (bugs B-1…B-15 con archivo probable), las 4 devoluciones `docs\feedback\persona-*.md`, y `PLAN.md` (§0, §2-G2, §2-G5), `README.md`, `docs\ARCHITECTURE.md`. Código: `C:\Users\m_rubano\FUDO\app\` (Vite + React + TS strict + Tailwind; copy en `src/content/copy.ts` con base + overrides por país; tokens en `src/theme/tokens.ts`; dominio puro en `src/domain/`; gateway en `src/gateway/`; UI en `src/ui/`; prerender en `scripts/`). Prod: https://fudo-diagnostico.vercel.app. Repo en `main`, pusheado (hacé `git pull` primero).

HACÉ LOS 5 CAMBIOS de cambios.md, en este orden y con un commit (o más) por cambio:
1. **Búsqueda honesta** (en `src/gateway/shared.ts` / `searchCatalog` y la UI de resultados): solo ofrecer "¿Es este?" con coincidencia real (todas las palabras significativas del nombre, o nombre + ciudad); si no, estado "No encontramos «X»" con sugerencias del país detectado primero (header `x-vercel-ip-country` o la landing desde la que se busca); nunca mezclar países si la búsqueda nombra una ciudad del snapshot. Casos de test obligatorios: "Café Lumbre" → no encontrado (no Casa Salvo); "Pizzería Don Rubén Lanús" → no encontrado con sugerencias AR primero; "El Campeón de la Pizza" → solo El Campeón (no Diavola); "Tacos Hola El Güero, Ciudad de México" → solo Hola El Güero; "Come Como en Casa Bogotá" → solo ese.
2. **"Estoy por abrir" es otra ruta**: link en la home ("¿Todavía no abriste? …") y opción en P1; ambos llevan a una pantalla propia sin diagnóstico de ningún local, sin plata ni ticket: Consultor de Nuevos Negocios (URL real ya usada en el código) primero, y la/s guía/s del blog del país (CL → boleta SII; AR → ARCA; MX → CFDI; CO → DIAN) + qué datos conviene tener al abrir. Si venía de elegir un local y marca "Todavía no abrí", no mostrar el diagnóstico de ese local. Eliminá `DEFAULTS_BEFORE_OPENING` o su uso para armar un diagnóstico.
3. **La home habla el idioma del país**: endpoint mínimo `GET /api/geo` (devuelve `{ country }` desde `x-vercel-ip-country`, default AR; en dev, `?country=` para probar) o reutilizá uno existente; la home (`/`) adapta escena del hero (local real del snapshot de ese país: p. ej. MX "tacos en la Roma"/"hamburguesas en Zapopan" según lo que haya), chips (país detectado primero), voz (voseo AR, tuteo MX/CL/CO) y link visible "Ver la versión para <país>" a su landing. El HTML prerenderizado de `/` sigue siendo AR (para SEO); el cambio es en el cliente tras hidratar, sin salto de layout feo. Arreglá voseo filtrado: `pickAtLeastOne` y cualquier "Elegí/Mirá/Probá/Escribí" en MX/CL/CO/BR (agregá un test que recorra todo el copy resuelto por país buscando formas de voseo).
4. **Preguntas que reflejan el negocio + "tus números"**:
   - P1: sumar Taquería y Hamburguesería.
   - P3: sumar "Me paga la app (no cobro directo)". Con esa respuesta, operación no penaliza como "a mano" ni recomienda facturar ante el ente fiscal; recomienda conciliar liquidaciones de las apps (enlazá el módulo de Fudo que corresponda según `docs/research/fudo-tools.md`, o ninguno si no hay).
   - "Con otro sistema" → sub-pregunta "¿Cuál?" con chips (Soft Restaurant, Maxirest, Bistrosoft, Poster, Toteat, Loyverse, Otro). El bloque switcher lo nombra ("Venís de Soft Restaurant: …") y enlaza la guía si existe (MX: cambiar-de-soft-restaurant).
   - En "¿Cómo calculamos esto?", inputs editables "Pedidos por mes" y "Ticket promedio" (prellenados con la estimación, rotulados "estimado por reseñas · cambialo por el tuyo"), con recálculo en vivo, en una función pura de `src/domain/moneyLost.ts` con test.
   - Consistencia: la merma mostrada = % × ventas mostradas; la lista de supuestos coincide con lo usado; sin "× ×1"; la comisión se cita con fuente del país (AR: iProfesional 14/05/2026; otros países: la que haya en `docs/research/` o "sin dato público en <país>: usamos X% (supuesto)").
   - Dark kitchen sin reseñas: el área no cuenta en la nota general y se explica ("normal en un negocio solo de apps"). "NO LO PUDIMOS LEER" no se repite. Si el delivery no se pudo leer, la recomendación no asume que vende por apps. "Canal propio: No" → "no lo marcaste".
5. **Confianza + barrido QA**:
   - Sin rótulos internos de tier ni link a `/debug` en la UI (la ruta queda, `noindex`, con title propio en el HTML).
   - Badge separado del nombre ("Güerotú", "Pizzavos").
   - Junto al ticket de ejemplo de la home: "Datos públicos de la ficha de Google, capturados el 26/10/2026 para esta demo".
   - Separador de miles según el país.
   - Bugs: B-1 (doble clic → bloquear opciones durante la transición), B-4 (historial con pushState/popstate o sessionStorage: Atrás vuelve al paso anterior, recarga mantiene el resultado), B-5 (`<main>`), B-6 (`break-words` + `maxLength` 80), B-7 (404 real: `404.html` noindex y rewrite que no capture todo; mantené la SPA en `/` y `/debug/`), B-8 (URL del SAT a `wwwmat.sat.gob.mx`: es el único cambio permitido en `app/content/blog/*.md`), B-9, B-10 (`publisher`), B-11 (`llms.txt` con `/blog/`), B-12 (BR: productName en pie legal y aviso de precio), B-14, B-15 (clic fuera cierra el modal).

RESTRICCIONES:
- Arquitectura: copy solo en `copy.ts`; pesos/umbrales en `scoring.ts`; nada de LLM; lo simulado se marca simulado y lo real lleva fecha.
- El código del servidor (`app/api`, `src/server`, `src/gateway`, `src/domain`, `src/config`) es ESM con imports relativos **con `.js`** (el paquete es `"type": "module"`). Handlers de `app/api` con `export async function GET/POST(request)`.
- Responsive 360/375/768/1024/1280 sin scroll horizontal, objetivos ≥44 px, AA, teclado. Verificalo con Playwright (skill `webapp-testing`) contra `npm run build && npm run preview` o `npm run dev`: los 5 casos de búsqueda del cambio 1; Sofía (Café Lumbre → por abrir); Andrés (dark kitchen + "me paga la app"); Mariana (MX, otro sistema = Soft Restaurant, `?country=MX`); Rubén (editar pedidos y ticket). Capturas en `C:\Users\m_rubano\FUDO\.tmp\shots-v3\` (fuera de git). axe en home, resultado, por abrir.
- Tests: `cd app && npm run lint && npm run typecheck && npm test && npm run build` en verde, con tests nuevos para búsqueda, por-abrir, "me paga la app", "tus números" y voz por país.
- Git: commits convencionales chicos terminando con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; antes de cada commit, `git grep` de patrones de claves (<patrones de claves redactados>) vacío; al final `git push origin main`. **No** hagas `vercel deploy` ni toques la config del proyecto en Vercel (lo hace el orquestador). No toques `PLAN.md`, `docs/feedback/`, `docs/qa/`, `docs/prompts/`. No commitees `.tmp/`, `.vercel/`, `.env.local`. Actualizá README/ARCHITECTURE si cambia algo estructural (ruta por-abrir, /api/geo).

**Listo cuando:** los 5 cambios están en `main` pusheado, CI local en verde y las capturas muestran cada caso. Devolveme: commits, cantidad de tests, qué cambio resolvió qué fricción, capturas clave y lo que no hayas podido cerrar.
````

**Feedback recibido:**

1. (2026-10-27 09:51 (-03)) del orquestador, tras renovarse el límite de uso:

````text
Se reseteó el límite de uso: seguí exactamente donde quedaste (estabas en PickPlace y la API del cliente). Antes de seguir, corré `git status` y `git log --oneline -8` para ver qué ya commiteaste. Mismo brief y mismas restricciones; al final lint/typecheck/test/build en verde, capturas en .tmp/shots-v3, push a main y el reporte pedido.
````

2. (2026-10-27 10:39 (-03)) del orquestador, al aprobar el usuario la app (G-OK1): hero dinámico y sin buscador:

````text
Matías aprobó la app (G-OK1) con 2 cambios finales. Hacé `git pull` primero (hay commits de docs nuevos en main).

1. **Hero dinámico**: el titular "Viernes 21:30. Alguien busca "pizza en Lanús"." tiene que rotar entre escenas (p. ej. cada ~3 s, con transición suave): "pizza en Lanús", "tacos en la Roma"/"taquería en CDMX", "hamburguesas en Zapopan", "café en Providencia", "comida casera en Bogotá", "pizzaria em Pinheiros"… Usá SOLO ciudades/rubros de los 5 países donde opera Fudo y, en lo posible, que correspondan a locales del snapshot (data-driven: armá la lista desde el catálogo/showcase, no hardcodeada en la UI; el copy de cada escena en copy.ts con la voz del país). Cambiá también el día/hora si queda natural ("Sábado 13:00", "Viernes 21:30"…). Respetá `prefers-reduced-motion` (sin animación: mostrar una sola escena, la del país detectado), `aria-live="off"` en la rotación para no spamear lectores de pantalla (el H1 estático para lectores/SEO puede ser genérico y la escena rotativa decorativa), sin layout shift (altura reservada), y que el HTML prerenderizado siga teniendo un H1 con keyword. Mantené la escena del país detectado primero.
2. **Sacar la barra de búsqueda**: Matías dice que "no funciona, no busca locales reales" (en la demo solo hay 13). Eliminá el input de texto de la home y de las landings /ar /mx /cl /co. Reemplazalo por una elección honesta: "Elegí un local real de la demo" con tarjetas de los locales del snapshot (país detectado / de la landing primero, agrupados por país, con ciudad, rubro y badge "real · capturado el 26/10/2026"), + el link "¿Todavía no abriste?" y una línea "En producción, acá buscás tu propio local con Google Places (ya implementado en el código, detrás de DATA_SOURCE=places)". Ajustá todo el copy que diga "escribí el nombre de tu local", el `diag_start` (que ya no tiene query: registrá `{ source: 'card' }`), los tests y el prerender. NO borres el gateway ni `/api/places-search` (se usan en producción y en tests): solo sale de la UI. Si `PickPlace`/"No encontramos" quedan sin uso desde la UI, dejá el código mínimo necesario o eliminalo si queda muerto (sin romper tests de gateway).
Mismas restricciones de antes (ESM con .js en servidor, copy en copy.ts, responsive 360–1280 sin scroll horizontal, ≥44 px, axe, teclado). Verificá con Playwright en 375 y 1280: home AR, home `?country=MX`, landing /co/, reduced motion, y un flujo completo eligiendo una tarjeta. lint/typecheck/test/build en verde, commits convencionales con Co-Authored-By, `git push origin main`. No hagas deploy (lo hago yo). Devolveme commits, tests y capturas en .tmp/shots-v4.
````

**Qué devolvió (resumen mío):**

- **Primera tanda** (6 commits, `891e747` a `bd3d1a6`; tests 105 → 170): (1) búsqueda honesta (un local se ofrece solo si todas las palabras están en su nombre, ciudad o tipo; si no, "No encontramos" con sugerencias del país detectado); (2) "Estoy por abrir" como pantalla propia, sin diagnóstico, con el Consultor primero; (3) `GET /api/geo` y home por país con voz correcta; (4) opciones nuevas (Taquería, Hamburguesería, "Me paga la app", "¿cuál sistema?") y "tus números" editables con recálculo; (5) sin jerga interna ni `/debug`, aviso de origen de datos y barrido de bugs de QA (B-1, B-4 a B-12, B-15).
- **Segunda tanda** (commit `21e1d7f`; tests 170 → **177**, 17 archivos): hero con hasta 10 escenas data-driven de los 5 países (una cada 3,2 s con fundido, sin salto de layout, `prefers-reduced-motion` y `aria-live="off"`, H1 estático con la keyword); el input de búsqueda sale de la home y de las landings y entra una sección "Elegí un local real de la demo" con 13 tarjetas agrupadas por país, y la línea de que en producción buscás con Google Places. `diag_start` registra `{ source: 'card' }`. Borró `PickPlace.tsx` y el cliente `searchPlaces`; conservó el gateway y `/api/places-search`.
- Verificó con Playwright (74 y 59 chequeos), axe sin violaciones y 0 px de scroll horizontal. Trabajó con una pausa de por medio por el límite de uso del orquestador; retomó leyendo `git status` y `git log`.

---

### A6 · Redactor del informe (G6): .docx + .pdf de 2 páginas

- **Objetivo:** Escribir el informe de hasta 2 páginas A4 (secciones a–g del caso), con cada número con fuente, citas de los dueños simulados marcadas como simuladas, y exportarlo a .docx y .pdf.
- **Salidas:** `docs/informe/Informe-Fudo.md`, `.docx`, `.pdf`
- **Corrida:** lanzado 2026-10-27 06:31 (-03); 101 tool calls registrados; ~270 min.

**Brief (completo):**

````text
Sos A6 (Redactor del informe) del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado". Es la entrega de un caso de selección de Fudo (SaaS de gestión para restaurantes en AR/MX/CL/CO/BR) para el puesto de "AI-driven Organic Growth". El caso pide un documento de **hasta 2 páginas**, en español, con estas secciones exactas:
a. Problema, segmento e hipótesis, incluido cómo filtrás o calificás.
b. Por qué esta solución.
c. Distribución: cómo llega el restaurante a la herramienta.
d. Qué recortaste y por qué.
e. Cómo lo construiste y por qué así.
f. Cómo lo medirías, usando los números de referencia.
g. Qué harías después: de dónde vendrían los datos reales (APIs, scraping, restricciones), costo estimado por diagnóstico y próximos pasos.
Lo que más evalúan, en orden: razonamiento (para qué restaurante, qué hipótesis, cómo filtrás), recorte de alcance, distribución, decisiones de construcción y datos reales, medición con experimento escrito antes. "El diseño visual no suma puntos." Reglas: herramientas gratuitas y contar cómo se manejaron sus límites.

Números de referencia del caso (ilustrativos, úsalos como línea de base): 80.000 visitas/mes; 1,2% visita→cuenta (≈960 cuentas/mes); USD 20 por cuenta vía pauta; 10% cuenta→pagante a 60 días; CAC ≈ USD 200; ticket USD 50/mes.

LEÉ TODO ANTES DE ESCRIBIR: `C:\Users\m_rubano\FUDO\PLAN.md` (§0 Norte, §2-G6 completo, §4 D1–D4, Bitácora), `README.md`, `docs\ARCHITECTURE.md`, `docs\adr\*.md`, `docs\research\*.md` (en especial costos.md, datos.md, distribucion.md, geo-blog.md, mcp.md, paises.md, benchmark.md, fudo-tools.md), `docs\qa\report.md`, `docs\feedback\persona-*.md` y `docs\feedback\cambios.md` (una iteración está en curso aplicando esos 5 cambios; describilos como aplicados en la versión final y no cites fricciones que esos cambios resuelven como si siguieran abiertas).

CONTENIDO OBLIGATORIO:
- **a.** Segmento núcleo: restaurantes, bares y pizzerías de 1–3 locales con volumen y delivery; hipótesis; filtro con los tiers caliente / switcher / nutrir / descartar / por abrir (por abrir → Consultor de Nuevos Negocios de Fudo) y qué señales usa (proxy de volumen = reseñas, sistema actual, canales, locales).
- **b.** Por qué diagnóstico híbrido (datos reales + 4 preguntas de calificación) + "tu cuenta ya armada" y no el diagnóstico solo, el quiz solo o un agente de WhatsApp. Usá el benchmark (Owner Grader, etc.) y que Fudo ya tiene herramientas sueltas en tools.fu.do que esto unifica.
- **c.** Distribución: SEO/AEO **específico** (no genérico) por país; landings /ar /mx /cl /co; **blog GEO** de 8 guías que responden preguntas reales (ARCA, CFDI y propinas, comisiones de PedidosYa/Rappi/DiDi/Uber Eats, Google Maps, migrar desde Soft Restaurant, boleta SII, factura POS DIAN), escritas para que las citen los LLM (respuesta directa, fuentes, FAQ, JSON-LD, llms.txt, aclarando que FAQPage ya no da rich result en Google y que llms.txt no es estándar); herramienta compartible; alianzas (cámaras, contadores, hardware, fintech) con nombres de docs/research/distribucion.md; pauta solo para validar; **idea de MCP**: un servidor MCP "Fudo Diagnóstico" para usar el diagnóstico y las calculadoras dentro de ChatGPT/Claude/Gemini, donde el dueño ya pregunta (de docs/research/mcp.md: tools, solo lectura, link de alta con utm_source=mcp, riesgos). Por qué no páginas por ciudad (doorway + ToS de Places).
- **d.** Recortes: BR (se vende como Deli; sin i18n a portugués), Instagram y apps de delivery con métricas simuladas (solo presencia/link real), sin auth real ni CRM, sin LLM en runtime, alta en fu.do simulada porque el alta real no acepta precarga, snapshot en vez de Places en vivo.
- **e.** Construcción: Claude Code como orquestador + subagentes (investigación, construcción, QA, 4 dueños simulados sin contexto, redacción); stack Vite + React + TS + Vercel Functions; **gateway de datos** con proveedores intercambiables (Snapshot real fechado / Google Places detrás de `DATA_SOURCE` / Mock); scoring por reglas en un archivo; tests y CI; cómo se manejaron los límites gratuitos (Vercel Hobby, sin LLM, snapshot estático, Places con tier gratis). Mencioná brevemente qué se aprendió de los 4 dueños simulados (con 3–4 citas textuales **marcadas como "dueño simulado"**) y que QA no encontró bloqueantes.
- **f.** Medición: embudo con línea de base (visita→diagnóstico→cuenta→pago), métrica principal cuenta→pago a 60 días (10% → 15%), indicador temprano activación a 7 días, **experimento escrito antes**: hipótesis, brazos (control = alta actual; tratamiento = diagnóstico + cuenta precargada), tamaño ≈ 685 cuentas por brazo para detectar 10%→15% con α=0,05 y potencia 80% (mostrá la fórmula o el cálculo en una línea), duración estimada (explicá el supuesto de qué fracción del tráfico entra al experimento), resultado esperado, criterio para matarlo y guardrails (calidad de lead: % caliente+switcher; CAC). Eventos instrumentados (diag_start…cta_click, panel /debug).
- **g.** Datos reales: Places API (New) con SKUs y field mask; ToS de caché (por qué el snapshot es solo para la demo y el riesgo declarado de tenerlo en un repo público); Instagram Graph/Business Discovery; apps de delivery sin API pública (partners/ToS); web + PageSpeed. **Costo por diagnóstico** (≈ USD 0,057, 1.000/mes gratis; escenarios de costos.md) contra el CAC del caso. Próximos pasos priorizados: pedirle a producto que el alta acepte precarga (lo que hoy obliga a simular), activar Places, MCP, páginas programáticas con datos propios, revisión de contadores de las guías fiscales, BR en portugués.
- Incluí las URLs: app https://fudo-diagnostico.vercel.app y repo https://github.com/matiasrubano/fudo-diagnostico. Autor: Matías Rubano. Fecha: octubre 2026.

FORMA:
- **Cada número con su fuente** (nota corta entre paréntesis o superíndice + línea de fuentes al pie: "caso Fudo", "Google Maps Platform pricing 2026-10", "iProfesional 14/05/2026", etc.). Lo estimado dice "estimado"; lo simulado, "simulado". Nada inventado.
- Directo, sin relleno, frases cortas, tablas chicas donde ahorren espacio (embudo, experimento, costos).
- **Entra en 2 páginas A4** (márgenes ~1,8 cm, fuente 9,5–10 pt, títulos a–g visibles). Si no entra, recortá texto, no achiques por debajo de 9 pt.

SALIDA:
- `C:\Users\m_rubano\FUDO\docs\informe\Informe-Fudo.docx` y `C:\Users\m_rubano\FUDO\docs\informe\Informe-Fudo.pdf` (usá la skill `docx` para el .docx; para el PDF, convertí con LibreOffice si está —`soffice --headless --convert-to pdf`— o generá el PDF con la skill `pdf`; verificá que el PDF tenga **2 páginas o menos**, p. ej. con `pdfinfo` o python, y miralo renderizado para que no haya cortes feos).
- `C:\Users\m_rubano\FUDO\docs\informe\Informe-Fudo.md` con el mismo texto (para el repo y para revisión).
- Archivos temporales solo en `C:\Users\m_rubano\FUDO\.tmp\a6\` (borralo al final). No hagas commits.

**Listo cuando:** existen .docx, .pdf (≤2 páginas A4) y .md, con las 7 secciones a–g, las URLs, 3–4 citas de dueños simulados marcadas, y cada número con fuente. Devolveme: cantidad de páginas del PDF, palabras, y la lista de números con su fuente.
````

**Feedback recibido:**

1. (2026-10-27 09:51 (-03)) del orquestador, tras renovarse el límite de uso:

````text
Se reseteó el límite de uso: seguí donde quedaste con el informe (revisá qué hay en docs/informe/ y .tmp/a6/). Dato nuevo: el guion del video (video/guion.md) usa n ≈ 685,6 → 686 cuentas por brazo; usá el mismo número. Mismo brief: .docx + .pdf (≤2 páginas A4) + .md, cada número con fuente, y el reporte pedido.
````

2. (2026-10-27 10:40 (-03)) del orquestador, reescritura con la skill `escritura-humana` y hechos nuevos (video recortado, demo sin buscador, 170 tests):

````text
Matías aprobó la app (G-OK1) y pidió reescribir el informe con una skill de escritura humana. Leé y aplicá COMPLETA la skill `C:\Users\m_rubano\FUDO\.claude\skills\escritura-humana\SKILL.md` a `docs/informe/Informe-Fudo.md` y regenerá el .docx y el .pdf (mismo método que usaste: Word por PowerShell en línea; Calibri 9,5 pt, márgenes 1,7 cm; **≤2 páginas A4**, verificalo y miralo renderizado). Mismo contenido y mismas fuentes [n]; cambia la voz (primera persona, voseo, sin muletillas ni rayas, prosa para argumentos y tablas solo para datos, un ejemplo concreto por idea). Corré el chequeo final de la skill y devolveme cuántas rayas (—) y muletillas quedaron (deberían ser 0).

Además, actualizá estos hechos (cambiaron después de tu versión):
1. **Video demo: recortado por decisión de Matías.** El guion quedó aprobado en `video/guion.md` (77 s), pero no se renderizó (además, la cuenta de ElevenLabs falló en todas las generaciones). Sumalo a la tabla de recortes (d) en una línea y no lo nombres como entregable.
2. **La demo ya no tiene buscador de texto**: en la demo se elige uno de los 13 locales reales del snapshot (país detectado primero) y el hero rota escenas reales por país ("Viernes 21:30, alguien busca pizza en Lanús", "tacos en la Roma"…). En producción, el buscador vuelve con Google Places (ya implementado detrás de `DATA_SOURCE=places`). Ajustá (b), (d) y (e) donde hable de "buscar el local" en la demo.
3. Tests: 170 (antes decías "más de 100"). Fuente: CI del repo.
No hagas commits. Devolveme páginas, palabras y el resultado del chequeo.
````

3. (2026-10-27 11:01 (-03)) del orquestador, el dato de los tests cambió con el último commit (de 170 a 177):

````text
Un dato cambió después de tu versión: con los últimos cambios de la app (hero dinámico y tarjetas en vez de buscador) el repo tiene **177 tests**, no 170 (CI en verde, commit 21e1d7f). Cambiá "170" por "177" en el .md, el .docx y el .pdf (editá el .docx con Word por PowerShell en línea como antes, o regenerá desde el .md con el mismo formato), y verificá que el PDF siga en 2 páginas A4. Nada más. Devolveme confirmación con el conteo de páginas.
````

**Qué devolvió (resumen mío):**

- Versión 1: PDF de 2 páginas A4 (Calibri 9,5 pt, márgenes 1,7 cm, exportado con Word lanzado por PowerShell en línea porque no hay LibreOffice), ~1.700 palabras, secciones a–g, fuentes con superíndices [n], 4 citas de dueños simulados. Tamaño del experimento: n ≈ 685,6 → **686 cuentas por brazo** (1.372 en total), el mismo del guion.
- Versión 2 (reescritura con la skill `escritura-humana`): primera persona, voseo, prosa para los argumentos y tablas solo para datos. Chequeo final de la skill: 0 rayas largas, 0 muletillas; 1.991 palabras en el `.md`; sigue en 2 páginas. Incorpora el video como recorte en una línea (guion aprobado de 77 s, sin renderizar, ElevenLabs falló) y la demo sin buscador de texto.
- Dice lo que salió mal (los 4 dueños simulados no crearían la cuenta; a Sofía la búsqueda le mostró un café ajeno), lo que no verificó (regresión de la iteración, disponibilidad de MCP para dueños de LATAM, benchmark de Owner/Qamarero) y que borró los scripts de generación: conviene editar desde el `.md`.
- Al archivar, **en curso**: cambiar "170" por "177" tests en el `.md`, el `.docx` y el `.pdf` y confirmar que siga en 2 páginas.

---

### A7 · Guionista del video demo (G7)

- **Objetivo:** Escribir el guion de 60–90 s: hook con el problema, recorrido con un local real, el momento "Tu Fudo ya armado", números del experimento y cierre con las URLs; con escenas, capturas, motion graphics y subtítulos.
- **Salidas:** `video/guion.md`
- **Corrida:** lanzado 2026-10-27 06:31 (-03); 49 tool calls registrados; ~10 min.

**Brief (completo):**

````text
Sos A7 (Guionista del video demo) del proyecto "Caso Fudo: Diagnóstico + Tu Fudo ya armado": una herramienta gratuita que diagnostica la presencia online de un restaurante (ficha de Google, reseñas, web, apps de delivery, operación) y lo lleva a una cuenta de Fudo "ya armada" con sus datos. Es la entrega de un caso de selección de Fudo; el video acompaña al informe.

LEÉ: `C:\Users\m_rubano\FUDO\PLAN.md` (§0 y §2-G7), `README.md`, `docs\feedback\cambios.md`, `docs\feedback\persona-ruben.md`, `docs\research\costos.md`, y mirá la app en producción https://fudo-diagnostico.vercel.app (podés recorrerla con Playwright, viewport 375×812 y 1280×800). El local real recomendado para el recorrido es **El Campeón de la Pizza (Lanús, AR)**: 4,2 · 6.167 reseñas, sin web propia, en PedidosYa y Rappi (datos reales capturados el 26/10/2026). La plata que "se escapa" es una **estimación simulada** y así hay que decirlo.

ESCRIBÍ `C:\Users\m_rubano\FUDO\video\guion.md` (en español rioplatense neutro, para una voz en off neutra latinoamericana; evitá voseo marcado en la locución para que suene neutra, salvo citas de pantalla):
- Duración objetivo **75 s** (máximo 90 s, mínimo 60 s). Calculá ~2,4 palabras por segundo y mostrá el conteo de palabras y la duración estimada por escena.
- Estructura obligatoria: (1) **hook con el problema** ("Viernes 21:30…" / el dueño que no aparece o paga 30% de comisión), (2) **recorrido con el local real** (buscar → confirmar → 4 preguntas → comanda de resultado), (3) **el momento "tu Fudo ya armado"** (cuenta precargada con nombre, dirección y horarios reales; aclarar que el alta es simulada en la demo), (4) **números**: línea base del caso (960 cuentas/mes, 10% → pago, CAC USD 200) y el experimento (10% → 15% cuenta→pago, ~685 cuentas por brazo, costo ≈ USD 0,06 por diagnóstico vs USD 20 por cuenta vía pauta), (5) **cierre con las URLs** (fudo-diagnostico.vercel.app y github.com/matiasrubano/fudo-diagnostico).
- Tabla por escena: n.º · tiempo (inicio–fin) · locución exacta · qué se ve en pantalla (qué captura/pantalla de la app, en qué ancho: preferí mobile 375 encuadrado en un marco de teléfono sobre fondo de marca, y algún plano 1280) · motion graphics (zoom a qué elemento, contador animado de qué número, texto en pantalla) · subtítulo (líneas ≤ 42 caracteres).
- Marca: logo oficial en `video/assets/fudo-logo.svg` / `fudo-logo-white.svg`; colores #FF5023 (naranja), #3937FF (azul), #0F1B4E (azul noche), crema #FFFAEC; tipografías Barlow (títulos) + Inter. Incluí un rótulo discreto "Demo de entrevista · no oficial" al inicio o al final.
- Lista de **capturas a generar** con Playwright (URL, viewport, acciones, nombre de archivo) para que el agente de video las saque tal cual.
- Nada inventado: cada número del guion con su fuente (caso Fudo, snapshot 26/10/2026, costos.md) en una sección "Fuentes" al final.

No hagas commits ni toques la app. **Listo cuando:** `video/guion.md` existe con la tabla de escenas, el total de palabras/duración (60–90 s), la lista de capturas y las fuentes. Devolveme la locución completa en un bloque de texto y la duración estimada.
````

**Feedback recibido:**

Sin feedback posterior al brief.

**Qué devolvió (resumen mío):**

- Guion de 9 escenas: 182 palabras ≈ **75,8 s** de voz, ≈ **77 s** de video con 1,5 s de cola. Locución con números en palabras, sin voseo, lista para ElevenLabs; tabla de escenas con captura, motion graphics y subtítulos de ≤42 caracteres; 24 capturas con un script de Playwright y una fila de fuente por cada número.
- Aclaró que USD 0,06 es por diagnóstico y USD 20 por cuenta (unidades distintas), que la comisión 25–35% viene de iProfesional y que el cálculo da 685,6 por brazo. Avisó qué recortar de las capturas (segunda tarjeta de Diavola, etiqueta "Caliente", link a /debug).
- El orquestador lo llevó a G-OK2 y el usuario lo aprobó. **El video no se renderizó** (ver sección 4).

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
| 27/10 00:13 | "Todavía no abrí" corta el cuestionario tras la pregunta 1 y rutea a **por abrir** (Consultor de Nuevos Negocios); `descartar` = 4+ locales o rubro "otro" | No frustrar a quien no abrió; los grandes se derivan a ventas | `app/src/domain/leadTier.ts` (luego reemplazado por una ruta propia, ver más abajo) |
| 27/10 00:13 | "Plata que se escapa por mes": tres componentes, rango ±40%, supuestos **simulados** salvo la comisión de AR | Ticket y pedidos por país no son datos reales; el cálculo se muestra paso a paso | `app/src/domain/moneyLost.ts` |
| 27/10 00:13 | La búsqueda con Places no pide `rating` en la máscara | Subiría al SKU Enterprise y al costo | `app/src/gateway/GooglePlacesProvider.ts`; `docs/research/datos.md` |
| 27/10 00:18 | **G-OK0**: repo `fudo-diagnostico`, **público**, con el riesgo declarado en el ADR 0002 y en el informe (alternativas descartadas: privado con evaluadores invitados; público sin datos de Google) | Lo lee el equipo técnico sin fricción; son datos públicos de 13 negocios, fechados y con fuente; producción usaría la API oficial | PLAN §2-G3 y Bitácora; `docs/adr/0002-snapshot-vs-api.md` |
| 27/10 | Vercel Hobby es no comercial y exige el repo en una cuenta personal | Condiciones del plan; la demo es una zona gris y se declara | `docs/research/costos.md` §5.2 |
| 27/10 00:27 | **Límite de uso del plan de Claude** cortó la sesión; A2 quedó a mitad de un arreglo | Límite del plan | PLAN Bitácora (2026-10-27, G3) |
| 27/10 ~00:25 | **Fallo de `/api/*` en Vercel** (500, `FUNCTION_INVOCATION_FAILED`). Tres causas: (1) `@vercel/node` emite ESM y Node no resuelve imports relativos sin extensión (`ERR_MODULE_NOT_FOUND`); (2) `defaultSnapshotDir()` usaba `process.cwd()`, pero en la Lambda el cwd es `/var/task` y los datos quedan en `/var/task/app/data/snapshots`; (3) `app/vercel.json` tenía un escape `\.` inválido | A2 no pudo probar Vercel sin CLI; el orquestador lo reprodujo con `vercel build --prod` y ejecutando la función con node | Commit `0ef1c93` (imports con `.js`, `with { type: 'json' }`, candidatos de ruta con test, `vercel.json`) |
| 27/10 05:09 | Segundo fallo: el launcher de Vercel no carga ESM en un paquete sin `"type"` | Se declara **`"type": "module"`** (todos los configs ya eran ESM), Node 22.x como en CI y los handlers pasan a la firma `export GET/POST(request)` | Commit `84ca323`; `app/package.json`, `app/api/*` |
| 27/10 05:18 | 3 bugs menores de la verificación: recomendación "vendés solo por apps" aunque se marcó mostrador; `place_selected.from_suggestion` en `false` al elegir un chip; `/debug` heredaba el `<title>` de la home | Hallazgos del orquestador al recorrer el flujo en 375 y 1280 | Commit `9a0f085` (A5) |
| 27/10 04:56 | **Rediseño "menos genérico"**: logo real de Fudo, hero desde la escena del cliente, ticket de ejemplo real del snapshot, resultado como comanda, comparación con vecinos, voz por país (voseo AR, tuteo MX/CL/CO), landings /ar /mx /cl /co | Pedido del usuario ("sigue, hazla menos generica. y termina"): parecía una plantilla SaaS cualquiera | Commits `2e1ac08` a `b90ff5c` (A5); brief en la sección 3 |
| 27/10 ~05:10 | **Logo oficial de Fudo** en `app/public/brand/` (sitio y video); para BR se muestra "Deli" en texto | El usuario lo aportó ("te paso el logo de fudo, tanto para el video como para el sitio") | `app/public/brand/`; commit `87d04aa` |
| 27/10 06:29 | **A3 no pudo escribir `docs/qa/report.md`**: la herramienta Write lo rechazó para el subagente. El agente no buscó otro camino y devolvió el informe como texto; **lo guardó el orquestador** | La herramienta Write respondió que "los subagentes devuelven los hallazgos como texto"; el agente respetó el límite y no buscó otro camino para escribirlo | `docs/qa/report.md` (commit `b2f69b4`) |
| 27/10 06:10 | **Los dueños simulados dieron 6, 5, 5 y 4 sobre 10 y ninguno crearía la cuenta** (el alta es simulada y la app asumía un local que ya vende en Argentina). Primer pedido a producto: 5 cambios | Rubén 6, Mariana 5, Andrés 5, Sofía 4. Quejas comunes: portada argentina para todos, buscador que devuelve locales de otros países o ajenos (a Sofía le mostró un café que no era el suyo), "este botón es una simulación" | `docs/feedback/` y `docs/feedback/cambios.md`; commits `891e747`, `be6bf0e`, `21559d9`, `286d830`, `d5f3641` |
| 27/10 06:30 | **Iteración con los 5 cambios**: (1) búsqueda honesta (solo ofrece un local si coincide de verdad; si no, "No encontramos" con sugerencias del país); (2) "Estoy por abrir" es otra ruta, sin diagnóstico, que reemplaza al tier `por-abrir` del dominio; (3) home por país con `GET /api/geo`; (4) preguntas que reflejan el negocio (Taquería, Hamburguesería, "Me paga la app") y "tus números" editables; (5) sin jerga interna ni `/debug`, y barrido de bugs de QA | Responde a lo que más pesó en los 4 informes y al QA (B-1, B-3, B-4, B-13, B-14) | Commits `891e747` a `bd3d1a6`; tests 105 → 170 |
| 27/10 06:47 | **G-OK2: guion aprobado** tal cual (`video/guion.md`, 182 palabras ≈ 77 s) | El usuario eligió "Aprobado (Recomendado)" | PLAN §2-G7; `video/guion.md` |
| 27/10 (entre 06:47 y 10:37) | **ElevenLabs falló en todas las generaciones**: con el modelo v4, con multilingual_v2 e incluso con una sola frase | Se concluyó que es un problema de la cuenta (créditos o permisos de la voz), no del texto ni del modelo | PLAN §7 (Video); pregunta del gate G-OK1 |
| 27/10 09:51 | Segundo **límite de uso** de Claude: A5 (iteración 2) y A6 quedaron a medias; se retomaron con `SendMessage` ("seguí donde quedaste") | Límite del plan | Sección 3 (feedback de A5 y A6) |
| 27/10 09:51 | Tamaño del experimento: n ≈ 685,6 → **686 cuentas por brazo** (1.372 en total), no "~680" | La fórmula con varianza combinada da 685,6; el guion de A7 dice "unas seiscientas ochenta y cinco" y el informe usa 686 para ser consistente | `docs/informe/Informe-Fudo.md`; `video/guion.md` |
| 27/10 10:39 | **G-OK1: app aprobada** con dos cambios finales: (1) hero dinámico que rota escenas, (2) sin barra de búsqueda | El usuario: "no funciona, no busca locales reales" (la demo cubre 13) | Commit `21e1d7f`; PLAN §2-G5 |
| 27/10 10:39 | **Hero dinámico solo con los 5 países de Fudo.** El usuario pidió ejemplos como "restaurant en peru", pero Perú no está en el caso (AR, MX, CL, CO, BR); las escenas salen de los locales del snapshot (data-driven, no hardcodeadas en la UI) y respetan `prefers-reduced-motion` | Nada inventado: solo escenas con un local real detrás | `app/src/ui/heroScenes.ts`, `app/src/content/copy.ts` |
| 27/10 10:39 | **Sin buscador**: se reemplazó por "Elegí un local real de la demo" con 13 tarjetas por país; en producción buscás con Google Places (ya implementado, `DATA_SOURCE=places`). Se borraron `PickPlace.tsx` y el cliente `searchPlaces` de la UI; el gateway y `/api/places-search` se conservan | Un buscador que no encuentra el local del entrevistador es peor que una lista honesta de lo que cubre la demo; el gateway sigue siendo el punto de venta técnico | Commit `21e1d7f`; README y ARCHITECTURE |
| 27/10 10:39 | **Video recortado por decisión del usuario**: "si no creaste aun el video no lo crees, solo termina la app y dame el informe". El guion queda aprobado pero sin renderizar; no es entregable | Combinación de la voz que no funciona y la prioridad de cerrar app e informe | PLAN §2-G7 y §7; informe (sección d, línea de recortes) |
| 27/10 ~10:40 | **Skill `escritura-humana` creada** por el orquestador porque no había una en el catálogo; el informe se reescribe con ella | Pedido del usuario ("pon una skill de escritura humana") | `.claude/skills/escritura-humana/SKILL.md` (sin commitear al archivar) |
| 27/10 11:01 | Tests: **170 → 177** tras el hero y las tarjetas; el informe se corrige | CI en verde en `21e1d7f`; el informe no puede decir un número viejo | `docs/informe/Informe-Fudo.md`, `.docx` y `.pdf` |

---

## 5. Cronología de commits

Salida de `git log --format="%h %ad %s" --date=iso` (del más viejo al más nuevo; la hora incluye la zona -0300). No incluye el trabajo sin commitear al momento de archivar (PLAN, README, informe regenerado, `.gitignore`, `.claude/skills/escritura-humana`).

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
| `8a62181` | 2026-10-27 05:26:49 -0300 | feat(content): voz por país (voseo en AR, tuteo en MX/CL/CO) en un objeto base + overrides |
| `25898ee` | 2026-10-27 05:41:33 -0300 | feat(ui): marca Fudo, escena del cliente, comanda de ticket y comparación con vecinos |
| `4c3bd9f` | 2026-10-27 05:41:35 -0300 | feat(seo): landings por país /ar/ /mx/ /cl/ /co/ prerenderizadas con hreflang, JSON-LD y sitemap |
| `3d10e22` | 2026-10-27 05:45:03 -0300 | fix(ui): tabla de eventos de /debug enfocable con teclado |
| `b90ff5c` | 2026-10-27 05:45:04 -0300 | docs: landings por país, comparación con vecinos y voz por país en README y ARCHITECTURE |
| `87d04aa` | 2026-10-27 05:48:44 -0300 | docs: log de prompts (G8 borrador), cierre de G3 en el PLAN y logo para el video |
| `891e747` | 2026-10-27 09:53:53 -0300 | feat(search): búsqueda honesta con coincidencia real y sugerencias por país detectado |
| `be6bf0e` | 2026-10-27 09:59:34 -0300 | feat(opening): "Estoy por abrir" es otra ruta, sin diagnóstico de ningún local |
| `21559d9` | 2026-10-27 10:04:18 -0300 | feat(geo): la home habla el idioma del país (GET /api/geo, escena, ejemplos y voz) |
| `286d830` | 2026-10-27 10:15:08 -0300 | feat(questions): preguntas que reflejan el negocio y "tus números" en la cuenta |
| `d5f3641` | 2026-10-27 10:31:08 -0300 | fix(ui): confianza y barrido de QA (sin jerga interna, 404 real, pie por país) |
| `bd3d1a6` | 2026-10-27 10:31:09 -0300 | docs: ruta por abrir, /api/geo, historial, tus números y 404 en README y ARCHITECTURE |
| `b2f69b4` | 2026-10-27 10:36:49 -0300 | docs: QA, dueños simulados, cambios de la iteración, informe y guion del video |
| `21e1d7f` | 2026-10-27 10:55:47 -0300 | feat(home): escenas del hero que rotan y tarjetas de locales reales en lugar del buscador |

Total: 30 commits.
