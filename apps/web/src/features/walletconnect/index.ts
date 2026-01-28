/**
 * WalletConnect Feature - Public API
 *
 * This feature provides WalletConnect v2 integration for Safe wallets.
 *
 * ## Usage
 *
 * ```typescript
 * import { WalletConnectWidget } from '@/features/walletconnect'
 *
 * // No need to check feature flags - the component handles it automatically
 * <WalletConnectWidget
 *   wrapper={(children) => <Box className={css.container}>{children}</Box>}
 * />
 * ```
 */
import dynamic from 'next/dynamic'
import { withFeatureGuard } from '@/utils/withFeatureGuard'
import { useIsWalletConnectEnabled } from './hooks/useIsWalletConnectEnabled'

// Dynamic import at module level - webpack can analyze this for code splitting
const LazyWalletConnectUi = dynamic(() => import('./components/WalletConnectUi'), { ssr: false })

// Guarded, lazy-loaded WalletConnect widget component
export const WalletConnectWidget = withFeatureGuard(LazyWalletConnectUi, useIsWalletConnectEnabled)

// Public types
export type { WalletConnectContextType, WcChainSwitchRequest, WcAutoApproveProps } from './types'
export { WCLoadingState } from './types'

// Stores (used by safe-wallet-provider)
export { wcPopupStore, openWalletConnect, wcChainSwitchStore } from './store'

// Services - lightweight utils only (heavy services must be imported from sub-barrel)
export { isSafePassApp } from './services/utils'

// Hooks (used by wc.tsx page)
export { WC_URI_SEARCH_PARAM, useWalletConnectSearchParamUri } from './hooks/useWalletConnectSearchParamUri'
export { default as useWcUri } from './hooks/useWcUri'

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
