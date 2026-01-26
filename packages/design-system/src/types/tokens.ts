/**
 * Design Token Types
 * Represents design tokens synced from Figma
 */

export interface DesignToken {
  /** Original name from Figma (e.g., "color/background") */
  figmaName: string

  /** CSS variable name (e.g., "--background") */
  cssVariable: string

  /** Category for organization */
  category: 'color' | 'spacing' | 'typography' | 'radius'

  /** Light mode value */
  lightValue: string

  /** Dark mode value (optional, falls back to light) */
  darkValue?: string

  /** Human-readable description (from Figma if available) */
  description?: string
}

export interface TokenCollection {
  /** Figma file key */
  fileKey: string

  /** Figma node ID containing variables */
  nodeId: string

  /** Collection name (e.g., "Foundations") */
  name: string

  /** Last sync timestamp */
  lastSynced: string

  /** All tokens in this collection */
  tokens: DesignToken[]
}

export interface TypographyToken extends DesignToken {
  category: 'typography'

  /** Decomposed font properties */
  fontFamily: string
  fontSize: string
  fontWeight: number
  lineHeight: string
  letterSpacing?: string
}

export interface TokenManifest {
  version: string
  generatedAt: string
  source: {
    fileKey: string
    nodeId: string
    url: string
  }
  tokens: DesignToken[]
  stats: {
    totalTokens: number
    colors: number
    spacing: number
    typography: number
    radius: number
  }
}
