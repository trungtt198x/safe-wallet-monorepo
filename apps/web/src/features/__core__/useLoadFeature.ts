'use client'

import useAsync from '@safe-global/utils/hooks/useAsync'
import { logError, Errors } from '@/services/exceptions'
import type { FeatureHandle, FeatureImplementation } from './types'

/**
 * Hook to load a feature lazily based on its handle.
 *
 * This hook combines:
 * 1. Feature flag check (via handle.useIsEnabled)
 * 2. Lazy loading of the full implementation (cached by bundler)
 *
 * Uses `useAsync` internally for proper cleanup (prevents memory leaks on unmount)
 * and error handling.
 *
 * @param handle - The feature handle with name, useIsEnabled, and load function.
 *   **Important:** The handle should be a module-level constant to avoid unnecessary
 *   re-renders due to reference changes in the dependency array.
 * @returns The loaded feature, `undefined` while loading, or `null` if disabled
 *
 * @example
 * ```typescript
 * import { WalletConnectFeature } from '@/features/walletconnect'
 * import { useLoadFeature } from '@/features/__core__'
 *
 * function MyComponent() {
 *   const wc = useLoadFeature(WalletConnectFeature)
 *
 *   // Show loading state while feature flag or code is loading
 *   if (wc === undefined) return <Skeleton />
 *
 *   // Hide if disabled
 *   if (wc === null) return null
 *
 *   // Feature is loaded - flat access pattern
 *   return <wc.WalletConnectWidget />
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Simple pattern: treat loading same as disabled
 * function MyComponent() {
 *   const wc = useLoadFeature(WalletConnectFeature)
 *   if (!wc) return null
 *   return <wc.WalletConnectWidget />
 * }
 * ```
 */
export function useLoadFeature<T extends FeatureImplementation>(
  handle: FeatureHandle<T>,
): (T & { name: string; useIsEnabled: () => boolean | undefined }) | null | undefined {
  type LoadedFeature = T & { name: string; useIsEnabled: () => boolean | undefined }

  // Check feature flag (must be called unconditionally as it's a hook)
  const isEnabled = handle.useIsEnabled()

  // Load feature when enabled using useAsync for:
  // - Cleanup via isCurrent flag (prevents memory leaks on unmount)
  // - Error handling
  // - Loading state management
  // Dynamic import is cached by the bundler - multiple calls return the same Promise
  const [feature, error, loading] = useAsync(
    () => {
      if (isEnabled !== true) return
      return handle.load().then(
        (module) =>
          ({
            name: handle.name,
            useIsEnabled: handle.useIsEnabled,
            ...module.default,
          }) as LoadedFeature,
      )
    },
    [isEnabled, handle],
    false, // Don't clear data on re-run (keeps feature cached while dependencies stable)
  )

  // Log errors for debugging
  if (error) {
    logError(Errors._906, error)
  }

  // Feature flag is disabled -> null
  if (isEnabled === false) {
    return null
  }

  // Feature flag is loading or code is loading -> undefined
  if (isEnabled === undefined || loading || !feature) {
    return undefined
  }

  // Feature is loaded and ready -> feature object
  return feature
}
