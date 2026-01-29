'use client'

/**
 * TotalValueCard: Displays total portfolio value with action buttons
 *
 * From Figma node 9:742 - Card with 1 slot containing:
 * - Total value display (1234$)
 * - Action buttons: Send, Receive, Swap
 */

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, ArrowDownLeft, Repeat } from 'lucide-react'

export interface TotalValueCardProps {
  totalValue?: string
}

export function TotalValueCard({ totalValue = '1234$' }: TotalValueCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total value</p>
            <p className="text-2xl font-semibold">{totalValue}</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <ArrowUpRight data-icon="inline-start" className="size-4" />
              Send
            </Button>
            <Button variant="secondary">
              <ArrowDownLeft data-icon="inline-start" className="size-4" />
              Receive
            </Button>
            <Button variant="secondary">
              <Repeat data-icon="inline-start" className="size-4" />
              Swap
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
