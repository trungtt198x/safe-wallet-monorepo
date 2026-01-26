import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../components/atoms/wrapped'

const meta: Meta<typeof Button> = {
  title: 'Design System/Atoms/Wrapped/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    loading: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
}

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
}

export const LoadingVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="default" loading>
        Default
      </Button>
      <Button variant="secondary" loading>
        Secondary
      </Button>
      <Button variant="outline" loading>
        Outline
      </Button>
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Normal</Button>
        <Button variant="default" disabled>
          Disabled
        </Button>
        <Button variant="default" loading>
          Loading
        </Button>
      </div>
    </div>
  ),
}
