import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '../../components/atoms/wrapped'

const meta: Meta<typeof Badge> = {
  title: 'Design System/Atoms/Wrapped/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
}

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
}

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  ),
}

export const TransactionStatus: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge variant="warning">Pending Signatures</Badge>
        <span className="text-sm">1 of 2 signatures</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="success">Executed</Badge>
        <span className="text-sm">Successfully executed</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="destructive">Failed</Badge>
        <span className="text-sm">Transaction reverted</span>
      </div>
    </div>
  ),
}
