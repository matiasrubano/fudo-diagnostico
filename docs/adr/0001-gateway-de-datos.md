# ADR 0001 · Gateway de datos con proveedores intercambiables

- **Estado:** aceptada (decisión D1 del plan) · 2026-10-26

## Contexto

El diagnóstico necesita datos de un local (nombre, dirección, rating, reseñas, horarios, web, apps de delivery). La fuente ideal es Google Places API (New), pero para una demo de entrevista no queremos depender de una key, de facturación en Google Cloud ni de la red. Además, el equipo que lee el repo tiene que ver cómo se pasaría a producción.

## Decisión

Una interfaz única, `PlaceDataProvider` (`search`, `getDetails`, `suggest?`), con tres implementaciones que devuelven el **mismo esquema** (cada campo con `status` y `provenance`):

- `SnapshotProvider` (default): restaurantes reales capturados el 26/10/2026.
- `GooglePlacesProvider`: llamadas reales a Places API (New) con field masks mínimos; se activa con `DATA_SOURCE=places` y `GOOGLE_PLACES_API_KEY`.
- `MockProvider`: datos ficticios para tests.

`createGateway` elige por `DATA_SOURCE`. Si `places` falla (error HTTP, cuota, red) o no hay key, cae a `snapshot` y lo deja en el log. El frontend solo habla con `/api/*`: nunca ve el proveedor ni las keys.

## Consecuencias

- Pasar a producción es **cambiar una variable de entorno**; el código ya está escrito y testeado con un fixture ficticio.
- La UI no cambia entre proveedores: los badges salen de `provenance` ("real · capturado el…", "en vivo", "simulado").
- Agregar una fuente (otro país, otra API) es implementar una interfaz de dos métodos.
- Costo: un mapeo por proveedor al esquema común. Los campos que Places no entrega (Instagram, links de delivery, cantidad de locales) quedan `not_found`.

## Alternativas descartadas

- **Llamar a Places directo desde el front:** expone la key y acopla la UI a Google.
- **Solo snapshot, sin proveedor real:** la demo anda, pero el informe tendría que prometer el paso a producción sin código que lo respalde.
- **Solo Places:** la demo dependería de una key y de facturación habilitada, y de que el entrevistador escriba un local que Places encuentre justo en ese momento.
