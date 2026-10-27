import type { Config } from 'tailwindcss'
import { tokens } from './src/theme/tokens'

// Tailwind no define colores propios: todo sale de src/theme/tokens.ts
export default {
  // scripts/ y content/ incluidos porque el prerender del blog usa clases de Tailwind
  content: ['./index.html', './src/**/*.{ts,tsx}', './scripts/**/*.ts'],
  theme: {
    extend: {
      colors: {
        primary: tokens.color.primary,
        blue: tokens.color.blue,
        ink: tokens.color.ink,
        body: tokens.color.text,
        muted: tokens.color.muted,
        subtle: tokens.color.subtle,
        line: tokens.color.border,
        cream: tokens.color.cream,
        'cream-soft': tokens.color.creamSoft,
        surface: tokens.color.surface,
        night: tokens.color.blue.night,
        success: tokens.color.success,
        'success-bg': tokens.color.successBg,
        'success-text': tokens.color.successText,
        'warning-text': tokens.color.warningText,
        danger: tokens.color.error,
        star: tokens.color.star,
      },
      fontFamily: {
        display: [tokens.font.display],
        sans: [tokens.font.body],
      },
      borderRadius: {
        xl: tokens.radius.xl,
        '2xl': tokens.radius['2xl'],
        pill: tokens.radius.pill,
      },
      boxShadow: {
        card: tokens.shadow.card,
        lift: tokens.shadow.lift,
        float: tokens.shadow.float,
        glow: tokens.shadow.glowPrimary,
      },
      backgroundImage: {
        cta: tokens.gradient.cta,
      },
      minHeight: { touch: tokens.layout.minTouch },
      minWidth: { touch: tokens.layout.minTouch },
      maxWidth: { container: tokens.layout.container },
    },
  },
  plugins: [],
} satisfies Config
