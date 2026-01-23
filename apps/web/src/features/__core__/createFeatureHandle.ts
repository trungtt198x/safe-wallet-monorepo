import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@safe-global/utils/utils/chains'
import type { FeatureHandle, FeatureImplementation } from './types'

/**
 * Creates a feature handle from folder name conventions.
 *
 * This helper simplifies feature handle creation by auto-deriving feature flags
 * from folder names and providing type inference.
 *
 * @param folderName - Kebab-case folder name (e.g., 'wallet-connect', 'tx-notes')
 * @param featureFlag - Optional FEATURES enum value. If omitted, auto-derives from folderName:
 *                      'wallet-connect' → FEATURES.WALLET_CONNECT
 *                      'tx-notes' → FEATURES.TX_NOTES
 * @returns FeatureHandle for use with useLoadFeature()
 *
 * @example
 * ```typescript
 * // Auto-derive feature flag
 * export const BridgeFeature = createFeatureHandle('bridge')
 *
 * // Override feature flag for exceptions
 * export const WalletConnectFeature = createFeatureHandle(
 *   'wallet-connect',
 *   FEATURES.NATIVE_WALLETCONNECT
 * )
 * ```
 */
export function createFeatureHandle<T extends FeatureImplementation = FeatureImplementation>(
  folderName: string,
  featureFlag?: FEATURES,
): FeatureHandle<T> {
  // Auto-derive feature flag from folder name: kebab-case → UPPER_SNAKE_CASE
  const autoFlagName = folderName.toUpperCase().replace(/-/g, '_') as keyof typeof FEATURES
  const flag = featureFlag ?? FEATURES[autoFlagName]

  if (flag === undefined) {
    throw new Error(
      `Feature flag auto-derivation failed for '${folderName}'. ` +
        `Expected FEATURES.${autoFlagName} to exist. ` +
        `Either add the feature flag to the FEATURES enum or pass it explicitly as the second parameter.`,
    )
  }

  return {
    name: folderName,
    useIsEnabled: () => useHasFeature(flag),
    load: () => import(/* webpackMode: "lazy" */ `../${folderName}/feature`) as Promise<{ default: T }>,
  }
}
