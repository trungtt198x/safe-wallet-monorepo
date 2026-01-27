import type { Meta, StoryObj } from '@storybook/react'
import { ComponentShowcase } from './Showcase'

const meta = {
  title: 'Design System/Shadcn Components',
  component: ComponentShowcase,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
