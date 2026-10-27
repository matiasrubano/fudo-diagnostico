# ADR 0004 · Blog prerenderizado a HTML estático para SEO y GEO

- **Estado:** aceptada (decisión D4 del plan) · 2026-10-26

## Contexto

Queremos que un LLM (y Google) pueda **leer y citar** guías que responden las dudas reales de un dueño ("¿cómo facturo con ARCA?", "¿cuánto cobra PedidosYa?"). Los rastreadores de IA suelen no ejecutar JavaScript, así que el contenido tiene que estar en el HTML. La app del diagnóstico es una SPA.

## Decisión

Un **script de build propio** (`scripts/prerender.ts`, ~70 líneas + `scripts/blog.ts` con funciones puras) en vez de un framework de SSG:

1. `content/blog/*.md` (frontmatter YAML + markdown) → HTML con `marked` y `yaml`.
2. Se escribe `dist/blog/<slug>/index.html` y `dist/blog/index.html`, reutilizando el CSS de Tailwind que acaba de compilar Vite (se lee de `dist/index.html`).
3. Cada página: `<title>` y description propios, canonical, OG/Twitter, `lang`, JSON-LD `Article` (autor, `datePublished`, `dateModified`) + `FAQPage` + `BreadcrumbList`, respuesta directa al principio (la escribe el autor en el markdown), FAQ y fuentes visibles, caja "Pendiente de verificación" si hay `verifyNotes`, y un CTA al diagnóstico.
4. La home se prerenderiza dentro de `#root` (React lo reemplaza al montar) y trae meta no genérica, JSON-LD `WebApplication` y links al blog.
5. Se generan `sitemap.xml` y `llms.txt`; `robots.txt` viene de `public/`.
6. Si falta un campo del frontmatter o repite un `slug`, **el build falla**.

URLs: `/blog/` y `/blog/<slug>/` (el país va en el índice, con anclas `#ar`, `#mx`, `#cl`, `#co`, y en el frontmatter).

## Sobre lo que sí y lo que no mueve la aguja (según la investigación en `docs/research/geo-blog.md`)

- Sí: HTML indexable sin JS, contenido original con fuentes oficiales y fecha, autor y fecha visibles, `Article`.
- **`FAQPage`: Google dejó de mostrar su rich result en 2026.** Se mantiene por los LLM y porque la FAQ queda visible en el HTML; no se espera efecto en Search.
- **`llms.txt` es una propuesta (llmstxt.org), no un estándar**, y Google dice que no lo usa. Cuesta casi nada, así que se publica sin esperar resultados.
- `robots.txt` permite los rastreadores de búsqueda de IA (p. ej. `OAI-SearchBot`). También queda permitido `GPTBot` (entrenamiento): es una decisión de negocio que se puede revertir con una línea.
- `datePublished` = `dateModified` = `updatedAt` porque son borradores sin fecha de primera publicación.

## Consecuencias

- Cero dependencias de runtime y sin un framework nuevo que explicar; el script se lee entero en dos minutos.
- Escalar a cientos de páginas o a i18n pediría un SSG real (Astro, Next). Para 8 artículos no se justifica, y las páginas programáticas por ciudad quedaron fuera a propósito (riesgo de contenido en masa).
- Las guías son **borradores** (`status: borrador-demo`): citan fuentes, pero cada una lista lo que falta verificar; las fiscales requieren revisión de un contador local antes de publicarse como definitivas.
- `SITE_URL` define el dominio de canonical y sitemap; mientras no se confirme el deploy usa un placeholder.

## Alternativas descartadas

- **Astro/Next solo para el blog:** un segundo sistema de build y de estilos para 8 archivos markdown.
- **`vite-plugin-ssr`/prerender de la SPA:** serviría para la home, pero el blog no necesita React.
- **Páginas del blog renderizadas en el cliente:** no cumplen "legible sin JS".
