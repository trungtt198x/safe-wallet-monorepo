/**
 * Design token types following DTCG (Design Tokens Community Group) format
 */

export type TokenType = 'color' | 'dimension' | 'fontFamily' | 'fontWeight' | 'number' | 'shadow'

export interface BaseToken<T extends TokenType, V = string> {
  value: V
  type: T
  description?: string
}

export type ColorToken = BaseToken<'color', string>
export type DimensionToken = BaseToken<'dimension', string>
export type FontFamilyToken = BaseToken<'fontFamily', string>
export type FontWeightToken = BaseToken<'fontWeight', string>
export type NumberToken = BaseToken<'number', string | number>
export type ShadowToken = BaseToken<'shadow', string>

export interface TokenReference {
  value: string // e.g., "{color.primitive.black}"
  type: TokenType
  description?: string
}

export interface TokenFile {
  $schema?: string
  figma?: {
    fileKey: string
    lastSync: string | null
  }
  [category: string]: unknown
}

// Helper type to resolve token references
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ResolvedToken<T> = T extends TokenReference ? string : T extends BaseToken<infer _Type, infer V> ? V : never
