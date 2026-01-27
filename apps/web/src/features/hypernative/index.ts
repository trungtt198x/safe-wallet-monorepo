/**
 * Hypernative Feature Public API
 *
 * This file defines the public interface for the Hypernative feature.
 * Use useLoadFeature(HypernativeFeature) to access the feature.
 *
 * @example
 * ```typescript
 * import { HypernativeFeature } from '@/features/hypernative'
 * import { useLoadFeature } from '@/features/__core__'
 *
 * function MyComponent() {
 *   const hn = useLoadFeature(HypernativeFeature)
 *   return <hn.HnBanner />
 * }
 * ```
 */

import { createFeatureHandle } from '@/features/__core__'
import type { HypernativeContract } from './contract'

/**
 * Hypernative feature handle for use with useLoadFeature().
 *
 * Uses FEATURES.HYPERNATIVE flag (auto-derived from folder name).
 *
 * Feature flags:
 * - FEATURES.HYPERNATIVE - Primary flag for core features
 * - FEATURES.HYPERNATIVE_RELAX_GUARD_CHECK - Relaxed guard detection (internal)
 * - FEATURES.HYPERNATIVE_QUEUE_SCAN - Queue scan features (internal)
 */
export const HypernativeFeature = createFeatureHandle<HypernativeContract>('hypernative')

// Re-export public types for direct import
// BannerType is an enum, so it must be exported as a value
export { BannerType } from './types'
export type { HypernativeAuthStatus, HypernativeEligibility } from './types'
export type { HypernativeContract } from './contract'
