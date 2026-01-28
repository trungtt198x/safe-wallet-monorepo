/**
 * Hypernative Feature - Public Type Exports
 *
 * All public types are re-exported from this file for convenience.
 * Types are defined in their respective hook files and re-exported here.
 */

// Guard check types
export type { HypernativeGuardCheckResult } from './hooks/useIsHypernativeGuard'

// Banner visibility types
export type { BannerVisibilityResult } from './hooks/useBannerVisibility'

// OAuth types
export type { HypernativeAuthStatus } from './hooks/useHypernativeOAuth'

// Eligibility types
export type { HypernativeEligibility } from './hooks/useIsHypernativeEligible'

// Banner type enum (exported as value, not just type)
export { BannerType } from './hooks/useBannerStorage'
