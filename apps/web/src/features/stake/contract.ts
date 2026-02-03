/**
 * Stake Feature Contract - v3 Architecture
 *
 * Defines the public API surface for lazy-loaded components and services.
 * Accessed via useLoadFeature(StakeFeature).
 *
 * Naming conventions determine stub behavior:
 * - PascalCase → Component (stub renders null when not ready)
 * - camelCase → Service (undefined when not ready, check $isReady before calling)
 *
 * IMPORTANT: Hooks are NOT in the contract - exported directly from index.ts
 */

import type StakingWidget from './components/StakingWidget'
import type StakePage from './components/StakePage'
import type StakeButton from './components/StakeButton'
import type StakingStatus from './components/StakingStatus'
import type StakingConfirmationTx from './components/StakingConfirmationTx'
import type { InfoTooltip } from './components/InfoTooltip'
import type StakingTxDepositDetails from './components/StakingTxDepositDetails'
import type StakingTxDepositInfo from './components/StakingTxDepositInfo'
import type StakingTxExitDetails from './components/StakingTxExitDetails'
import type StakingTxExitInfo from './components/StakingTxExitInfo'
import type StakingTxWithdrawDetails from './components/StakingTxWithdrawDetails'
import type StakingTxWithdrawInfo from './components/StakingTxWithdrawInfo'
import type { getStakeTitle } from './helpers/utils'

export interface StakeContract {
  // Main Widgets (PascalCase → stub renders null)
  StakingWidget: typeof StakingWidget
  StakePage: typeof StakePage

  // UI Components
  StakeButton: typeof StakeButton
  StakingStatus: typeof StakingStatus
  StakingConfirmationTx: typeof StakingConfirmationTx
  InfoTooltip: typeof InfoTooltip

  // Transaction Details Components
  StakingTxDepositDetails: typeof StakingTxDepositDetails
  StakingTxDepositInfo: typeof StakingTxDepositInfo
  StakingTxExitDetails: typeof StakingTxExitDetails
  StakingTxExitInfo: typeof StakingTxExitInfo
  StakingTxWithdrawDetails: typeof StakingTxWithdrawDetails
  StakingTxWithdrawInfo: typeof StakingTxWithdrawInfo

  // Services (camelCase → undefined when not ready)
  getStakeTitle: typeof getStakeTitle
}
