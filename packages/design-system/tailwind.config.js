/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/web/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Design tokens synced from Figma
      colors: {
        // Primitive colors from Figma
        'primitive-white': 'var(--ds-color-primitive-white)',
        'primitive-black': 'var(--ds-color-primitive-black)',

        // Semantic colors from Figma
        surface: 'var(--ds-color-bg-surface)',
        'text-primary': 'var(--ds-color-text-primary)',

        // Shadcn semantic colors (fallbacks)
        border: 'hsl(var(--ds-color-border-main, 214.3 31.8% 91.4%))',
        input: 'hsl(var(--ds-color-border-main, 214.3 31.8% 91.4%))',
        ring: 'hsl(var(--ds-color-primary-main, 222.2 47.4% 11.2%))',
        background: 'var(--ds-color-bg-surface)',
        foreground: 'var(--ds-color-text-primary)',
        primary: {
          DEFAULT: 'hsl(var(--ds-color-primary-main, 222.2 47.4% 11.2%))',
          foreground: 'hsl(var(--ds-color-primary-foreground, 210 40% 98%))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--ds-color-secondary-main, 210 40% 96.1%))',
          foreground: 'var(--ds-color-text-primary)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--ds-color-error-main, 0 84.2% 60.2%))',
          foreground: 'hsl(var(--ds-color-primary-foreground, 210 40% 98%))',
        },
        muted: {
          DEFAULT: 'hsl(var(--ds-color-background-light, 210 40% 96.1%))',
          foreground: 'hsl(var(--ds-color-text-secondary, 215.4 16.3% 46.9%))',
        },
        accent: {
          DEFAULT: 'hsl(var(--ds-color-background-light, 210 40% 96.1%))',
          foreground: 'var(--ds-color-text-primary)',
        },
        popover: {
          DEFAULT: 'var(--ds-color-bg-surface)',
          foreground: 'var(--ds-color-text-primary)',
        },
        card: {
          DEFAULT: 'var(--ds-color-bg-surface)',
          foreground: 'var(--ds-color-text-primary)',
        },
      },
      borderRadius: {
        lg: 'var(--ds-radius-lg, 0.5rem)',
        md: 'var(--ds-radius-md)',
        sm: 'var(--ds-radius-sm, calc(var(--ds-radius-md) - 4px))',
      },
      spacing: {
        // Design system spacing tokens with semantic names
        'ds-1': 'var(--ds-spacing-8)', // 8px
        'ds-2': 'var(--ds-spacing-16)', // 16px
      },
    },
  },
  plugins: [],
}
