import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../../components/atoms/wrapped'

const meta: Meta<typeof Input> = {
  title: 'Design System/Atoms/Wrapped/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithHelperText: Story = {
  args: {
    placeholder: 'Enter your email',
    helperText: 'We will never share your email.',
  },
}

export const WithError: Story = {
  args: {
    value: 'invalid-email',
    error: true,
    helperText: 'Please enter a valid email address.',
  },
}

export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <div>
        <label htmlFor="email" className="text-sm font-medium mb-1 block">
          Email
        </label>
        <Input id="email" type="email" placeholder="email@example.com" helperText="Your primary email" />
      </div>
      <div>
        <label htmlFor="wallet" className="text-sm font-medium mb-1 block">
          Wallet Address
        </label>
        <Input
          id="wallet"
          placeholder="0x..."
          error
          helperText="Invalid Ethereum address"
        />
      </div>
    </div>
  ),
}
