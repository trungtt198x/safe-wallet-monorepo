import type { SpendingLimitState } from '@/features/spending-limits'
import SaveAddressIcon from '@/public/images/common/save-address.svg'
import { useMemo } from 'react'
import { TxFlowType } from '@/services/analytics'
import { TxFlow } from '../../TxFlow'
import type ReviewTransaction from '@/components/tx/ReviewTransactionV2'
import { useLoadFeature } from '@/features/__core__'
import { SpendingLimitsFeature } from '@/features/spending-limits'

const RemoveSpendingLimitFlow = ({ spendingLimit }: { spendingLimit: SpendingLimitState }) => {
  const sl = useLoadFeature(SpendingLimitsFeature)

  const ReviewTransactionComponent = useMemo<typeof ReviewTransaction>(
    () =>
      function ReviewRemoveSpendingLimit(props) {
        return <sl.RemoveSpendingLimitReview params={spendingLimit} {...props} />
      },
    [spendingLimit, sl],
  )

  return (
    <TxFlow
      subtitle="Remove spending limit"
      eventCategory={TxFlowType.REMOVE_SPENDING_LIMIT}
      icon={SaveAddressIcon}
      ReviewTransactionComponent={ReviewTransactionComponent}
    />
  )
}

export default RemoveSpendingLimitFlow
