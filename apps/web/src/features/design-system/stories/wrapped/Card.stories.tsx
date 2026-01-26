import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../../components/atoms/wrapped'
import { Button } from '../../components/atoms/wrapped'

const meta: Meta<typeof Card> = {
  title: 'Design System/Atoms/Wrapped/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    interactive: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  ),
}

export const Interactive: Story = {
  render: () => (
    <Card className="w-[350px]" interactive>
      <CardHeader>
        <CardTitle>Clickable Card</CardTitle>
        <CardDescription>Hover to see effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has hover effects.</p>
      </CardContent>
    </Card>
  ),
}

export const SafeAccountCard: Story = {
  render: () => (
    <Card className="w-[400px]" interactive>
      <CardHeader>
        <CardTitle>My Safe Account</CardTitle>
        <CardDescription>eth:0x1234...5678</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Balance</span>
          <span className="font-semibold">12.5 ETH</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button size="sm">Send</Button>
      </CardFooter>
    </Card>
  ),
}
