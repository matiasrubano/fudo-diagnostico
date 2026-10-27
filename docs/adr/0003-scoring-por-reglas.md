# ADR 0003 · Scoring, recomendaciones y filtro de leads por reglas (sin LLM)

- **Estado:** aceptada (decisión D3 del plan: sin key de Gemini) · 2026-10-26

## Contexto

El diagnóstico entrega una nota por área, recomendaciones localizadas, una estimación de plata y un tier de lead. En la entrevista hay un cambio en vivo de 15 minutos, y un dueño desconfiado tiene que poder ver de dónde sale cada número.

## Decisión

Todo es **código puro y determinista** (`src/domain/`), sin LLM en runtime:

- `scoring.ts`: 5 áreas (Google, reseñas, web y redes, delivery, operación). **Pesos y umbrales son constantes con comentarios al principio del archivo** (`AREA_WEIGHTS`, `CHECK_WEIGHTS`, `THRESHOLDS`). Cada área es un promedio ponderado de chequeos.
  - `not_found` no penaliza: el chequeo se descarta y el resto se reescala; si lo que pudimos leer pesa menos de la mitad del área, no damos nota ("sin datos suficientes").
  - `absent` cuenta como 0.
  - Un rating alto con pocas reseñas se topa (5,0 con 8 reseñas no es una señal creíble).
  - Un área que no aplica (no vende por delivery) no entra en la nota general.
- `recommendations.ts`: lista de reglas `{ cuándo, texto con datos del país, módulo de Fudo con URL }`, ordenadas por la brecha del área + un bonus por impacto económico. Los links salen de la investigación de módulos de Fudo y llevan UTM.
- `leadTier.ts`: volumen proxy = cantidad de reseñas de Google (gratis). Núcleo = 1–3 locales + volumen no bajo + delivery. Núcleo sin sistema → **caliente**; con otro sistema → **switcher**; el resto → **nutrir**; 4+ locales o rubro fuera de segmento → **descartar** (se deriva a ventas); "todavía no abrí" → **por-abrir** (Consultor de Nuevos Negocios). Volumen desconocido no cuenta como bajo.
- `moneyLost.ts`: tres componentes (comisión de apps recuperable, ventas perdidas por ficha incompleta, merma por cobro a mano), cada uno una multiplicación de supuestos con nombre. Se muestra como **estimación simulada**, con rango y la cuenta paso a paso en la UI.

## Consecuencias

- Testeable: los tests corren sobre los 13 locales reales del snapshot (perfil bueno, perfil malo, las 5 rutas, país por país).
- Auditable: nada es una caja negra; el cambio en vivo es tocar un número en un archivo.
- Las recomendaciones son plantillas: menos "personalizadas" que las de un LLM, pero consistentes, citables y sin costo por diagnóstico.
- Los supuestos de la plata perdida (ticket, pedidos por mes, % por apps) **no son datos reales**: están marcados como simulados y deberían calibrarse con datos de Fudo antes de usarse como promesa.
- Con un LLM opcional en el futuro, solo reemplazaría el texto de `build()` de cada regla; las reglas y los números seguirían siendo determinísticos.

## Alternativas descartadas

- **LLM para recomendaciones:** no hay key (D3) y agrega costo, latencia y variabilidad a una demo que tiene que ser repetible.
- **Una sola nota sin áreas:** pierde el vínculo entre cada área y el módulo de Fudo que la resuelve.
