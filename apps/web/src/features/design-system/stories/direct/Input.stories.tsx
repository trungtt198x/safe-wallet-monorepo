import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@/components/ui/input'

const meta: Meta<typeof Input> = {
  title: 'Design System/Atoms/Direct/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithValue: Story = {
  args: {
    value: 'Hello, World!',
    readOnly: true,
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <label htmlFor="input-demo" className="text-sm font-medium">
        Email Address
      </label>
      <Input id="input-demo" type="email" placeholder="email@example.com" />
    </div>
  ),
}
