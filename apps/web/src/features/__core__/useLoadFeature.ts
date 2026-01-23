'use client'

import useAsync from '@safe-global/utils/hooks/useAsync'
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
 * @returns The loaded feature contract, or null if not enabled/loaded
 *
 * @example
 * ```typescript
 * import { WalletConnectFeature } from '@/features/walletconnect'
 * import { useLoadFeature } from '@/features/__core__'
 *
 * function MyComponent() {
 *   const walletConnect = useLoadFeature(WalletConnectFeature)
 *   if (!walletConnect) return null
 *   return <walletConnect.components.WalletConnectWidget />
 * }
 * ```
 */
export function useLoadFeature<T extends FeatureImplementation>(
  handle: FeatureHandle<T>,
): (T & { name: string; useIsEnabled: () => boolean | undefined }) | null {
  type LoadedFeature = T & { name: string; useIsEnabled: () => boolean | undefined }

  // Check feature flag (must be called unconditionally as it's a hook)
  const isEnabled = handle.useIsEnabled()

  // Load feature when enabled using useAsync for:
  // - Cleanup via isCurrent flag (prevents memory leaks on unmount)
  // - Error handling
  // - Loading state management
  // Dynamic import is cached by the bundler - multiple calls return the same Promise
  const [feature, error] = useAsync(
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
    console.error(`Failed to load feature "${handle.name}":`, error)
  }

  // Return null if not enabled or not yet loaded
  if (isEnabled !== true) {
    return null
  }

  return feature ?? null
}
