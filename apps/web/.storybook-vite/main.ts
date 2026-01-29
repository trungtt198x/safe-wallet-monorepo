import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageJsonPath = path.join(__dirname, '../package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

process.env.NEXT_PUBLIC_APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version
process.env.NEXT_PUBLIC_APP_HOMEPAGE = process.env.NEXT_PUBLIC_APP_HOMEPAGE || packageJson.homepage

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@chromatic-com/storybook',
    '@storybook/addon-themes',
    '@storybook/addon-designs',
    '@storybook/addon-docs',
  ],

  framework: '@storybook/react-vite',

  core: {
    disableTelemetry: true,
  },

  staticDirs: ['../public'],

  env: (config) => ({
    ...config,
    NEXT_PUBLIC_HUBSPOT_CONFIG: process.env.NEXT_PUBLIC_HUBSPOT_CONFIG ?? '',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version,
    NEXT_PUBLIC_APP_HOMEPAGE: process.env.NEXT_PUBLIC_APP_HOMEPAGE || packageJson.homepage,
  }),

  typescript: {
    reactDocgen: 'react-docgen',
  },

  async viteFinal(config) {
    const { mergeConfig } = await import('vite')
    const svgr = (await import('vite-plugin-svgr')).default
    const react = (await import('@vitejs/plugin-react')).default

    return mergeConfig(config, {
      plugins: [
        svgr(),
        react({
          jsxRuntime: 'automatic',
        }),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          // Monorepo package aliases
          '@safe-global/utils': path.resolve(__dirname, '../../../packages/utils/src'),
          '@safe-global/store': path.resolve(__dirname, '../../../packages/store/src'),
          '@safe-global/theme': path.resolve(__dirname, '../../../packages/theme/src'),
        },
      },
      define: {
        'process.env': {},
      },
      esbuild: {
        jsx: 'automatic',
      },
    })
  },
}

export default config
