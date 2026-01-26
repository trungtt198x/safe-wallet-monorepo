import type { Meta, StoryObj } from '@storybook/react'
import { ActionCard } from '../../components/molecules/wrapped'
import { Badge } from '../../components/atoms/wrapped'

const meta: Meta<typeof ActionCard> = {
  title: 'Design System/Molecules/Wrapped/ActionCard',
  component: ActionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ActionCard>

export const Default: Story = {
  args: {
    title: 'Transaction',
    description: 'Send 1.5 ETH to 0x1234...5678',
    primaryAction: {
      label: 'Confirm',
      onClick: () => console.log('Confirmed'),
    },
    secondaryAction: {
      label: 'Reject',
      onClick: () => console.log('Rejected'),
    },
  },
}

export const WithLoading: Story = {
  args: {
    title: 'Processing Transaction',
    description: 'Waiting for confirmation...',
    primaryAction: {
      label: 'Confirming...',
      onClick: () => {},
      loading: true,
    },
    secondaryAction: {
      label: 'Cancel',
      onClick: () => {},
      disabled: true,
    },
  },
}

export const Interactive: Story = {
  args: {
    title: 'Safe Account',
    description: 'eth:0x1234...5678',
    interactive: true,
    primaryAction: {
      label: 'Open',
      onClick: () => console.log('Open'),
    },
  },
}

export const WithContent: Story = {
  render: () => (
    <ActionCard
      title="Send Transaction"
      description="Review and confirm"
      className="w-[400px]"
      primaryAction={{ label: 'Sign', onClick: () => {}, loading: false }}
      secondaryAction={{ label: 'Cancel', onClick: () => {} }}
    >
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Amount</span>
          <span>1.5 ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Gas estimate</span>
          <span>0.002 ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <Badge variant="warning">Pending Signatures</Badge>
        </div>
      </div>
    </ActionCard>
  ),
}
