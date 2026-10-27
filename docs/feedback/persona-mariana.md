# P2 · Mariana (simulada)

> **Dueña simulada.** La generó un agente (Claude Sonnet) que recibió **solo** esta persona y la URL, sin contexto del proyecto, de Fudo ni del caso. Navegó la app en producción con Playwright (375×812 y 1280×800) el 27/10/2026, entrando por la raíz como si viniera de Google. No es una usuaria real.

**Persona:** Mariana, 34, taquería "Tacos Hola El Güero" en CDMX (MX), 2 sucursales, usa otro POS (Soft Restaurant), miedo a perder datos y a fallar con el SAT.

| | |
|---|---|
| Ruta | switcher |
| ¿Crearía la cuenta? | **No** (el botón es simulado y su miedo principal queda "como tarea para el contador") |
| Nota | **5/10** |
| Frase que la convenció | "Ya tienes un sistema, así que lo que importa es no perder lo que cargaste." |
| Frase que la espantó | "Hoy el alta de fu.do no acepta precarga de datos, así que este botón es una simulación." |
| ¿Sintió que entendía que ya tiene sistema? | A medias: el bloque switcher y la guía de Soft Restaurant sí; pero no le pregunta **cuál** sistema y las recomendaciones (web, delivery propio, carta QR) son de alguien que empieza de cero |

## Recorrido (resumen)
1. Entró por `/`: "Viernes 21:30… pizza en Lanús", chips de pizzerías argentinas y voseo. "Esto es de otro país."
2. Buscó su taquería: apareció con su dirección real y 1.600 reseñas ("eso sí me sorprendió"), pero también un bar de Buenos Aires.
3. P1 sin opción "Taquería" → eligió Restaurante. P2 mezcla tuteo con "Elegí al menos una". P3 "Con otro sistema" sin preguntar cuál. P4 "2 o 3 locales".
4. Resultado tipo comanda ("me gustó, parece de restaurante"): 79/100; delivery "no lo pudimos leer"; $26.300/mes simulado.
5. Comparación: "puesto 4 de 4" contra una taquería de 8 reseñas y un bar: "poco serio". Bug "Tacos Hola El Güerotú".
6. Recomendación de delivery propio asume que vende por apps aunque el área dice "no lo pudimos leer".
7. Bloque "Pásate a Fudo sin empezar de cero" con sus datos reales, Plan Inicial $360/mes y "migramos tus datos": "eso sí me habló".
8. La palabra interna "Switcher" visible.
9. La landing `/mx/` sí le hablaba a ella: "debería haber sido la primera pantalla".
10. La guía "Alternativa a Soft Restaurant" es "lo más útil de todo el sitio", aunque las cajas "Borrador de demo / Pendiente de verificación" le restan credibilidad.

## Objeciones para migrar (y si la página las contesta)
- Exportar datos de Soft Restaurant: no ("No lo verificamos").
- Migrador desde Soft Restaurant: a medias (solo importación por Excel).
- Facturación el día del cambio y validez de facturas anteriores: a medias / no.
- Precio para 2 sucursales: no.
- Impresoras, cajón y terminal: a medias.
- Plazo, acompañamiento, pagar dos sistemas en paralelo: no.

## Problemas concretos (fuera del personaje)
- La raíz está localizada a Argentina; quien llega desde MX ve la versión equivocada (debería sesgarse por IP o llevar a `/mx/`). Mezcla voseo y tuteo ("Elegí al menos una", "Mirá cómo está tu local").
- Bugs: "Güerotú" (badge pegado), separador de miles inconsistente ("1.600" vs "1,600"), "Switcher" visible, recomendación de delivery contradictoria, comparación con locales no comparables.
- Para quien ya tiene sistema: no pregunta cuál, no hay precio por sucursal, el CTA es solo simulación.
