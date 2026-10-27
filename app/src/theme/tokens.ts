// Tokens de marca de Fudo. UN solo archivo: tailwind.config.ts los lee desde acá.
// Fuente: CSS publicados de fu.do y tools.fu.do, capturados el 2026-10-26. Ver docs/research/brand.md
export const tokens = {
  color: {
    primary: {
      50: '#FFEEE9',
      100: '#FFC9BB',
      400: '#FF734F',
      500: '#FF5023', // principal de marca. Blanco encima da 3,27:1: SOLO texto grande (>=24px o >=18,66px bold)
      600: '#E84920',
      700: '#D03F00', // botones y texto chico: blanco encima 4,78:1 (pasa AA)
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
      night: '#0F1B4E', // superficies oscuras y estado activo
      indigo: '#2F2E8A',
    },
    ink: '#1A1A2E', // texto principal y títulos
    text: '#3B3B3B', // cuerpo alternativo
    muted: '#5B6270', // texto secundario (un toque más oscuro que #6B7280 para AA sobre crema y gris)
    subtle: '#9CA3AF',
    border: '#E5E7EB',
    borderStrong: '#C6C6C6',
    bg: '#FFFFFF',
    surface: '#F5F7FA',
    cream: '#FFFAEC',
    creamSoft: '#FFFBEB',
    creamDeep: '#F5F0D0',
    white: '#FFFFFF',
    success: '#4F9524',
    successBg: '#D2F1C0',
    successText: '#3D741C',
    warning: '#AC8F00',
    warningText: '#7A6500',
    error: '#D7001B',
    star: '#F5C542',
    // La comanda (ticket de cocina): papel cálido, tinta oscura y regla punteada
    ticket: {
      paper: '#FFFDF7',
      ink: '#1A1A2E',
      rule: '#8A8472', // línea punteada entre renglones
      stamp: '#D03F00', // sello "simulado" y total
    },
    // Texto sobre superficies azul noche (header, hero, pie)
    onNight: {
      text: '#FFFFFF',
      muted: '#C9CCF5', // 10,9:1 sobre #0F1B4E
      accent: '#FF734F', // naranja claro para texto chico sobre azul noche
    },
  },
  gradient: {
    cta: 'linear-gradient(135deg, #3937FF, #12105C)',
    // Fondo del hero: azul noche con un reflejo naranja de cocina encendida
    hero: 'radial-gradient(1200px 500px at 85% -10%, rgba(255,80,35,0.28), transparent 60%), linear-gradient(#0F1B4E, #0F1B4E)',
  },
  font: {
    // Ambas son Google Fonts (OFL).
    display: '"Barlow", ui-sans-serif, system-ui, sans-serif',
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
    // Números y texto de la comanda (tipografía de ticket, ancho fijo)
    mono: '"IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
    googleFontsHref:
      'https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
  },
  radius: {
    xs: '3px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px', // tarjetas
    '2xl': '24px',
    '3xl': '40px',
    pill: '999px', // botones, chips
  },
  shadow: {
    sm: '0 1px 2px rgba(17,24,39,0.06)',
    card: '0 4px 20px rgba(0,0,0,0.10)',
    cardActive: '0 8px 40px rgba(0,0,0,0.12)',
    lift: '0 24px 48px -28px rgba(17,24,39,0.35)',
    float: '0 16px 40px rgba(20,25,55,0.18)',
    glowPrimary: '0 6px 16px rgba(255,80,35,0.34)',
  },
  layout: {
    container: '1200px',
    minTouch: '44px', // objetivo táctil mínimo
  },
} as const

export type Tokens = typeof tokens
