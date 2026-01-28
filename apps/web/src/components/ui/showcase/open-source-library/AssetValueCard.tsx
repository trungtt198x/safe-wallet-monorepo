'use client'

import { Card } from '../../card'
import { Button } from '../../button'
import { PlusIcon } from 'lucide-react'

export interface AssetValueCardProps {
  label?: string
  value: string
  onSend?: () => void
  onSwap?: () => void
  onReceive?: () => void
}

export function AssetValueCard({ label = 'Total asset value', value, onSend, onSwap, onReceive }: AssetValueCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">{label}</span>
          <span className="text-4xl font-medium tracking-tight">{value}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onSend}>
            <PlusIcon data-icon="inline-start" />
            Send
          </Button>
          <Button variant="secondary" size="sm" onClick={onSwap}>
            <PlusIcon data-icon="inline-start" />
            Swap
          </Button>
          <Button variant="secondary" size="sm" onClick={onReceive}>
            <PlusIcon data-icon="inline-start" />
            Receive
          </Button>
        </div>
      </div>
    </Card>
  )
}
