# MCP: distribuir el diagnóstico dentro de ChatGPT, Claude y Gemini

> **Goal:** G1 · (D4) MCP (A1, instancia d) · **Fecha de captura:** 2026-10-26
> **Alcance:** informe de investigación y propuesta para el informe final (§c Distribución y §g Qué sigue). **Esto no se construye ahora.**
> **Regla:** nada inventado, todo con link. Esta área cambia rápido: cada dato lleva la fecha de la página.

**Leyenda de evidencia:** ✅ leí la página en esta sesión · 🔶 fuente secundaria o resumen de búsqueda sin lectura directa (verificar) · ⚠ contradictorio, desactualizado o no verificado.

---

## 1. Qué es MCP

**Model Context Protocol** es un protocolo abierto para conectar aplicaciones de LLM con datos y herramientas externas ([especificación](https://modelcontextprotocol.io/specification/latest) ✅). La versión vigente a la fecha es la del esquema **2026-07-28** (la página de la especificación enlaza `schema/2026-07-28/schema.ts`) ✅.

| Concepto | Qué es (según la especificación ✅) |
|---|---|
| Mensajes | JSON-RPC 2.0 entre **hosts** (la app de LLM), **clientes** (conectores dentro del host) y **servidores** (quien ofrece contexto y capacidades) |
| Lo que ofrece un servidor | **Tools** (funciones que ejecuta el modelo), **Resources** (contexto/datos) y **Prompts** (plantillas) |
| Lo que ofrece un cliente | **Elicitation**: pedirle más información al usuario |
| Extensiones opt-in | **Tasks** (operaciones largas), **Skills over MCP**, **MCP Apps** (UI interactiva dentro de la conversación) |
| Seguridad | Consentimiento explícito del usuario antes de usar una tool; las descripciones de las tools se consideran **no confiables** salvo servidor de confianza; privacidad de datos |

Para nuestro caso importa: un MCP server remoto que publique 3–5 **tools** es lo mínimo, y las **MCP Apps** permitirían mostrar la tarjeta del resultado dentro del chat.

---

## 2. Estado de la distribución dentro de los asistentes (a 2026-10-26)

### 2.1 ChatGPT (OpenAI)

**Lo que leí.** La página `developers.openai.com/apps-sdk` hoy se presenta como documentación de **"Plugins"**: "Build and publish plugins with skills, MCP servers, and optional UI" ([docs](https://developers.openai.com/apps-sdk) ✅). La documentación habla ahora de *plugins* para el Directorio de ChatGPT; el nombre "Apps SDK" fue el del lanzamiento. No pude confirmar el cambio de nombre en un anuncio oficial ⚠.

**Origen:** OpenAI presentó las apps en ChatGPT y el Apps SDK (en *preview*) el **06/10/2025** en DevDay, construido sobre MCP, con socios iniciales como Booking.com, Canva, Coursera, Figma, Expedia, Spotify y Zillow ([InfoQ](https://infoq.com/news/2025/10/openai-dev-day) 🔶; [Maginative](https://www.maginative.com/article/chatgpt-turns-into-a-platform-apps-now-live-inside-conversations/) 🔶). El anuncio oficial (`openai.com/index/introducing-apps-in-chatgpt/`) devolvió **403** ⚠. El 10/10/2025, Restaurant Dive informó que 11 socios (entre ellos Uber, Instacart, Target y DoorDash) se integrarían y que las apps ya estaban disponibles para usuarios logueados en "ciertas zonas geográficas" no nombradas ([Restaurant Dive](https://www.restaurantdive.com/news/chatgpt-instacart-doordash-uber-target-grocery-delivery/802604/) ✅).

**Requisitos para publicar en el Directorio** (páginas de OpenAI leídas ✅):

| Requisito | Detalle | Fuente |
|---|---|---|
| Quién envía | Dueño de la organización, o miembro con permiso de escritura de apps (`api.apps.write`) | [Submission](https://developers.openai.com/plugins/deploy/submission.md) ✅ · [Review](https://developers.openai.com/plugins/deploy/app-review.md) ✅ |
| Verificación de identidad | Individual o empresa, en el dashboard. "Publishing under an unverified … name will result in rejection" | [Review](https://developers.openai.com/plugins/deploy/app-review.md) ✅ |
| Servidor MCP | Endpoint **HTTPS público y estable**. Solo un servidor MCP por plugin | [Submission](https://developers.openai.com/plugins/deploy/submission.md) ✅ |
| Verificación de dominio | Token en texto plano en `/.well-known/openai-apps-challenge` | [Submission](https://developers.openai.com/plugins/deploy/submission.md) ✅ |
| URLs de listado | Sitio, soporte, **política de privacidad** y **términos de servicio** (HTTPS) | [Submission](https://developers.openai.com/plugins/deploy/submission.md) ✅ |
| Autenticación | Sin auth **o** OAuth. Servidores solo-lectura y anónimos pueden no tener login; los que tocan datos del cliente o escriben **deben** autenticar. OAuth 2.1 con **PKCE S256**; registro por CIMD o DCR; *protected resource metadata* en `/.well-known/oauth-protected-resource` | [Auth](https://developers.openai.com/plugins/build/auth.md) ✅ · [Submission](https://developers.openai.com/plugins/deploy/submission.md) ✅ |
| Anotaciones de tools | `readOnlyHint`, `destructiveHint`, `openWorldHint` correctas: "the server-provided annotations are what's displayed" | [Review](https://developers.openai.com/plugins/deploy/app-review.md) ✅ |
| Privacidad de salida | Devolver solo lo necesario; sin tokens, logs ni IDs internos | [Review](https://developers.openai.com/plugins/deploy/app-review.md) ✅ |
| Revisión | Cuenta de demo para revisores (sin MFA ni SMS), **5 casos de prueba positivos, 3 negativos**, video de recorrido y notas de versión | [Submission](https://developers.openai.com/plugins/deploy/submission.md) ✅ |
| Regiones | Se puede limitar por país (`publication.countries`). **Proyectos con residencia de datos UE no pueden enviar plugins MCP** | [Submission](https://developers.openai.com/plugins/deploy/submission.md) ✅ · [Review](https://developers.openai.com/plugins/deploy/app-review.md) ✅ |
| Actualizaciones | Cambios en el servidor MCP se escanean a diario y, si pasan, salen sin nuevo envío | [Submission](https://developers.openai.com/plugins/deploy/submission.md) ✅ |

**Qué no pude verificar:** disponibilidad por país/plan para **usuarios finales** (¿ven los dueños de Argentina, México, Chile, Colombia o Brasil el directorio y pueden usar plugins?). Las páginas leídas no lo dicen; un resumen de búsqueda sobre las integraciones de comida (Uber Eats, DoorDash, Instacart) las ubicó en EE. UU. y Canadá, sin fuente única identificada ⚠ (contexto: [Food on Demand](https://foodondemand.com/10152025/how-chatgpt-is-changing-restaurant-discovery-and-online-ordering/), no leído). **Esto es un riesgo central para LATAM** (ver §5).

### 2.2 Claude (Anthropic)

| Tema | Detalle | Fuente |
|---|---|---|
| Conectores | Permiten a Claude acceder a apps y servicios y actuar en ellos. Los **conectores personalizados** usan **MCP remoto** y deben ser alcanzables por internet público (Claude los llama desde la nube de Anthropic) | [Ayuda de Claude](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) ✅ |
| Disponibilidad | Conectores web disponibles para todos los usuarios. Conectores remotos personalizados en planes Free, Pro, Max, Team y Enterprise (Free limitado a **un** conector personalizado) | Misma ayuda ✅ |
| Directorio | Listado en `claude.ai/connectors`; se envía por el portal de desarrolladores `claude.ai/directory/manage` → "MCP connector". **Cualquier plan pago puede enviar** | [Submit a connector](https://claude.com/docs/connectors/building/submission) ✅ |
| Requisitos | Servidor remoto HTTPS; **OAuth 2.0** si las tools actúan sobre cuentas de usuarios, o **sin autenticación** para datos públicos; cada tool con `title` y `readOnlyHint` o `destructiveHint`; documentación y política de privacidad; cuenta de prueba para revisores; confirmar que se probó cada tool; **7 acuses de política** (incluyen transacciones financieras, prompt injection, recolección de datos de conversación) | [Submit a connector](https://claude.com/docs/connectors/building/submission) ✅ |
| Proceso | Escaneo automático de cumplimiento y, "por defecto", listado como **Community connector** sin acción; algunas reciben revisión humana. Hay sello **Verified** aparte | [Submit a connector](https://claude.com/docs/connectors/building/submission) ✅ |
| Políticas | Directory Terms y Directory Policy de Anthropic | [Términos](https://support.claude.com/en/articles/13145338-anthropic-software-directory-terms) · [Política](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy) (enlazados desde la página de envío ✅; no abrí los textos) |
| Servidores locales | Los listados de extensiones de escritorio (MCPB) están **deprecados** en el directorio | [Submit a connector](https://claude.com/docs/connectors/building/submission) ✅ |
| MCP Apps | Servidores que muestran UI; requieren 3–5 capturas PNG ≥1000 px | [Submit a connector](https://claude.com/docs/connectors/building/submission) ✅ |

**Para nosotros:** Claude es el canal **más abierto y barato para empezar**: un conector personalizado se puede probar hoy con la cuenta gratuita, y el directorio acepta cualquier plan pago sin esperar una aprobación comercial.

### 2.3 Gemini (Google)

Aquí la evidencia es la **más débil**: no encontré documentación oficial de Google sobre MCP en la app de consumo. Lo que hay es **secundario** (un artículo del **13/10/2026**) ([Tactiq](https://tactiq.io/learn/google-gemini-mcp-support) 🔶):

| Producto | Qué dice la fuente secundaria 🔶 |
|---|---|
| **App web de Gemini** | Servidores MCP personalizados como "custom apps" en *Settings > Connected Apps*. Requiere cuenta personal de Google, mayor de 18, **en EE. UU.**, idioma inglés y "Keep Activity" activo. Las cuentas de trabajo/escuela no pueden agregarlos |
| **Gemini API (Interactions API)** | Se conecta a servidores MCP remotos por **Streamable HTTP** (sin stdio ni SSE); la integración de MCP en los SDK Python/JS figura como experimental (resumen de búsqueda, sin fuente única identificada ⚠) |
| **Gemini Enterprise** | El administrador agrega servidores MCP personalizados; soporta OAuth 2.0 |
| **Gemini CLI** | Cliente MCP nativo (stdio, SSE, Streamable HTTP). La misma fuente dice que desde el 18/06/2026 dejó de atender cuentas individuales (se redirige a otro CLI) ⚠ de una sola fuente |
| Google propios | Existe un anuncio de Google Cloud sobre soporte MCP oficial para servicios de Google ([anuncio](https://cloud.google.com/blog/products/ai-machine-learning/announcing-official-mcp-support-for-google-services), solo vi el título en una búsqueda; no leído ⚠) |

**Conclusión sobre Gemini:** para un dueño de restaurante en LATAM con cuenta personal, **no hay evidencia verificable de que pueda usar un conector MCP hoy** (la condición reportada es EE. UU. + inglés). Queda como "no confirmado".

### 2.4 Resumen comparativo

| | ChatGPT | Claude | Gemini |
|---|---|---|---|
| Existe canal de distribución para terceros | Sí (Directorio, con revisión) ✅ | Sí (Directorio + conector personalizado) ✅ | Parcial, no confirmado oficialmente 🔶 |
| Revisión | Obligatoria, con casos de prueba y video ✅ | Escaneo automático; revisión humana en algunos casos ✅ | — |
| Auth | Sin auth (solo lectura) u OAuth 2.1/PKCE ✅ | Sin auth (datos públicos) u OAuth 2.0 ✅ | OAuth/Streamable HTTP 🔶 |
| Disponibilidad para dueños de LATAM | **No verificada** ⚠ | **No verificada por país** ⚠ (los conectores son "para todos los usuarios" según la ayuda) | Reportada solo EE. UU./inglés 🔶 |

---

## 3. Quién ya distribuye así (con foco en gastronomía)

> Hallazgo importante: los ejemplos del rubro son **del lado del consumidor** (pedir comida). **No encontré un ejemplo del lado del comercio** (diagnóstico, gestión o fiscal para restaurantes) en ningún directorio. Es oportunidad y también riesgo (demanda no probada).

| Empresa | Qué hace | Estado | Fuente |
|---|---|---|---|
| **Uber / Uber Eats** | En ChatGPT detecta la intención de pedir, confirma la dirección y muestra restaurantes y menús; el pedido se completa en la app de Uber Eats | Anunciado 10/10/2025 (✅ lectura) | [Restaurant Dive](https://www.restaurantdive.com/news/chatgpt-instacart-doordash-uber-target-grocery-delivery/802604/) ✅ |
| **DoorDash** | App en ChatGPT (planificación de comidas, compras); la compra se completa en su app | Lanzada en 12/2025 (fuente secundaria) | [Digital Commerce 360](https://www.digitalcommerce360.com/2025/12/19/doordash-app-openai-chatgpt/) 🔶 |
| **Instacart** | App con pago dentro del chat según una fuente | 2025 | [Grocery Dive](https://www.grocerydive.com/news/chatgpt-instacart-doordash-uber-target-grocery-delivery/802554/) 🔶 |
| **OpenTable** | **No encontré conector oficial.** Solo servidores de la comunidad (uno de solo lectura, otro que reserva) | Comunidad, posiblemente contra los términos de OpenTable | [Glama](https://glama.ai/mcp/servers/noahelson208-prog/mcp_opentable) 🔶 · [Strider Labs](https://socket.dev/npm/package/@striderlabs/mcp-opentable) 🔶 |
| **iFood** | **Solo servidor no oficial** de la comunidad (envuelve la API web de consumo) | No afiliado a iFood | [mcpservers.org](https://mcpservers.org/vi/servers/arioliv/ifood-mcp) 🔶 |
| **Rappi, PedidosYa** | **No encontré** servidor MCP ni app en ChatGPT oficial | — | Búsqueda sin resultados ⚠ |
| **Mercado Pago** | **Servidor MCP oficial** (en beta según una fuente): busca documentación, gestiona aplicaciones y webhooks, crea usuarios de prueba; clientes: Cursor, VS Code, Windsurf, Cline, Claude Desktop/Code y ChatGPT; OAuth para gestión de aplicaciones. Orientado a **desarrolladores**, no a consumidores | Disponible en AR/MX/CL/BR | [Docs](https://www.mercadopago.com.ar/developers/en/docs/mcp-server/overview) ✅ · [Directorio](https://mcpservers.org/es/servers/mercadopago/mcp) 🔶 |

---

## 4. Propuesta: servidor MCP "Fudo Diagnóstico"

### 4.1 Idea en una línea

Un servidor MCP **remoto**, público y de solo lectura (en su primera versión) que expone el **diagnóstico de presencia online**, las **calculadoras de comisión** y los **requisitos de facturación** de Fudo, para que el dueño los use **dentro del asistente donde ya pregunta**, y que termina en un link a crear la cuenta de Fudo con `utm_source=mcp`.

### 4.2 Tools (3 a 5)

| Tool | Entrada | Salida | Fuente de datos | Anotaciones (ver 2.1/2.2) |
|---|---|---|---|---|
| **`diagnosticar_local`** | `nombre`, `ciudad`, `pais?` | Nota general y por área (Google, reseñas, web, delivery, operación), 3 recomendaciones, `report_url` | Gateway de datos (PLAN §2-G2): Places en producción; en la demo, snapshot | `readOnlyHint: true`, `openWorldHint: true` |
| **`estimar_comisiones_delivery`** | `app`, `pais`, `ventas_mensuales`, `plan?`, `comision_contrato?` | Comisión estimada, neto, comparación con canal propio, **con fuente y fecha del dato** | Tablas oficiales cuando existen (hoy solo [Uber Eats MX](https://www.uber.com/es-MX/newsroom/uber-eats-comisiones-para-pymes-mexico) ✅); si no, pide el valor del contrato y lo dice | `readOnlyHint: true`, `openWorldHint: false` |
| **`requisitos_facturacion`** | `pais`, `tipo_negocio`, `regimen?` | Resumen + **links a la fuente oficial** + "verificado el…" | Dataset curado de ARCA, SAT, SII, DIAN (los 4 artículos fiscales de [`geo-blog.md`](geo-blog.md)) | `readOnlyHint: true`, `openWorldHint: false` |
| **`preparar_cuenta_fudo`** | `reporte_id` o `place_id`, `email?` | Un **link** de alta con datos precargados | Token opaco generado por Fudo | `readOnlyHint: false` (crea una sesión de precarga), `destructiveHint: false` |
| *(opcional)* **`listar_guias`** | `pais`, `tema` | Artículos del blog con título, fecha y link | Contenido del blog | `readOnlyHint: true` |

**Notas de diseño**
- **Sin autenticación en v1** para las tools de lectura: ChatGPT permite servidores anónimos de solo lectura ([Auth](https://developers.openai.com/plugins/build/auth.md) ✅) y Claude acepta "no authentication" para datos públicos ([Submit](https://claude.com/docs/connectors/building/submission) ✅). Se elimina la fricción del login.
- **Link con datos precargados sin PII en la URL:** el PLAN prohíbe datos personales en query strings; se usa un token opaco con vencimiento (`?prefill=<token>`) y los datos viven del lado del servidor.
- **Nunca crear la cuenta desde el asistente:** la tool solo devuelve el link; la creación de la cuenta ocurre en fu.do con el consentimiento del dueño. Evita problemas con las reglas de transacciones/consentimiento de los directorios (Claude pide acuse sobre transacciones financieras ✅).
- **Recomendaciones por reglas, no LLM** (decisión D3 del PLAN): el servidor no depende de una key de modelo.
- **UI opcional:** una *MCP App* podría mostrar la tarjeta del resultado con la nota por área ([extensión MCP Apps](https://modelcontextprotocol.io/specification/latest) ✅); Claude pide capturas PNG para el listado ✅.

### 4.3 Qué datos expone (y cuáles no)

| Expone | No expone |
|---|---|
| Nota, áreas, recomendaciones y fecha del cálculo | Datos crudos de Places (nombre del reseñador, textos de reseñas) |
| Datos públicos del local que el usuario nombró (nombre, dirección) | Información de terceros no solicitada |
| Fuentes oficiales y fechas de verificación | Estimaciones de ingresos como dato público sin consentimiento |
| Link de alta con token | Emails/teléfonos en URL; credenciales; tokens de sesión (ChatGPT exige no devolver secretos ✅) |

### 4.4 Riesgos y mitigaciones

| Riesgo | Detalle y fuente | Mitigación |
|---|---|---|
| **Privacidad** | El dueño escribe el nombre de su local en un chat de terceros; la especificación pide consentimiento y minimizar datos ([spec](https://modelcontextprotocol.io/specification/latest) ✅); ChatGPT exige devolver solo lo necesario ([Review](https://developers.openai.com/plugins/deploy/app-review.md) ✅) | Política de privacidad y términos publicados (requisito de ambos directorios ✅); no guardar el texto de la conversación; retención corta |
| **Abuso / scraping** | Una tool pública que devuelve datos de cualquier local puede usarse como proxy gratuito de Places | Límite por IP/cliente y tope diario; devolver **puntajes derivados**, no datos crudos |
| **Costo de Places** | Cada diagnóstico en vivo consume SKUs de pago; las llamadas las inicia el asistente, no una persona | Tope de gasto diario, caché **solo de lo permitido** (place ID es lo único exento; [políticas de Places](https://developers.google.com/maps/documentation/places/web-service/policies) ✅). Costos y ToS: ver `datos.md` y `costos.md` |
| **Inyección de prompts** | El resultado incluye texto de terceros (nombres, reseñas) que el modelo podría interpretar como instrucciones; Claude pide un acuse específico sobre prompt injection ✅ | Sanitizar y limitar campos de texto; no devolver reseñas literales |
| **Información fiscal desactualizada o errónea** | El asistente la repite con autoridad | Cada respuesta con `verificado_el` + link oficial + aviso "consultá a tu contador"; revisión por contador local |
| **Anotaciones incorrectas = rechazo** | ChatGPT las muestra tal cual y rechaza inconsistencias ✅ | Revisar `readOnlyHint`/`openWorldHint` por tool |
| **Disponibilidad geográfica** | No verificada para LATAM (ver §2) | Medir antes de invertir (ver §6) |
| **Competencia / conflicto de interés** | Una herramienta de Fudo que recomienda "Fudo" puede percibirse sesgada | Mostrar siempre la fuente oficial y los límites; no denigrar competidores |
| **Dependencia de plataforma** | Cambios de nombre/políticas (ya pasó con "Apps SDK" → "Plugins" en la documentación) | Servidor MCP estándar, portable entre directorios |
| **Residencia de datos UE** | Los proyectos de OpenAI con residencia UE no pueden enviar plugins MCP ✅ | Usar un proyecto global |

### 4.5 Cómo se mide

**Principio:** el host (ChatGPT/Claude/Gemini) puede no enviar referrer, así que la atribución confiable es **el link que emite el servidor**.

| Evento | Dónde se registra | Propiedades |
|---|---|---|
| `mcp_tool_called` | Servidor | `tool`, `pais`, `host` (si el cliente lo informa durante la inicialización del protocolo; **no lo verifiqué en la especificación** ⚠, ver [Base Protocol](https://modelcontextprotocol.io/specification/2026-07-28/basic.md) y confirmar caso por caso), latencia, error |
| `mcp_diag_completed` | Servidor | `nota`, `tier` |
| `mcp_cta_link_issued` | Servidor | `reporte_id`, `pais` |
| `diag_start`, `result_viewed`, `cta_click`, `cuenta` | Sitio/app (ya en PLAN §2-G2) | con `utm_source=mcp` |

**Convención de UTM del link emitido:**
```
https://fu.do/es-<pais>/crear-cuenta/?utm_source=mcp&utm_medium=assistant&utm_campaign=fudo-diagnostico&utm_content=<chatgpt|claude|gemini|desconocido>&prefill=<token>
```
(La ruta `/es-mx/crear-cuenta/` existe ✅ en el sitio actual de Fudo.)

**Embudo MCP:** invocaciones → diagnósticos completados → links emitidos → clics → cuentas creadas → (a 7 días) activación → (a 60 días) pago. Se compara contra el embudo web con el mismo tamaño de muestra (PLAN §0: ≈680 cuentas por brazo para el experimento principal).

**Criterio de abandono propuesto (a fijar antes):** si en un periodo acordado la tasa de invocación→link emitido o el costo por diagnóstico completado son peores que los del canal web, o si la disponibilidad por país resulta nula en LATAM, se detiene la inversión.

### 4.6 Fases

| Fase | Qué | Requisito | Dependencias |
|---|---|---|---|
| **0 (ahora)** | Solo este informe y la idea en el §c/§g del informe | — | — |
| **1** | Prototipo como **conector personalizado** en Claude (cuenta gratuita permite uno ✅) | Servidor remoto HTTPS; las 3 tools de solo lectura | Gateway de datos en producción (Places) |
| **2** | Envío al **directorio de Claude** (cualquier plan pago ✅) | Política de privacidad, docs, cuenta de prueba, anotaciones | Política legal |
| **3** | Envío al **directorio de ChatGPT** | Verificación de identidad, dominio, 5+3 casos de prueba y video ✅ | Confirmar disponibilidad en LATAM |
| **4** | Gemini | Confirmar fuente oficial y disponibilidad (hoy solo reportes secundarios 🔶) | — |

### 4.7 Lo que esto agrega al informe

- **§c Distribución:** "distribuir el diagnóstico en el canal donde el dueño ya pregunta (ChatGPT, Claude, Gemini) mediante un servidor MCP; hoy no existen ejemplos del lado del comercio en gastronomía, así que lo tratamos como experimento."
- **§g Qué sigue:** servidor de Fase 1–2 con eventos `utm_source=mcp` y los riesgos de §4.4.

---

## 5. Honestidad sobre lo que no se sabe

1. **No verifiqué que un dueño de restaurante de AR/MX/CL/CO/BR pueda usar apps/conectores MCP** en ChatGPT, Claude (por país/plan) o Gemini. La evidencia disponible para Gemini apunta a EE. UU. + inglés 🔶.
2. **No hay demanda medida**: no existen datos de cuántos dueños consultan LLM para estas dudas. Lo que sí hay son señales de búsqueda en Google (autocompletado), en [`distribucion.md`](distribucion.md).
3. El nombre del producto de OpenAI cambió en su documentación (Apps SDK → Plugins) y **no confirmé el anuncio oficial** ⚠.
4. Las políticas de los directorios cambian; revisar las páginas enlazadas el día del envío.
