'use client'

import { SquareDashed } from 'lucide-react'
import { Card } from '../../card'
import { Button } from '../../button'

export interface TotalAssetValueCardProps {
  label?: string
  value: string
}

export function TotalAssetValueCard({ label = 'Total value', value }: TotalAssetValueCardProps) {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-sm">{label}</span>
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="default">
          <SquareDashed className="size-5" />
          Label
        </Button>
        <Button variant="secondary">
          <SquareDashed className="size-5" />
          Label
        </Button>
        <Button variant="secondary">
          <SquareDashed className="size-5" />
          Label
        </Button>
      </div>
    </Card>
  )
}
