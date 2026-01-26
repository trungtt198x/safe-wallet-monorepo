import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

/**
 * Example experimental component for code-first design workflow.
 * 
 * This demonstrates how to rapidly prototype new designs directly in Storybook.
 * Edit this component and see changes instantly via hot reload (<2s).
 */
const QuickSendPrototype = () => (
  <Card className="w-[400px]">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Quick Send</CardTitle>
        <Badge variant="outline">Beta</Badge>
      </div>
      <CardDescription>Send tokens in one click</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount</label>
        <div className="flex gap-2">
          <Input type="number" placeholder="0.00" className="flex-1" />
          <Button variant="outline" size="sm">
            ETH
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Recipient</label>
        <Input placeholder="0x... or ENS name" />
      </div>
      <div className="flex justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          Gas: ~0.002 ETH
        </div>
        <Button>Send</Button>
      </div>
    </CardContent>
  </Card>
)

const meta: Meta<typeof QuickSendPrototype> = {
  title: 'Design System/Experiments/Quick Send Prototype',
  component: QuickSendPrototype,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof QuickSendPrototype>

export const Default: Story = {}

export const Filled: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Quick Send</CardTitle>
          <Badge variant="outline">Beta</Badge>
        </div>
        <CardDescription>Send tokens in one click</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <div className="flex gap-2">
            <Input type="number" value="1.5" readOnly className="flex-1" />
            <Button variant="outline" size="sm">
              ETH
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Recipient</label>
          <Input value="vitalik.eth" readOnly />
        </div>
        <div className="flex justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Gas: ~0.002 ETH
          </div>
          <Button>Send 1.5 ETH</Button>
        </div>
      </CardContent>
    </Card>
  ),
}
