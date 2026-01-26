/**
 * Token Transformation Logic
 * Transforms Figma variable definitions to CSS variables
 */

import type { DesignToken, TokenManifest } from '../types/tokens'

interface FigmaVariable {
  name: string
  value: string
  resolvedValue?: string
}

interface TransformConfig {
  colorPrefix: string
  spacingPrefix: string
  typographyPrefix: string
  radiusPrefix: string
}

const DEFAULT_CONFIG: TransformConfig = {
  colorPrefix: '',
  spacingPrefix: 'spacing-',
  typographyPrefix: 'font-',
  radiusPrefix: 'radius-',
}

/**
 * Determines the token category based on Figma variable name
 */
const getCategory = (name: string): DesignToken['category'] => {
  const lower = name.toLowerCase()
  if (lower.startsWith('color/') || lower.includes('background') || lower.includes('foreground')) {
    return 'color'
  }
  if (lower.startsWith('space/') || lower.includes('spacing')) {
    return 'spacing'
  }
  if (lower.startsWith('radius/')) {
    return 'radius'
  }
  if (lower.includes('font') || lower.includes('title') || lower.includes('body') || lower.includes('small')) {
    return 'typography'
  }
  return 'color'
}

/**
 * Transforms a Figma variable name to CSS variable name
 */
const toCssVariableName = (figmaName: string, config: TransformConfig): string => {
  const category = getCategory(figmaName)
  let name = figmaName
    .replace(/^color\//, '')
    .replace(/^space\//, '')
    .replace(/^radius\//, '')
    .replace(/\s+/g, '-')
    .toLowerCase()

  switch (category) {
    case 'spacing':
      return `--${config.spacingPrefix}${name}`
    case 'radius':
      return `--${config.radiusPrefix}${name}`
    case 'typography':
      return `--${config.typographyPrefix}${name}`
    default:
      return `--${config.colorPrefix}${name}`
  }
}

/**
 * Converts hex color to HSL format for shadcn compatibility
 */
const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return hex

  const r = parseInt(result[1], 16) / 255
  const g = parseInt(result[2], 16) / 255
  const b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Formats a value based on token category
 */
const formatValue = (value: string, category: DesignToken['category']): string => {
  if (category === 'color' && value.startsWith('#')) {
    return hexToHsl(value)
  }
  if (category === 'spacing' || category === 'radius') {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      return `${num}px`
    }
  }
  return value
}

/**
 * Transforms Figma variables to design tokens
 */
export const transformFigmaVariables = (
  variables: Record<string, string>,
  config: TransformConfig = DEFAULT_CONFIG
): DesignToken[] => {
  return Object.entries(variables).map(([name, value]) => {
    const category = getCategory(name)
    const cssVariable = toCssVariableName(name, config)
    const formattedValue = formatValue(value, category)

    return {
      figmaName: name,
      cssVariable,
      category,
      lightValue: formattedValue,
    }
  })
}

/**
 * Generates CSS file content from tokens
 */
export const generateCssFile = (
  tokens: DesignToken[],
  category: DesignToken['category'],
  header: string
): string => {
  const filteredTokens = tokens.filter((t) => t.category === category)
  if (filteredTokens.length === 0) return ''

  const lines = [header, '', ':root {']

  filteredTokens.forEach((token) => {
    lines.push(`  ${token.cssVariable}: ${token.lightValue};`)
  })

  lines.push('}')

  // Add dark mode if any tokens have dark values
  const darkTokens = filteredTokens.filter((t) => t.darkValue)
  if (darkTokens.length > 0) {
    lines.push('')
    lines.push('.dark {')
    darkTokens.forEach((token) => {
      if (token.darkValue) {
        lines.push(`  ${token.cssVariable}: ${token.darkValue};`)
      }
    })
    lines.push('}')
  }

  return lines.join('\n')
}

/**
 * Generates the token manifest JSON
 */
export const generateManifest = (
  tokens: DesignToken[],
  source: { fileKey: string; nodeId: string; url: string }
): TokenManifest => {
  const stats = {
    totalTokens: tokens.length,
    colors: tokens.filter((t) => t.category === 'color').length,
    spacing: tokens.filter((t) => t.category === 'spacing').length,
    typography: tokens.filter((t) => t.category === 'typography').length,
    radius: tokens.filter((t) => t.category === 'radius').length,
  }

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source,
    tokens,
    stats,
  }
}

/**
 * Generates file header comment
 */
export const generateHeader = (category: string): string => {
  return `/**
 * Design System ${category.charAt(0).toUpperCase() + category.slice(1)} Tokens
 * Generated: ${new Date().toISOString()}
 * Source: Figma DS · Foundations
 * DO NOT EDIT MANUALLY - run \`yarn design-system:sync\` to regenerate
 */`
}
