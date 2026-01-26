import type { Meta, StoryObj } from '@storybook/react'
import { OverviewDemo } from '../../demo/OverviewDemo'
import { OverviewDemoWrapped } from '../../demo/OverviewDemoWrapped'

const meta: Meta<typeof OverviewDemo> = {
  title: 'Design System/Demo/Dashboard Overview',
  component: OverviewDemo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof OverviewDemo>

export const DirectPattern: Story = {
  args: {
    balance: '12,456.78',
    currency: 'USD',
    showSwap: true,
  },
}

export const DirectWithoutSwap: Story = {
  args: {
    balance: '12,456.78',
    currency: 'USD',
    showSwap: false,
  },
}

export const DirectLoading: Story = {
  args: {
    balance: '',
    isLoading: true,
  },
}

export const WrappedPattern: StoryObj<typeof OverviewDemoWrapped> = {
  render: (args) => <OverviewDemoWrapped {...args} />,
  args: {
    balance: '12,456.78',
    currency: 'USD',
    showSwap: true,
  },
}

export const WrappedSending: StoryObj<typeof OverviewDemoWrapped> = {
  render: (args) => <OverviewDemoWrapped {...args} />,
  args: {
    balance: '12,456.78',
    currency: 'USD',
    showSwap: true,
    isSending: true,
  },
}

export const SideBySide: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Direct Pattern (shadcn imports)</h3>
        <OverviewDemo balance="12,456.78" currency="USD" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Wrapped Pattern (Safe components)</h3>
        <OverviewDemoWrapped balance="12,456.78" currency="USD" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Wrapped with Loading State</h3>
        <OverviewDemoWrapped balance="12,456.78" currency="USD" isSending />
      </div>
    </div>
  ),
}
