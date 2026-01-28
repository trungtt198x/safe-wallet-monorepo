import SaveAddressIcon from '@/public/images/common/save-address.svg'
import { ZERO_ADDRESS } from '@safe-global/protocol-kit/dist/src/utils/constants'
import { TokenAmountFields } from '@/components/common/TokenAmountInput'
import { TxFlowType } from '@/services/analytics'
import { TxFlow } from '../../TxFlow'
import { TxFlowStep } from '../../TxFlowStep'
import { useLoadFeature } from '@/features/__core__'
import { SpendingLimitsFeature } from '@/features/spending-limits'

enum Fields {
  beneficiary = 'beneficiary',
  resetTime = 'resetTime',
}

export const SpendingLimitFields = { ...Fields, ...TokenAmountFields }

export type NewSpendingLimitFlowProps = {
  [SpendingLimitFields.beneficiary]: string
  [SpendingLimitFields.tokenAddress]: string
  [SpendingLimitFields.amount]: string
  [SpendingLimitFields.resetTime]: string
}

const defaultValues: NewSpendingLimitFlowProps = {
  beneficiary: '',
  tokenAddress: ZERO_ADDRESS,
  amount: '',
  resetTime: '0',
}

const NewSpendingLimitFlow = () => {
  const sl = useLoadFeature(SpendingLimitsFeature)

  return (
    <TxFlow
      icon={SaveAddressIcon}
      subtitle="Spending limit"
      ReviewTransactionComponent={sl.ReviewSpendingLimit}
      eventCategory={TxFlowType.SETUP_SPENDING_LIMIT}
      initialData={defaultValues}
    >
      <TxFlowStep title="New transaction">
        <sl.CreateSpendingLimit />
      </TxFlowStep>
    </TxFlow>
  )
}

export default NewSpendingLimitFlow
