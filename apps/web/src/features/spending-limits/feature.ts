import SpendingLimitsSettings from './components/SpendingLimitsSettings'
import SpendingLimitRow from './components/SpendingLimitRow'
import CreateSpendingLimit from './components/CreateSpendingLimit'
import ReviewSpendingLimit from './components/ReviewSpendingLimit'
import RemoveSpendingLimitReview from './components/RemoveSpendingLimitReview'
import ReviewSpendingLimitTx from './components/ReviewSpendingLimitTx'
import { loadSpendingLimits } from './services/spendingLimitLoader'
import { createNewSpendingLimitTx, dispatchSpendingLimitTxExecution } from './services/spendingLimitExecution'

export default {
  // Components
  SpendingLimitsSettings,
  SpendingLimitRow,
  CreateSpendingLimit,
  ReviewSpendingLimit,
  RemoveSpendingLimitReview,
  ReviewSpendingLimitTx,

  // Services
  loadSpendingLimits,
  createNewSpendingLimitTx,
  dispatchSpendingLimitTxExecution,
}
