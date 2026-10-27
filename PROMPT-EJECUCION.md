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
