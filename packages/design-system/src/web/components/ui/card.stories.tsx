import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

const meta = {
  title: 'Design System/Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the card',
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/SX3PdSxgY0D7vfGx2ytRWU/DS-%C2%B7-Foundations?node-id=12-31',
    },
    docs: {
      description: {
        component:
          'A card component that matches the Figma design system. Uses design tokens for spacing (8px/16px), border radius (12px), and colors (bg-surface, text-primary).',
      },
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <p className="text-[14px] font-normal leading-[12px] text-[var(--ds-color-text-primary)]">Card title</p>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The default card component matching the Figma design exactly - white surface, 12px radius, 8px vertical and 16px horizontal padding.',
      },
    },
  },
}

export const WithDescription: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with a title and description using the CardHeader and CardDescription components.',
      },
    },
  },
}

export const WithContent: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area. You can place any content here.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with header and content sections using CardContent for the main body.',
      },
    },
  },
}

export const WithFooter: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
      <CardFooter>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Action</button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full card with header, content, and footer sections. Footer typically contains actions.',
      },
    },
  },
}

export const CustomWidth: Story = {
  render: (args) => (
    <Card className="w-[500px]" {...args}>
      <p className="text-[14px] font-normal leading-[12px] text-[var(--ds-color-text-primary)]">Wider card</p>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with custom width. Use className to adjust dimensions as needed.',
      },
    },
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-[800px]">
      <Card className="w-full">
        <p className="text-[14px] font-normal text-[var(--ds-color-text-primary)]">Basic card</p>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>With Header</CardTitle>
        </CardHeader>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>With Content</CardTitle>
          <CardDescription>Description text</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content goes here</p>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>All sections</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content area</p>
        </CardContent>
        <CardFooter>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Action</button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Overview of all card compositions available in the design system.',
      },
    },
  },
}
