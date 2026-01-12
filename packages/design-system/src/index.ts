/**
 * @safe-global/design-system
 *
 * Safe Wallet Design System - Figma-connected design tokens and components
 *
 * This entry point is platform-safe and only exports design tokens.
 * For platform-specific components, use:
 * - @safe-global/design-system/web (Shadcn/Tailwind components)
 *
 * Tokens will be populated after the first Figma sync.
 *
 * @example
 * ```typescript
 * import { tokens } from '@safe-global/design-system'
 * // Note: tokens will be available after first Figma sync
 * ```
 */

// Export token types
export * from './tokens/types'

// Tokens will be exported here after first Figma sync
// export * from './tokens'
