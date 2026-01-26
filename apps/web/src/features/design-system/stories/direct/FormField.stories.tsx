import type { Meta, StoryObj } from '@storybook/react'
import { FormField } from '../../components/molecules/direct'

const meta: Meta<typeof FormField> = {
  title: 'Design System/Molecules/Direct/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormField>

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'email@example.com',
  },
}

export const Required: Story = {
  args: {
    label: 'Wallet Address',
    placeholder: '0x...',
    required: true,
  },
}

export const WithHint: Story = {
  args: {
    label: 'Safe Name',
    placeholder: 'My Safe',
    hint: 'Give your Safe a memorable name',
  },
}

export const WithError: Story = {
  args: {
    label: 'Recipient Address',
    value: '0xinvalid',
    error: 'Invalid Ethereum address',
    required: true,
  },
}

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <FormField label="Safe Name" placeholder="My Safe" required hint="A name for your new Safe" />
      <FormField label="Owner Address" placeholder="0x..." required />
      <FormField label="Threshold" type="number" placeholder="2" hint="Signatures required" />
    </div>
  ),
}
