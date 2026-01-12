/**
 * CSS Variables Transformer
 *
 * Transforms design tokens into CSS custom properties (variables)
 */

import { resolveTokenReference, toKebabCase } from './utils'

interface TokenWithValue {
  value: string
  type?: string
  description?: string
}

interface SemanticColors {
  [category: string]: {
    [name: string]: TokenWithValue
  }
}

/**
 * Generate CSS variable name from token path
 */
function toCssVarName(path: string[]): string {
  return `--ds-${path.map(toKebabCase).join('-')}`
}

/**
 * Generate CSS variables for a theme (light or dark)
 */
function generateThemeVars(
  semanticColors: SemanticColors,
  primitiveColors: Record<string, TokenWithValue>,
  _theme: 'light' | 'dark',
): string {
  const vars: string[] = []

  Object.entries(semanticColors).forEach(([category, colors]) => {
    Object.entries(colors).forEach(([name, token]) => {
      const varName = toCssVarName(['color', category, name])
      let value = token.value

      // Resolve token references
      if (value.startsWith('{') && value.endsWith('}')) {
        value = resolveTokenReference(value, { color: { primitive: primitiveColors } })
      }

      vars.push(`  ${varName}: ${value};`)
    })
  })

  return vars.join('\n')
}

/**
 * Generate CSS variables from design tokens
 */
export function generateCssVariables(tokens: {
  color?: {
    primitive: Record<string, TokenWithValue>
    semantic?: {
      light?: SemanticColors
      dark?: SemanticColors
    }
  }
  spacing?: Record<string, TokenWithValue>
  typography?: {
    fontFamily?: Record<string, TokenWithValue>
    fontSize?: Record<string, TokenWithValue>
    fontWeight?: Record<string, TokenWithValue>
    lineHeight?: Record<string, TokenWithValue>
  }
  radius?: Record<string, TokenWithValue>
  shadow?: Record<string, TokenWithValue>
}): string {
  const css: string[] = []

  // Root variables (primitives and non-color tokens)
  css.push(':root {')

  // Primitive colors
  if (tokens.color?.primitive) {
    Object.entries(tokens.color.primitive).forEach(([name, token]) => {
      css.push(`  ${toCssVarName(['color', 'primitive', name])}: ${token.value};`)
    })
  }

  // Spacing
  if (tokens.spacing) {
    Object.entries(tokens.spacing).forEach(([name, token]) => {
      css.push(`  ${toCssVarName(['spacing', name])}: ${token.value};`)
    })
  }

  // Typography
  if (tokens.typography) {
    if (tokens.typography.fontFamily) {
      Object.entries(tokens.typography.fontFamily).forEach(([name, token]) => {
        css.push(`  ${toCssVarName(['font-family', name])}: ${token.value};`)
      })
    }

    if (tokens.typography.fontSize) {
      Object.entries(tokens.typography.fontSize).forEach(([name, token]) => {
        css.push(`  ${toCssVarName(['font-size', name])}: ${token.value};`)
      })
    }

    if (tokens.typography.fontWeight) {
      Object.entries(tokens.typography.fontWeight).forEach(([name, token]) => {
        css.push(`  ${toCssVarName(['font-weight', name])}: ${token.value};`)
      })
    }

    if (tokens.typography.lineHeight) {
      Object.entries(tokens.typography.lineHeight).forEach(([name, token]) => {
        css.push(`  ${toCssVarName(['line-height', name])}: ${token.value};`)
      })
    }
  }

  // Border radius
  if (tokens.radius) {
    Object.entries(tokens.radius).forEach(([name, token]) => {
      css.push(`  ${toCssVarName(['radius', name])}: ${token.value};`)
    })
  }

  // Shadows
  if (tokens.shadow) {
    Object.entries(tokens.shadow).forEach(([name, token]) => {
      css.push(`  ${toCssVarName(['shadow', name])}: ${token.value};`)
    })
  }

  css.push('}')
  css.push('')

  // Light theme semantic colors
  if (tokens.color?.semantic?.light && tokens.color?.primitive) {
    css.push(':root,')
    css.push('[data-theme="light"] {')
    css.push(generateThemeVars(tokens.color.semantic.light, tokens.color.primitive, 'light'))
    css.push('}')
    css.push('')
  }

  // Dark theme semantic colors
  if (tokens.color?.semantic?.dark && tokens.color?.primitive) {
    css.push('[data-theme="dark"] {')
    css.push(generateThemeVars(tokens.color.semantic.dark, tokens.color.primitive, 'dark'))
    css.push('}')
    css.push('')

    // Media query fallback
    css.push('@media (prefers-color-scheme: dark) {')
    css.push('  :root:not([data-theme="light"]) {')
    css.push(
      generateThemeVars(tokens.color.semantic.dark, tokens.color.primitive, 'dark')
        .split('\n')
        .map((line) => '  ' + line)
        .join('\n'),
    )
    css.push('  }')
    css.push('}')
  }

  return css.join('\n')
}
