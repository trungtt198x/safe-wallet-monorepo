'use client'

import { useEffect, useState } from 'react'
import type { FeatureHandle, FeatureImplementation } from './types'

/**
 * Hook to load a feature lazily based on its handle.
 *
 * This hook combines:
 * 1. Feature flag check (via handle.useIsEnabled)
 * 2. Lazy loading of the full implementation (cached by bundler)
 *
 * @param handle - The feature handle with name, useIsEnabled, and load function
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

  const [feature, setFeature] = useState<LoadedFeature | null>(null)

  // Load the feature when enabled
  useEffect(() => {
    if (isEnabled !== true || feature) return

    // Dynamic import is cached by the bundler - multiple calls return the same Promise
    handle.load().then((module) => {
      setFeature({
        name: handle.name,
        useIsEnabled: handle.useIsEnabled,
        ...module.default,
      } as LoadedFeature)
    })
  }, [isEnabled, feature, handle])

  // Return null if not enabled or not yet loaded
  if (isEnabled !== true) {
    return null
  }

  return feature
}
