import type { Meta, StoryObj } from '@storybook/react'
import { AssetValueCard } from './AssetValueCard'

const meta = {
  title: 'UI/Showcase/OpenSourceLibrary/AssetValueCard',
  component: AssetValueCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSend: { action: 'send clicked' },
    onSwap: { action: 'swap clicked' },
    onReceive: { action: 'receive clicked' },
  },
} satisfies Meta<typeof AssetValueCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '$16,801.50',
  },
}

export const CustomLabel: Story = {
  args: {
    label: 'Portfolio balance',
    value: '$125,000.00',
  },
}

export const SmallValue: Story = {
  args: {
    label: 'Available balance',
    value: '$42.50',
  },
}

export const LargeValue: Story = {
  args: {
    label: 'Total holdings',
    value: '$1,234,567.89',
  },
}
