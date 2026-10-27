# Cambios de la iteración (G5 → A5)

**Entradas:**
- 4 dueños simulados: [Rubén](persona-ruben.md) 6/10, [Mariana](persona-mariana.md) 5/10, [Andrés](persona-andres.md) 5/10 y [Sofía](persona-sofia.md) 4/10. Ninguno crearía la cuenta hoy.
- QA: [report.md](../qa/report.md), con 0 bugs bloqueantes, 1 alta y 8 medias.

**Regla del PLAN:** como máximo 5 cambios, elegidos por impacto. Los bugs de QA se agrupan en el cambio 5.

## Lo que se repitió

| Patrón | Rubén | Mariana | Andrés | Sofía | QA |
|---|---|---|---|---|---|
| La búsqueda nunca dice "no encontrado", mezcla países o confunde el local | ✔ | ✔ | ✔ | ✔✔ (le mostró otro local como si fuera el suyo) | M-4 |
| La home es argentina para todos (pizza en Lanús, voseo, chips) | — | ✔ | ✔ | ✔ | B-13 |
| Las preguntas no reflejan el negocio (sin taquería, sin "me paga la app", sin "¿qué sistema usás?") | ✔ (canal propio) | ✔ | ✔ | ✔ | B-14 |
| No cree el total de plata: quiere poner sus números; la cuenta tiene inconsistencias | ✔ | — | ✔ | ✔ | M-7 |
| Jerga interna visible ("Caliente", "Switcher", `/debug`) y badges pegados al nombre | ✔ | ✔ | ✔ | ✔ | B-2 |
| "Por abrir" muestra un diagnóstico que no corresponde | — | — | — | ✔✔ | B-3 |
| El CTA final es una simulación | ✔ | ✔ | ✔ | ✔ | — |

El último patrón **no se cambia**: el alta de fu.do no acepta precarga (dato de G1) y la demo lo declara. Va al informe como el primer pedido a producto (§g).

## Los 5 cambios

1. **Búsqueda honesta.**
   - Un local se ofrece como "¿Es este?" solo si coincide de verdad: todas las palabras significativas del nombre, o el nombre más la ciudad.
   - Si no hay coincidencia, aparece el estado "No encontramos «X»" con sugerencias ordenadas por el país detectado (IP o landing). Nunca se resuelve un nombre inexistente como otro local.
   - Nunca se mezclan países cuando la búsqueda nombra una ciudad.
2. **"Estoy por abrir" es otra ruta.**
   - Se entra desde la home ("¿Todavía no abriste?") o desde la P1.
   - Lleva directo a una pantalla propia: el Consultor de Nuevos Negocios primero, y después la guía de trámites del país (en CL, la de boleta del SII).
   - No muestra diagnóstico, plata ni ticket de ningún local.
3. **La home habla el idioma del país.**
   - El país se detecta por IP (`x-vercel-ip-country`) y la home cambia la escena del hero, los chips de ejemplo y la voz: tuteo en MX/CL/CO, voseo en AR.
   - Hay link a la landing del país.
   - Se corrigen las filtraciones de voseo ("Elegí al menos una", "Mirá…").
4. **Preguntas que reflejan el negocio y "tus números".**
   - P1 suma Taquería y Hamburguesería.
   - P3 suma "Me paga la app (no cobro directo)", y con esa respuesta no se recomienda facturar ante el ente fiscal.
   - "Con otro sistema" pregunta cuál, y el bloque de quien viene de otro sistema lo nombra y enlaza su guía (Soft Restaurant → guía MX).
   - En "¿Cómo calculamos esto?" el dueño puede editar pedidos por mes y ticket, con recálculo en vivo.
   - La cuenta queda consistente: merma, supuestos y "× ×1".
   - La comisión se cita con fuente del país, o dice "sin dato público en <país>".
   - En una dark kitchen sin reseñas, esa área no cuenta y se explica.
5. **Confianza y barrido de QA.**
   - Sin rótulos internos ni link a `/debug` en la UI.
   - Badge separado del nombre.
   - Aviso junto al ticket de ejemplo sobre de dónde salen los datos.
   - Separador de miles por país.
   - Bugs de QA: B-1 (doble clic), B-4 (historial), B-5 (`<main>`), B-6, B-7 (404 real), B-8 (URL del SAT), B-9, B-10, B-11, B-12, B-14 y B-15.

## Resultado
Aplicado por A5 en 6 commits (`891e747`…`bd3d1a6`); 105 → **170 tests**; desplegado el 27/10/2026.

**Regresión del orquestador en producción:**
- **Búsqueda (Sofía):** "Café Lumbre" muestra "No encontramos «Café Lumbre»", con sugerencias del país primero y sin ofrecer un local ajeno.
- **Por abrir:** "¿Todavía no abriste?" lleva a `#por-abrir` con el Consultor de Nuevos Negocios y la guía de ARCA, sin notas ni plata.
- **Resultado (El Campeón):** en 375 px la nota sigue en 65 y en 1280 px no hay scroll horizontal. "Tus números" (4.000 pedidos y $ 15.000 de ticket) se puede editar, y la merma cierra: $ 60.000.000 × 1,5% = $ 900.000.
- **Rótulos internos:** no se ven "Caliente", "Switcher" ni el link a `/debug`.
- **URLs:** `/no-existe/` devuelve 404 con `noindex`; `/debug/` y `/api/geo` responden 200.
- **Pendiente menor (A5):** el "Atrás" del navegador dentro de "¿Cuál usás?" vuelve a la P2, y recargar con el modal abierto lo cierra.
