/**
 * WalletConnect Feature - Public API
 *
 * This feature provides WalletConnect v2 integration for Safe wallets.
 *
 * ## Usage
 *
 * ```typescript
 * import WalletConnectWidget, { useIsWalletConnectEnabled } from '@/features/walletconnect'
 *
 * function MyComponent() {
 *   const isEnabled = useIsWalletConnectEnabled()
 *   if (!isEnabled) return null
 *   return <WalletConnectWidget />
 * }
 * ```
 */
import dynamic from 'next/dynamic'

// Default export: Lazy-loaded WalletConnect widget component
const WalletConnectWidget = dynamic(() => import('./components/WalletConnectUi'), { ssr: false })
export default WalletConnectWidget

// Feature flag hook (REQUIRED for feature architecture)
export { useIsWalletConnectEnabled } from './hooks/useIsWalletConnectEnabled'

// Public types
export type { WalletConnectContextType, WcChainSwitchRequest, WcAutoApproveProps } from './types'
export { WCLoadingState } from './types'

// Stores (used by safe-wallet-provider)
export { wcPopupStore, openWalletConnect, wcChainSwitchStore } from './store'

// Services - lightweight utils only (heavy services must be imported from sub-barrel)
export { isSafePassApp } from './services/utils'
// NOTE: walletConnectInstance is NOT exported here to avoid bundling 600KB WalletConnect SDK
// Import from '@/features/walletconnect/services' if you need the instance

// Hooks (used by wc.tsx page)
export { WC_URI_SEARCH_PARAM, useWalletConnectSearchParamUri } from './hooks/useWalletConnectSearchParamUri'
export { default as useWcUri } from './hooks/useWcUri'

// NOTE: WalletConnectContext/WalletConnectProvider are NOT exported - they're internal to the feature
// and import heavy dependencies. They're only used by the lazy-loaded WalletConnectUi component.

// Constants
export {
  SAFE_COMPATIBLE_METHODS,
  SAFE_COMPATIBLE_EVENTS,
  SAFE_WALLET_METADATA,
  EIP155,
  BlockedBridges,
  WarnedBridges,
  WarnedBridgeNames,
} from './constants'
