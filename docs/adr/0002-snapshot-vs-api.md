# ADR 0002 · Snapshot de locales reales para la demo vs. API en vivo

- **Estado:** aceptada con riesgo conocido · 2026-10-26

## Contexto

La demo tiene que andar sin red ni keys y con locales **reales**, para que el dueño (o el entrevistador) reconozca los datos. Hay dos caminos: una captura fechada de 13 locales (`app/data/snapshots/*.json`) o consultar Google Places en vivo.

## Decisión

- La demo corre por defecto sobre el **snapshot**. Cada campo trae `provenance` con fuente, URL, fecha de captura y si es real; la UI lo muestra ("real · capturado el 26/10/2026") y el footer lo explica.
- No se guardaron datos personales: ni nombres ni textos de reseñas, ni dueños, ni teléfonos, ni fotos.
- `not_found` (no sabemos) y `absent` (verificado que no existe) se distinguen en el snapshot, en el scoring y en la UI.
- En producción el dato se consulta en vivo con `GooglePlacesProvider` ([ADR 0001](0001-gateway-de-datos.md)).

## Riesgo de ToS (leer antes de hacer público el repo)

Los Términos de Google Maps Platform (§3.2.3) no permiten cachear ni copiar el contenido de Places más allá de lo autorizado: solo el `place_id` se puede guardar sin límite y la latitud/longitud hasta 30 días. **Nombre, dirección, rating, reseñas y horarios no se pueden almacenar** ([docs/research/datos.md §1.6–1.7](../research/datos.md)).

Este snapshot no vino de la API (no hubo key) sino de la ficha pública de Google vista en el navegador y de las fichas de PedidosYa/Rappi/Uber Eats, pero el contenido de origen es el mismo y el riesgo existe si el repo es público. Mitigaciones:

- el snapshot está **fechado y declarado** como solo para la demo, en la UI, en el README y acá;
- son datos públicos del negocio, un conjunto chico (13), sin reseñas ni fotos;
- el informe lo declara y propone el camino a producción (API oficial);
- **decisión pendiente para Matías (G-OK0):** repo público con el snapshot, repo privado, o repo público con el snapshot reducido a lo no sensible (p. ej. solo el `place_id`) y los datos cargados en el deploy. No es asesoramiento legal.

## Consecuencias

- La demo es determinista y gratis; el entrevistador puede repetir un recorrido y llegar al mismo resultado.
- Un local que no está en el snapshot no se puede diagnosticar: la UI lo dice ("en la demo cubrimos estos locales reales") y ofrece sugerencias clickeables. En producción lo resuelve Places.
- Los datos envejecen: nada del snapshot debe leerse como vigente.

## Alternativas descartadas

- **Places en vivo en la demo:** más fiel al producto, pero depende de key, facturación y red, y rompe la repetibilidad.
- **Datos 100% inventados:** sin riesgo de ToS, pero se pierde el efecto "esto es mi local".
- **Snapshot de la API de Places:** el cache de campos de Places está explícitamente prohibido.
