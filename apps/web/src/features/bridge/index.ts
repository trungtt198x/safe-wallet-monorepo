/**
 * Bridge Feature Public API
 *
 * This barrel file exports:
 * - Guarded, lazy-loaded components (via withFeatureGuard)
 * - Constants (only those used externally)
 *
 * @example
 * ```tsx
 * import { Bridge } from '@/features/bridge'
 *
 * // No need to check feature flags - component handles it automatically
 * <Bridge />
 * ```
 */
import dynamic from 'next/dynamic'
import { withFeatureGuard } from '@/utils/withFeatureGuard'
import { useIsBridgeFeatureEnabled } from './hooks/useIsBridgeFeatureEnabled'

// =============================================================================
// Dynamic imports at module level - webpack can analyze these for code splitting
// =============================================================================

const LazyBridge = dynamic(() => import('./components/Bridge').then((mod) => ({ default: mod.Bridge })), { ssr: false })

// =============================================================================
// Guarded, lazy-loaded component exports
// =============================================================================

/** Bridge widget for cross-chain asset transfers */
export const Bridge = withFeatureGuard(LazyBridge, useIsBridgeFeatureEnabled)

// =============================================================================
// Constants - only export constants that are used externally
// =============================================================================

export { BRIDGE_WIDGET_URL } from './constants'
