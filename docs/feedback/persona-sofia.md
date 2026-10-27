# P4 · Sofía (simulada)

> **Dueña simulada.** La generó un agente (Claude Sonnet) que recibió **solo** esta persona y la URL, sin contexto del proyecto, de Fudo ni del caso. Navegó la app en producción con Playwright (375×812, locale es-CL) el 27/10/2026. No es una usuaria real. No llegó a abrir la guía de boleta del SII ni el link del Consultor.

**Persona:** Sofía, 26, "por abrir" la cafetería "Café Lumbre" en Providencia, Santiago (CL); todavía sin local.

| | |
|---|---|
| Ruta | por-abrir (y, probando, caliente con un local ajeno) |
| ¿Haría clic? | **Sí en el Consultor de Nuevos Negocios** ("a pesar de la página, no gracias a ella"); **no** en crear cuenta |
| Nota | **4/10** |
| Frase que la convenció | "Antes de pensar en un sistema, conviene tener el plan: identidad, competidores, carta, compras y un plan de redes de 4 semanas, más la guía de trámites según tu ubicación." |
| Frase que la frustró | "Aunque no marcaste las apps, tu local figura en 2 (PedidosYa y Uber Eats, entre otras)" |
| ¿Descartada o encaminada? | "Un poco las dos, pero más descartada" |

## Recorrido (resumen)
1. Home argentina ("pizza en Lanús", voseo). Siguió solo porque se la recomendaron.
2. **"Café Lumbre" se resolvió como Casa Salvo Café** (otro local, 3.117 reseñas) con "¿Es este tu local?", sin avisar que no encontró el suyo. Con "cafetería Lumbre" sí vio "No encontramos…", con sugerencias de otros países.
3. P1 tiene "Todavía no abrí": "alguien pensó en mí". Pero **salta al diagnóstico completo de Casa Salvo**: 80/100, "$1.013.000 que se te escapan", "Deja de cobrar y facturar a mano (SII)", "Aunque no marcaste las apps…".
4. **El bloque del Consultor de Nuevos Negocios está al final**, debajo de recomendaciones que no aplican.
5. Ruta "Cafetería": P2/P3 sin opción "todavía no vendo / aún no cobro"; "Tu Fudo ya viene con tu local cargado" con el nombre y los horarios de Casa Salvo; etiqueta "Caliente" visible.
6. La landing `/cl/` (SII, boleta, CLP) le pareció mucho mejor, pero la home no la llevó ahí.

## Objeciones
- ¿Es de Fudo? ("demo · no oficial").
- ¿Por qué aparece otro local en su diagnóstico?
- ¿De dónde salen $1.013.000 si no tiene local?
- ¿Qué es el Consultor? ¿Pide datos?
- ¿Fudo sirve para un café chico que parte de cero?
- Vino por permisos y boleta electrónica.

## Problemas concretos (fuera del personaje)
- Falso positivo de búsqueda: un nombre inexistente se resuelve como otro local sin aviso.
- "Todavía no abrí" no debería mostrar el diagnóstico de un local ajeno: tiene que ir directo al Consultor, con la guía del SII.
- Copy: home argentina para todos, voseo y tuteo mezclados ("Elegí al menos una"), "Casa Salvo Cafétú", etiqueta "Caliente" visible.
