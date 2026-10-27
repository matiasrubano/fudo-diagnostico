# QA responsive y funcional (G4)

- **App:** https://fudo-diagnostico.vercel.app (producción, 27/10/2026, versión post-rediseño)
- **Agente:** A3 (Claude Sonnet). Herramientas: Playwright (Chromium), axe-core (WCAG A/AA + best-practices), Lighthouse móvil (throttling simulado), curl/Python para el HTML sin JS.
- **Capturas:** `docs/qa/screenshots/` (`<ancho>-<caso>-<paso>.png`, ~115 PNG).
- El informe lo devolvió A3 como texto y lo guardó el orquestador.

## 1. Resumen ejecutivo

**Bloqueantes: 0.** El flujo completo (home → buscar → confirmar → 4 preguntas → resultado → "Crear mi cuenta" → modal) anda en 360, 375, 768, 1024 y 1280 px:
- sin scroll horizontal, solapamientos ni cortes de texto;
- consola limpia;
- axe sin violaciones de contraste en 25 estados.

**Ruteos y países:**
- Los 4 ruteos y el descarte caen bien.
- Hay un local real por país.
- BR dice "Deli" y avisa que el portugués queda fuera de alcance.

**Datos:** los 13 tickets coinciden con su JSON (0 diferencias) y muestran el badge "real · capturado el 26/10/2026".

**SEO:** landings, blog, JSON-LD, sitemap, robots y llms.txt están bien, con las salvedades de §5.

**Para arreglar antes de la entrevista:** 1 bug de severidad alta y 8 medias.

**Lighthouse móvil:**

| URL | Perf. | Acces. | Best pr. | SEO | FCP/LCP | TBT/CLS | Peso |
|---|---|---|---|---|---|---|---|
| Home | 84 | 98 | 100 | 100 | 3,4/3,4 s | 0/0 | 236 KiB |
| `/ar/` | 81 | 98 | 100 | 100 | 3,5/3,5 s | 0/0 | 235 KiB |
| Artículo ARCA | 89 | 100 | 100 | 100 | 3,0/3,0 s | 0/0,038 | 94 KiB |

- **JS:** 97 KB gzip; el blog no carga JS.
- **API:** ≈230 ms.
- **Escritorio (Playwright):** FCP/LCP de 1,3 s.

## 2. Cobertura

| # | Punto | Resultado |
|---|---|---|
| 1 | Flujo en 360/375/768/1024/1280, con capturas | OK |
| 2 | Responsive, contraste, carga, errores y teclado | B-1, B-4, B-6; el resto OK |
| 3 | 4 ruteos + descarte, un local por país, voz | Ruteos OK; B-2, B-3, B-12, B-13, B-14 |
| 4 | Landings, blog, SEO sin JS, sitemap, crawl | OK con B-7, B-8, B-10, B-11 |
| 5 | Real vs simulado (13 locales contra su JSON) y `/debug` | OK |
| 6 | Performance | OK; mejoras en §6 |

## 3. Matriz caso × ancho

`—` = no probado en ese ancho (lógica independiente del ancho, verificada en 375).

| Caso | 360 | 375 | 768 | 1024 | 1280 |
|---|---|---|---|---|---|
| Flujo caliente + modal (El Campeón, AR) | ok | ok (B-2) | ok (B-2) | ok | ok (B-2) |
| Home y landings `/ar /mx /cl /co` | B-5 | B-5 | B-5 | B-5 | B-5 |
| Blog (índice y 2 artículos), `/debug` | ok | ok | ok | ok | ok |
| Switcher (AR, MX) | — | ok (B-2) | ok (B-2) | — | ok (B-2) |
| Nutrir: poco volumen (Piki) y sin delivery (Ladina) | — | ok (B-2) | ok (B-2) | — | ok (B-2) |
| Por abrir (CL, Casa Salvo) | — | B-3 | B-3 | — | B-3 |
| Descartar (4+ locales) | — | ok (B-2) | ok (B-2) | — | ok (B-2) |
| MX / CL (tuteo) | — | B-13 | B-13 | — | B-13 |
| CO (tuteo, dark kitchen) | — | B-13, B-14 | B-13, B-14 | — | B-13, B-14 |
| BR (Deli) | — | B-12 | B-12 | — | B-12 |
| No encontrado, 1 letra, proveedor caído, latencia de 3 s | — | ok | — | — | — |
| Texto largo de 300 caracteres | — | **B-6** | — | — | — |
| Doble clic / doble tap | — | **B-1** | — | — | — |
| Atrás del navegador / recarga | — | **B-4** | — | — | — |
| Teclado (flujo + modal) | — | ok (M-6, B-15) | — | — | — |

## 4. Evidencia destacada

- **Errores:**
  - "No encontrado" muestra un mensaje honesto y 13 locales clickeables.
  - Con 1 letra aparece "Escribí al menos 2 letras." (`role=alert`).
  - Si `/api` cae o devuelve 500: "No pudimos buscar ahora…", y reintenta bien.
  - Si `diagnose` devuelve 500: mensaje y opción "Diagnosticar otro local".
  - Con 3 s de latencia: "Buscando…" con los chips deshabilitados.
  - Las entradas `<script>`, "ñandú" y espacios se escapan bien.
- **Teclado:**
  - El orden es lógico y el foco es visible (3 px). Al cambiar de pantalla, el foco va al `<h1>`.
  - El modal es un `<dialog>` nativo: el fondo queda inerte, Escape lo cierra y el foco vuelve al botón.
- **Ruteos:**
  - caliente: "Tu Fudo ya armado" con datos reales, carta simulada, plan real y alta simulada;
  - switcher: "Migramos tus datos (simulado)" y link real a la importación por Excel;
  - nutrir: email validado que responde "Listo (simulado)";
  - por abrir: link al Consultor;
  - descartar: "Hablar con ventas".
- **SEO:**
  - 14 URLs, todas 200, con title, description, OG, canonical y `lang` por país.
  - `hreflang` simétrico.
  - JSON-LD válido: `WebApplication`, `BreadcrumbList`, `CollectionPage`, `Article` y `FAQPage` (5/5 preguntas visibles).
  - El sitemap tiene `lastmod`.
  - Crawl: 15 links internos sin roturas. De 48 externos, 46 OK, 1 roto (B-8) y uber.com da 406 solo a clientes que no son navegador.
- **Datos:**
  - Nombre, calle, rating, reseñas y vecinos coinciden con el JSON en los 13 locales.
  - Lo simulado aparece marcado como simulado.
  - La dark kitchen sin rating muestra "no lo pudimos leer".
  - `/debug` registra los 9 eventos, cuenta sesiones únicas y persiste en `localStorage`.

## 5. Bugs

### Alta
- **B-1 · El doble clic o doble tap contesta la pregunta siguiente en silencio.**
  - Doble clic en "Sí, es este" → la P1 queda respondida como "bar".
  - Doble clic en una opción de la P3 → la P4 queda en "4 o más" → nivel Descartar.
  - Arreglo: `App.tsx` (`pick`/`answer`), `Questions.tsx`, `PickPlace.tsx`. Hay que bloquear las opciones durante la transición.
  - Captura: `375-int-01-doble-click-confirmar-salta-q1.png`.

### Media
- **B-2 · Se ven los rótulos internos "Caliente / Switcher / Nutrir / Descartar / Por abrir".** Están en `Routes.tsx` (~l.372) y en `copy.tiers`.
- **B-3 · "Todavía no abrí" arma ticket, recomendaciones y plata perdida con respuestas por defecto** (`DEFAULTS_BEFORE_OPENING` en `App.tsx`). Captura: `375-porabrir-cl-07-resultado.png`.
- **B-4 · El botón Atrás del navegador sale de la app a mitad del cuestionario, y recargar el resultado vuelve a la home.** Hay que usar `pushState`/`popstate` o `sessionStorage`.
- **B-5 · La home y las landings no tienen `<main>`** (axe `landmark-one-main` + `region`). Están en `Home.tsx` y `scripts/pages.ts`.
- **B-6 · 300 caracteres sin espacios generan 5.166 px de scroll horizontal** en "No encontramos…". Se arregla con `break-words` y `maxLength`.
- **B-7 · Soft-404:** las URLs inexistentes devuelven 200 con la home e `index, follow` (por el rewrite de `vercel.json`).
- **B-8 · Fuente rota en 2 artículos de México:** apuntan a `wwwmatnp.sat.gob.mx`, que no resuelve por DNS; el host correcto es `wwwmat.sat.gob.mx`.
- **B-9 · El link "Guías" del header mide 38×44 px**, por debajo de los 44 px pedidos.

### Baja
- **B-10:** el JSON-LD `Article` no tiene `publisher`.
- **B-11:** `/debug/` hereda title, canonical y robots de la home; el link a `/debug` hace un 308; a `llms.txt` le falta `/blog/`.
- **B-12:** en BR, el pie legal y el aviso de precio siguen diciendo "Fudo"/"fu.do".
- **B-13:** en MX, CL, CO y BR aparece el voseo "Elegí al menos una".
- **B-14:** dice "Vendes con volumen…" aunque el volumen es desconocido.
- **B-15:** el clic fuera del modal no lo cierra.

## 6. Mejoras sugeridas

- **M-1:** servir las fuentes desde el propio dominio con preload, y dividir el bundle (`Debug`, `Routes` y `Modal` con lazy).
- **M-2:** `immutable` para `/assets/*` y cabeceras de seguridad.
- **M-3:** "Probar de nuevo" conservando las respuestas.
- **M-4:** "Buscar de nuevo" arriba de la lista y orden por país detectado.
- **M-5:** loader y `aria-live` mientras busca.
- **M-6:** enlace "Saltar al contenido".
- **M-7:** 3 locales de AR dan exactamente "$ 1.688.000", porque la fórmula depende solo de la banda de volumen.
- **M-8:** `trailingSlash` agrega un 308 en `/api`.
- **M-9:** `og:image` y `hreflang` en el sitemap.
- **M-10:** cosmética del ticket y del hero de las landings.
- **M-11:** falta Lighthouse de escritorio y probar con un lector de pantalla.
