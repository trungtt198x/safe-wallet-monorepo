/**
 * Hypernative Feature Public Types
 *
 * Types exported for consumers to use. These can be imported directly:
 * import type { BannerType } from '@/features/hypernative/types'
 *
 * Re-exports from internal modules to avoid duplication.
 */

// Banner type enum
export { BannerType } from './hooks/useBannerStorage'

// OAuth authentication status
export type { HypernativeAuthStatus } from './hooks/useHypernativeOAuth'

// Safe eligibility result
export type { HypernativeEligibility } from './hooks/useIsHypernativeEligible'
