/**
 * Utility functions for token transformations
 */

interface TokenWithValue {
  value: string
  [key: string]: unknown
}

/**
 * Resolves a token reference like "{color.primitive.black}" to its actual value
 */
export function resolveTokenReference(reference: string, tokens: Record<string, unknown>): string {
  // Remove curly braces and split path
  const path = reference.replace(/[{}]/g, '').split('.')

  let current: unknown = tokens
  for (const key of path) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      // Return reference as-is if can't resolve
      return reference
    }
  }

  if (typeof current === 'object' && current !== null && 'value' in current) {
    const value = (current as TokenWithValue).value

    // If the resolved value is also a reference, resolve it recursively
    if (value.startsWith('{') && value.endsWith('}')) {
      return resolveTokenReference(value, tokens)
    }

    return value
  }

  return reference
}

/**
 * Converts hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Converts hex color to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null

  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

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

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Removes 'px' suffix and returns number
 */
export function removePxSuffix(value: string): number {
  return parseInt(value.replace('px', ''))
}

/**
 * Converts camelCase or PascalCase to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}
