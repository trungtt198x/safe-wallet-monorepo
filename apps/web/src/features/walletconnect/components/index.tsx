// This sub-barrel exists for internal feature organization only.
// WalletConnectUi is lazy-loaded via dynamic() in the main barrel.
// WalletConnectContext/Provider are internal implementation details.
//
// DO NOT export heavy components here - it defeats the purpose of lazy loading.
// Internal components use relative imports (e.g., '../WalletConnectContext')

export { default as WalletConnectUi } from './WalletConnectUi'
