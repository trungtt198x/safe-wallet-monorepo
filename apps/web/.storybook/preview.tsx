import type { Preview } from '@storybook/nextjs'
import React, { useEffect } from 'react'

import { ThemeProvider, CssBaseline } from '@mui/material'
import { withThemeFromJSXProvider } from '@storybook/addon-themes'
import createSafeTheme from '../src/components/theme/safeTheme'

import '../src/styles/globals.css'

// Syncs data-theme attribute with the theme switcher
const ThemeSyncDecorator = (Story: React.ComponentType, context: { globals?: { theme?: string } }) => {
  const themeMode = context.globals?.theme || 'light'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode)
    document.documentElement.classList.toggle('dark', themeMode === 'dark')
    // Apply muted background to Storybook canvas (matches Figma canvas)
    document.body.style.backgroundColor = 'var(--muted)'
  }, [themeMode])

  return (
    <div style={{ padding: '1rem' }}>
      <Story />
    </div>
  )
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },

  decorators: [
    withThemeFromJSXProvider({
      GlobalStyles: CssBaseline,
      Provider: ThemeProvider,
      themes: {
        light: createSafeTheme('light'),
        dark: createSafeTheme('dark'),
      },
      defaultTheme: 'light',
    }),
    ThemeSyncDecorator,
  ],
}

export default preview
