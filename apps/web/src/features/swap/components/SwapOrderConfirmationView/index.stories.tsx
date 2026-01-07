import type { OrderStatuses } from '@safe-global/store/gateway/types'
import type { Meta, StoryObj } from '@storybook/react'
import CowOrderConfirmationView from './index'
import { Paper } from '@mui/material'
import { orderTokenBuilder, swapOrderConfirmationViewBuilder } from '@/features/swap/helpers/swapOrderBuilder'
import { StoreDecorator } from '@/stories/storeDecorator'

// Fixed settlement contract address for deterministic tests
const FIXED_SETTLEMENT_CONTRACT = '0x9008D19f58AAbD9eD0D60971565AA8510560ab41'

const Order = swapOrderConfirmationViewBuilder()
  .with({ kind: 'sell' })
  .with({ sellAmount: '10000000' })
  .with({ executedSellAmount: '10000000' })
  .with({ sellToken: { ...orderTokenBuilder().build(), decimals: 6 } })
  .with({ validUntil: 1735001680 }) // Fixed timestamp for deterministic tests (Dec 24, 2024)
  .with({ status: 'open' as OrderStatuses })

const meta = {
  component: CowOrderConfirmationView,

  decorators: [
    (Story) => {
      return (
        <StoreDecorator initialState={{}}>
          <Paper sx={{ padding: 2 }}>
            <Story />
          </Paper>
        </StoreDecorator>
      )
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof CowOrderConfirmationView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    order: Order.build(),
    settlementContract: FIXED_SETTLEMENT_CONTRACT,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VyA38zUPbJ2zflzCIYR6Nu/Swap?type=design&node-id=5256-18562&mode=design&t=FlMhDhzNxpNKWuc1-4',
    },
  },
}

// Fixed receiver address for deterministic tests
const FIXED_RECEIVER = '0x1234567890123456789012345678901234567890'

export const CustomRecipient: Story = {
  args: {
    order: Order.with({ receiver: FIXED_RECEIVER }).build(),
    settlementContract: FIXED_SETTLEMENT_CONTRACT,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VyA38zUPbJ2zflzCIYR6Nu/Swap?type=design&node-id=5752-17758&mode=design&t=0Hnp94dhQMroAAnr-4',
    },
  },
}
