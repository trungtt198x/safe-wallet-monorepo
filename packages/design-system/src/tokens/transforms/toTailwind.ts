/**
 * Tailwind Config Transformer
 *
 * Transforms design tokens into a Tailwind CSS configuration
 */

import type { Config } from 'tailwindcss'
import { removePxSuffix } from './utils'

interface TokenFile {
  figma?: {
    fileKey: string
    lastSync: string | null
  }
  [key: string]: unknown
}

interface ColorTokens {
  primitive: Record<string, { value: string; type: string }>
  semantic?: {
    light?: Record<string, unknown>
    dark?: Record<string, unknown>
  }
}

interface SpacingTokens {
  [key: string]: { value: string; type: string }
}

interface TypographyTokens {
  fontFamily?: Record<string, { value: string }>
  fontSize?: Record<string, { value: string }>
  fontWeight?: Record<string, { value: string | number }>
  lineHeight?: Record<string, { value: string | number }>
}

interface RadiusTokens {
  [key: string]: { value: string; type: string }
}

interface ShadowTokens {
  [key: string]: { value: string; type: string }
}

/**
 * Generate Tailwind colors from color tokens
 */
function generateTailwindColors(colorTokens: ColorTokens): Record<string, string> {
  const colors: Record<string, string> = {}

  // Add primitive colors
  Object.entries(colorTokens.primitive).forEach(([name, token]) => {
    colors[name] = token.value
  })

  return colors
}

/**
 * Generate Tailwind spacing from spacing tokens
 */
function generateTailwindSpacing(spacingTokens: SpacingTokens): Record<string, string> {
  const spacing: Record<string, string> = {}

  Object.entries(spacingTokens).forEach(([name, token]) => {
    // Convert to rem for Tailwind (assuming 16px base)
    const pxValue = removePxSuffix(token.value)
    const remValue = pxValue / 16

    spacing[name] = name === 'base' ? token.value : `${remValue}rem`
  })

  return spacing
}

/**
 * Generate Tailwind font sizes from typography tokens
 */
function generateTailwindFontSizes(typography: TypographyTokens): Record<string, [string, { lineHeight: string }]> {
  const fontSize: Record<string, [string, { lineHeight: string }]> = {}

  if (typography.fontSize && typography.lineHeight) {
    Object.entries(typography.fontSize).forEach(([name, token]) => {
      const lineHeight = typography.lineHeight?.[name]?.value || '1.5'
      fontSize[name] = [token.value, { lineHeight: String(lineHeight) }]
    })
  }

  return fontSize
}

/**
 * Generate Tailwind border radius from radius tokens
 */
function generateTailwindBorderRadius(radiusTokens: RadiusTokens): Record<string, string> {
  const borderRadius: Record<string, string> = {}

  Object.entries(radiusTokens).forEach(([name, token]) => {
    borderRadius[name] = token.value
  })

  return borderRadius
}

/**
 * Generate Tailwind box shadow from shadow tokens
 */
function generateTailwindBoxShadow(shadowTokens: ShadowTokens): Record<string, string> {
  const boxShadow: Record<string, string> = {}

  Object.entries(shadowTokens).forEach(([name, token]) => {
    boxShadow[name] = token.value
  })

  return boxShadow
}

/**
 * Generates a Tailwind configuration from design tokens
 */
export function generateTailwindConfig(tokens: {
  color?: TokenFile & { color?: ColorTokens }
  spacing?: TokenFile & { spacing?: SpacingTokens }
  typography?: TokenFile & { typography?: TypographyTokens }
  radius?: TokenFile & { radius?: RadiusTokens }
  shadow?: TokenFile & { shadow?: ShadowTokens }
}): Partial<Config> {
  const config: Partial<Config> = {
    theme: {
      extend: {},
    },
  }

  const extend = config.theme!.extend!

  // Colors
  if (tokens.color?.color) {
    extend.colors = generateTailwindColors(tokens.color.color)
  }

  // Spacing
  if (tokens.spacing?.spacing) {
    extend.spacing = generateTailwindSpacing(tokens.spacing.spacing)
  }

  // Typography
  if (tokens.typography?.typography) {
    const typography = tokens.typography.typography

    if (typography.fontFamily) {
      extend.fontFamily = Object.entries(typography.fontFamily).reduce(
        (acc, [name, token]) => {
          acc[name] = [token.value]
          return acc
        },
        {} as Record<string, string[]>,
      )
    }

    if (typography.fontSize) {
      extend.fontSize = generateTailwindFontSizes(typography)
    }

    if (typography.fontWeight) {
      extend.fontWeight = Object.entries(typography.fontWeight).reduce(
        (acc, [name, token]) => {
          acc[name] = String(token.value)
          return acc
        },
        {} as Record<string, string>,
      )
    }
  }

  // Border radius
  if (tokens.radius?.radius) {
    extend.borderRadius = generateTailwindBorderRadius(tokens.radius.radius)
  }

  // Box shadow
  if (tokens.shadow?.shadow) {
    extend.boxShadow = generateTailwindBoxShadow(tokens.shadow.shadow)
  }

  return config
}

/**
 * Exports Tailwind config as a JavaScript module string
 */
export function exportTailwindConfigModule(config: Partial<Config>): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = ${JSON.stringify(config, null, 2)}
`
}
