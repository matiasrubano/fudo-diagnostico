# Marca de Fudo: tokens extraídos de fu.do y tools.fu.do

Fecha de captura: **2026-10-26**. Todo lo de abajo sale del HTML y los CSS publicados, bajados con `curl`. Nada está estimado salvo lo marcado como "calculado" (contrastes, que calculé yo con la fórmula WCAG 2.x).

## 1. Fuentes consultadas

| Fuente | URL | Qué aporta |
|---|---|---|
| HTML home AR (fu.do redirige a /es-ar/) | https://fu.do/es-ar/ | Carga de fuentes (`<link>` a Google Fonts) y lista de CSS |
| CSS del rediseño de la web (`redesign-ce4f2c01.css`, 517 KB) | https://fu.do/assets/css/redesign-ce4f2c01.css | Estilos de la home actual, precios, FAQ, footer, botones |
| CSS legado de la web (`main-6c65faf4.css`, 342 KB) | https://fu.do/assets/css/main-6c65faf4.css | Formulario de crear cuenta, páginas viejas de precios, focus rings |
| CSS de las herramientas gratis (`styles-CC7h4S3L.css`, 100 KB) | https://tools.fu.do/recursos/static/styles-CC7h4S3L.css | **Sistema de tokens con variables CSS** (`--fudo-primary-500`, `--fudo-blue-500`, `--r-*`, `--shadow-*`), el más limpio de los tres |
| HTML tools | https://tools.fu.do/recursos | `theme-color` = `#FFFBEB`, carga de Barlow |
| Variantes de país | https://fu.do/es-ar/, /es-mx/, /es-cl/, /es-co/, /es-pe/, /es-py/, /es-uy/ y https://deli.com.br/pt-br/ (hreflang) | Mismo CSS (`main-6c65faf4.css` + `redesign-ce4f2c01.css`) en todas; Brasil usa la marca "Deli" con los mismos estilos |

Hallazgo clave: **fu.do no define variables CSS de marca** (solo variables de animación en `:root`). Los colores están "hardcodeados" en los selectores. En cambio **tools.fu.do sí tiene un design system con tokens** nombrados, que coincide con los hex de fu.do. Por eso uso tools.fu.do como referencia de nombres y fu.do como confirmación de dónde se usa cada color.

## 2. Colores

### 2.1 Naranja de marca (primario)

| Token | Hex | Dónde aparece (archivo, selector) |
|---|---|---|
| **primary-500 (principal)** | **`#FF5023`** | `redesign-ce4f2c01.css`: `.home-btn--primary` (fondo y borde), `.home-skip-link`, `.home-section-heading`, `.home-btn:focus-visible` (outline), `.np-card--recommended` (borde 2px), `.home-navbar__inner.home-nav-menu-open` (`rgba(255,80,35,0.9)` + blur: el "fondo naranja" del menú). Es el hex más repetido de todo el CSS (213 veces en redesign, 53 en main). `tools.css`: `--fudo-primary-500`, `--primary`, `--ring` |
| primary-600 | `#E84920` | `tools.css`: `--fudo-primary-600` |
| primary-700 | `#D03F00` | `main-6c65faf4.css`: `.text-orange-primary`, `.btn-pricing` / `.create-account-page .button` (botón de crear cuenta), `.stepper .step.active`, checkbox marcado (15 usos); `tools.css`: `--fudo-primary-700` |
| primary-800 | `#AE3617` | `main-6c65faf4.css` (8 usos); `tools.css`: `--fudo-primary-800` (= `--accent-foreground`) |
| primary-900 | `#8C2C13` | `tools.css`: `--fudo-primary-900` |
| primary-400 | `#FF734F` | `tools.css`: `--fudo-primary-400` |
| primary-100 | `#FFC9BB` | `tools.css`: `--fudo-primary-100`; `main.css` (botón terciario hover) |
| primary-50 | `#FFEEE9` | `tools.css`: `--fudo-primary-50` (= `--accent`); `main.css` (3 usos) |
| naranja de texto (eyebrows) | `#BC3409` | `redesign.css`: `.home-eyebrow`, `.home-page-hero__eyebrow` (sobre fondo `rgba(255,80,35,0.1)`) |
| naranja secundario (legado) | `#FF8101` | `main-6c65faf4.css`: estados `:active` de botones (12 usos) |
| naranja de ilustraciones | `#C2410C` | `redesign.css`: `.fudo-slide06__btn--primary` (mockups animados del producto; no es token de UI) |

Nota de accesibilidad (calculado): texto blanco sobre `#FF5023` da **3,27:1**, es decir pasa solo para texto grande (≥18,66 px bold / 24 px). El botón primario de fu.do (16 px / 600, blanco sobre `#FF5023`) **no cumple AA para texto normal**. Para texto naranja sobre blanco/crema o botones chicos usar `#D03F00` (4,78:1 con blanco) o `#BC3409` (5,78:1 con blanco; 5,54:1 sobre `#FFFAEC`).

### 2.2 Azul de acento

| Token | Hex | Dónde aparece |
|---|---|---|
| **blue-500 (acento, token oficial)** | **`#3937FF`** | `tools.css`: `--fudo-blue-500` = `--blue`; `--gradient-cta: linear-gradient(135deg, blue-500, blue-900)`; links `.prose-fudo a` (`var(--color-blue)`). En `.dark`: `--blue: #6664FF` |
| blue-900 | `#12105C` | `tools.css` (fin del gradiente CTA) |
| blue-800 | `#1A1880` | `tools.css` |
| blue-700 | `#2422B3` | `tools.css` |
| blue-600 | `#302EE0` | `tools.css` |
| blue-300 / 200 / 100 / 50 | `#9998FF` / `#BFBEFF` / `#DDDCFF` / `#EEEEFF` | `tools.css` (`--blue-soft` = blue-100, `--sky` = blue-200) |
| **azul noche (fondos oscuros de la web)** | **`#0F1B4E`** | `redesign.css`: `.home-hero` (fondo base bajo la foto), `.home-end-cta__card`, `.np-billing__option[aria-pressed='true']` (toggle activo de Mensual/Semestral/Anual en precios), `.home-testimonial-video__inner`, `.prod-hero__eyebrow--plan` |
| índigo (calculadoras) | `#2F2E8A` | `redesign.css`: `.pvd-sim__value`, `.pvd-sim__slider-fill`, `.pvd-calc__demo-link` (en tint `#E1E1F5`) |
| índigo legado (focus) | `#3938A0` | `main-6c65faf4.css`: focus rings de inputs/botones/dropdowns del formulario de crear cuenta (13 usos) |
| azul link legado | `#2B6BBB` / `#3684E6` | `main-6c65faf4.css`: `.text-link-sm`, links de `.faq-section`, `.pricing-page-v2-initial` |

Cuál usar como "azul de acento": **`#3937FF`** para acentos vivos (links, chips, gradiente CTA) y **`#0F1B4E`** para superficies oscuras y estados activos. Contrastes (calculados): blanco sobre `#3937FF` = 6,64:1; blanco sobre `#0F1B4E` = 16,32:1; `#FF5023` sobre `#0F1B4E` = 4,99:1 (naranja como acento sobre fondo azul noche sí pasa AA).

### 2.3 Neutros y fondos

| Rol | Hex | Dónde aparece |
|---|---|---|
| Texto principal (tinta) | `#1A1A2E` | `redesign.css`: `.new-home` (color base), títulos `.home-*__title` (168 usos). Un negro azulado |
| Texto de cuerpo alternativo | `#333333` / `#3B3B3B` | `redesign.css` (68) / `main.css` (27); `tools.css`: `--foreground` = neutral-700 `#3B3B3B` |
| Tinta de `tools` | `#1F1F1F` | `tools.css`: `--fudo-neutral-900` = `--ink` |
| Texto secundario / muted | `#6B7280` | `redesign.css`: `.home-fold__text`, `.home-band__sub`, footer links (130 usos). 4,83:1 sobre blanco |
| Muted de `tools` | `#6A6A6A` | `tools.css`: `--fudo-neutral-500` = `--muted-foreground` |
| Texto terciario | `#9CA3AF` | `redesign.css` (46) |
| Borde | `#E5E7EB` | `redesign.css`: `.np-card`, `.np-billing__switch`, FAQ (118 usos) |
| Borde de `tools` | `#E2E2E2` (`--border`), `#C6C6C6` (`--input`) | `tools.css` |
| Fondo blanco | `#FFFFFF` | tarjetas, footer (`.home-footer`), `.home-end-cta` |
| **Fondo crema (hero de páginas)** | **`#FFFAEC`** | `redesign.css`: `.home-page-hero`, `.np-plans`, `.home-band--accent`, `.home-segment-section--warm` |
| Fondo crema FAQ / `tools` | `#FFFBEB` | `redesign.css`: `.home-faq`; `tools.css`: `--fudo-cream` = `--background`; `<meta name="theme-color">` de tools |
| Crema profundo | `#F5F0D0` | `tools.css`: `--fudo-cream-deep` = `--surface` |
| Banda gris azulada | `#F5F7FA` | `redesign.css`: `.home-band` (fondo de secciones alternas) |
| Gris muy claro | `#F9FAFB`, `#F1F1F1`/`#F0F0F0` | `redesign.css` (hover de toggles), `tools.css` `--secondary`/`--muted` = `#F1F1F1` |
| Gris azulado oscuro (legado) | `#37394F` | `main-6c65faf4.css`: botones `--secondary` y hover (66 usos) |
| Overlay del hero | `rgba(22,13,7,0.5→0)` | `redesign.css`: `.home-hero__bg::after` (degradé marrón oscuro sobre la foto) |
| Modo oscuro (`tools`) | fondo `#232323`, superficie `#3A3A3A`, `#0D0D0D` | `tools.css`: `.dark` y `--fudo-dark-*` (no se usa en fu.do) |

### 2.4 Semánticos

| Rol | Hex | Fuente |
|---|---|---|
| Error | `#D7001B` | `tools.css` `--fudo-error-500`; `main.css` (`input.error`, outline 2px) |
| Éxito | `#4F9524` (success-600) | `tools.css` `--fudo-success-600` |
| Éxito, badge | texto `#3D741C` sobre `#D2F1C0` | `main.css` (`.badge-text` de precios) |
| Advertencia | `#AC8F00` | `tools.css` `--fudo-warning-500` |
| Verde de estado | `#25B389` | `redesign.css` (13 usos, ilustraciones de mesas libres) |
| Estrellas / destacado | `#F5C542` | `redesign.css`: `.home-hero__star`, `.np-billing__save` |

## 3. Tipografías

| Uso | Familia | Pesos | De dónde se carga | Dónde se declara |
|---|---|---|---|---|
| **Títulos** | **Barlow** | 600, 700, 800 (en `tools` hasta 900) | Google Fonts, `<link>` en el HTML: `https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;...;1,900&display=swap` | `redesign.css`: `:where(.new-home) h1..h6 { font-family:"Barlow" }`, `.home-page-hero__title`, `.home-fold__title`, `.home-band__title`. `main.css`: `body { font-family:'Barlow', sans-serif }` |
| **Cuerpo / UI** | **Inter** | 400, 500, 600, 700 | Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap` | `redesign.css`: `.new-home { font-family:"Inter", sans-serif }`, `.home-btn`, lede, meta |
| Herramientas gratis | **Barlow** para todo (sans y display) | 300–900 | Google Fonts (`family=Barlow:ital,wght@0,300;...;1,400`) y también self-hosted en cada agente | `tools.css`: `--font-sans`, `--font-display = "Barlow", ui-sans-serif, system-ui, sans-serif`; `h1,h2,.font-display { letter-spacing:-1px; font-weight:900 }` |

**Las dos son Google Fonts (licencia OFL, gratis): no hace falta sustituto.** Pares recomendados para la app: Barlow (títulos, 700/800) + Inter (cuerpo).

Escala tipográfica observada en la home (`redesign.css`):

| Elemento | Tamaño / peso / interlineado |
|---|---|
| `.home-page-hero__title` | 56 px / 700 / 1,08, `letter-spacing:-0.02em` |
| `.home-fold__title` | 40 px / 800 / 1,12 |
| `.home-band__title` | 36 px / 600 / 1,15 |
| `.home-faq__title` | 40 px / 800 (32 px en mobile) |
| `.home-gallery__title` | 20 px / 700 |
| lede (`.home-page-hero__lede`) | 20 px / 400 / 1,55, color `#6B7280` |
| cuerpo (`.home-fold__text`, `.home-band__sub`) | 17–18 px / 1,6–1,65, color `#6B7280` |
| eyebrow (`.home-eyebrow`) | 14 px / 700 / MAYÚSCULAS / `letter-spacing:0.08em`, color `#BC3409` |
| botón (`.home-btn`) | 16 px / 600 |

## 4. Radios

| Valor | Uso (selector, archivo) |
|---|---|
| **999px (píldora)** | `.home-btn`, `.np-billing__switch` y `__option`, eyebrows, chips, tags (70 usos en `redesign.css`). `tools.css`: `--r-pill` |
| **16px** | Tarjetas: `.np-card`, `.home-gallery__photo`, `.home-dropdown__featured`, `.home-end-cta__card` en mobile (48 usos). `tools.css`: `--r-xl` = `--radius` (por defecto) |
| 24px | Tarjetas grandes: `.home-end-cta__card`, `.rsv-night` (17 usos). `tools.css`: `--r-2xl` |
| 12px | Íconos de dropdown, skip-link, focus de galerías (38 usos). `tools.css`: `--r-l` |
| 8–9px | Tooltips, inputs chicos (33 usos). `tools.css`: `--r-m` = 8px |
| 30px | `.home-navbar__inner` (barra flotante) |
| 4px (legado) | focus de botones en `main.css` |
| Escala `tools.css` | `--r-xs 3px`, `--r-s 6px`, `--r-m 8px`, `--r-l 12px`, `--r-xl 16px`, `--r-2xl 24px`, `--r-3xl 40px`, `--r-pill 999px` |

Detalle de estilo: la web usa `corner-shape: squircle` en íconos y tarjetas (propiedad nueva, solo Chromium reciente). No es imprescindible replicarla.

## 5. Sombras

| Token | Valor | Dónde |
|---|---|---|
| card | `0 4px 20px rgba(0,0,0,0.10)` | `.np-card` (tarjeta de plan) |
| card recomendada | `0 8px 40px rgba(0,0,0,0.12)` | `.np-card--recommended` |
| suave | `0 1px 2px rgba(17,24,39,0.06)` | `redesign.css` (8 usos) |
| elevada | `0 24px 48px -28px rgba(17,24,39,0.35)` | `redesign.css` (14 usos, la más repetida) |
| flotante | `0 16px 40px rgba(20,25,55,0.18)` | `redesign.css` (12 usos) |
| glow naranja | `0 6px 16px rgba(255,80,35,0.34)` | hover de íconos de dropdown (es la sombra característica: naranja translúcida) |
| tarjeta destacada | `0 8px 22px rgba(255,80,35,0.24)` | `.home-dropdown__featured` |
| `tools.css` | `--shadow-s: 0 1px 2px #0a0a0a0d`; `--shadow-m: 0 2px 5px -2px #0a0a0a0d, 0 4px 10px -2px #0a0a0a1a`; `--shadow-l: 0 8px 16px -4px #0a0a0a14, 0 16px 32px -8px #0a0a0a1f`; `--shadow-xl: 0 20px 25px -5px #0000001a, 0 10px 10px 0 #0000000a` | design system de tools |

## 6. Componentes y movimiento (para copiar el "look")

- **Botón primario:** píldora, `padding:14px 28px`, 16 px/600, borde 2px del mismo color, fondo `#FF5023`, texto blanco (`.home-btn--primary`). Variantes: outline claro (`.home-btn--outline`: borde `rgba(255,255,255,0.7)`), outline oscuro (`.home-btn--outline-dark`: borde y texto `#1A1A2E`), chico (`.home-btn--sm`: `10px 20px`, 14 px). Foco: `outline:2px solid #FF5023; outline-offset:2px`.
- **Tarjeta:** fondo blanco, borde `1px solid #E5E7EB`, radio 16, sombra card, padding `24px 22px 22px`. La recomendada: borde 2px `#FF5023`.
- **Toggle segmentado** (Mensual/Semestral/Anual): píldora blanca con borde `#E5E7EB`, opciones de **alto mínimo 44 px**, activa con fondo `#0F1B4E` y texto blanco (`.np-billing__*`).
- **Transiciones:** `200ms ease` (color, transform), `420ms cubic-bezier(0.4,0,0.2,1)` en la barra de navegación; `tools.css`: `--dur-fast .12s`, `--dur-base .18s`, `--dur-slow .32s`, `--ease-out cubic-bezier(.2,.8,.2,1)`.
- **Contenedores:** `max-width` 1200 px y 1400 px (barra) en `redesign.css`. Padding lateral 128 → 40 → 20 px según ancho (`.home-hero`).
- **Fondos de sección:** alternan blanco, `#F5F7FA` (banda) y crema `#FFFAEC` / `#FFFBEB`; el hero es foto con degradé marrón sobre `#0F1B4E`.

## 7. Qué no se encontró

- Un archivo `tokens.json` o design system público fuera de los CSS: **no encontrado**.
- Una variable CSS `--brand-*` en fu.do: **no encontrado** (los colores están hardcodeados; los nombres de abajo están tomados de `tools.fu.do`).
- Tipografía propietaria o de pago: **no hay** (Barlow e Inter son Google Fonts).
- El logo vectorial como archivo descargable: no lo bajé (el SVG va inline en el HTML). Si se necesita, usar el SVG de `.home-navbar__logo-svg` de https://fu.do/es-ar/.

## 8. Bloque sugerido para `src/theme/tokens.ts`

```ts
// src/theme/tokens.ts
// Fuente: CSS publicados de fu.do y tools.fu.do, capturados el 2026-10-26. Ver docs/research/brand.md
export const tokens = {
  color: {
    primary: {
      50: '#FFEEE9',
      100: '#FFC9BB',
      400: '#FF734F',
      500: '#FF5023', // principal: botones, headings de sección, foco
      600: '#E84920',
      700: '#D03F00', // texto/botones chicos sobre blanco (4,78:1)
      800: '#AE3617',
      900: '#8C2C13',
      text: '#BC3409', // eyebrows y texto naranja sobre crema (5,54:1)
    },
    blue: {
      50: '#EEEEFF',
      100: '#DDDCFF',
      200: '#BFBEFF',
      300: '#9998FF',
      500: '#3937FF', // acento
      600: '#302EE0',
      700: '#2422B3',
      800: '#1A1880',
      900: '#12105C',
      night: '#0F1B4E', // superficies oscuras y estado activo de toggles
      indigo: '#2F2E8A', // calculadoras / simuladores
    },
    ink: '#1A1A2E', // texto principal y títulos
    text: '#3B3B3B', // cuerpo alternativo
    muted: '#6B7280', // texto secundario (4,83:1 sobre blanco)
    subtle: '#9CA3AF',
    border: '#E5E7EB',
    borderStrong: '#C6C6C6',
    bg: '#FFFFFF',
    surface: '#F5F7FA', // bandas alternas
    cream: '#FFFAEC', // hero de páginas
    creamSoft: '#FFFBEB', // fondo FAQ / tools
    creamDeep: '#F5F0D0',
    white: '#FFFFFF',
    success: '#4F9524',
    successBg: '#D2F1C0',
    successText: '#3D741C',
    warning: '#AC8F00',
    error: '#D7001B',
    star: '#F5C542',
  },
  gradient: {
    cta: 'linear-gradient(135deg, #3937FF, #12105C)',
  },
  font: {
    // Ambas son Google Fonts (OFL): no hace falta sustituto.
    display: '"Barlow", ui-sans-serif, system-ui, sans-serif', // títulos 700/800
    body: '"Inter", ui-sans-serif, system-ui, sans-serif', // cuerpo y UI 400-700
    googleFontsHref:
      'https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap',
  },
  radius: {
    xs: '3px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px', // tarjetas (por defecto)
    '2xl': '24px',
    '3xl': '40px',
    pill: '999px', // botones, chips, toggles
  },
  shadow: {
    sm: '0 1px 2px rgba(17,24,39,0.06)',
    card: '0 4px 20px rgba(0,0,0,0.10)',
    cardActive: '0 8px 40px rgba(0,0,0,0.12)',
    lift: '0 24px 48px -28px rgba(17,24,39,0.35)',
    float: '0 16px 40px rgba(20,25,55,0.18)',
    glowPrimary: '0 6px 16px rgba(255,80,35,0.34)',
  },
  motion: {
    fast: '120ms',
    base: '180ms',
    slow: '320ms',
    easeOut: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  layout: {
    container: '1200px',
    minTouch: '44px', // objetivo táctil mínimo (el toggle de precios de Fudo ya usa 44)
  },
  type: {
    hero: { size: '56px', weight: 700, lineHeight: 1.08, letterSpacing: '-0.02em' },
    h2: { size: '40px', weight: 800, lineHeight: 1.12 },
    h3: { size: '20px', weight: 700, lineHeight: 1.25 },
    lede: { size: '20px', weight: 400, lineHeight: 1.55 },
    body: { size: '16px', weight: 400, lineHeight: 1.6 },
    eyebrow: { size: '14px', weight: 700, letterSpacing: '0.08em' },
  },
} as const

export type Tokens = typeof tokens
```

Sugerencia de mapeo a Tailwind: `primary` = `color.primary.500`, `accent` = `color.blue.500`, `night` = `color.blue.night`, `ink`, `cream`, `surface`; texto naranja pequeño con `primary.700` o `primary.text` para pasar AA.
