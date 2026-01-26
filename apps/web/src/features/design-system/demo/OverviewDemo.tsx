/**
 * Dashboard Overview Demo - Direct Pattern
 * 
 * This demonstrates how the Dashboard Overview component could look
 * using the new design system with direct shadcn imports.
 */

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-react'

interface OverviewDemoProps {
  balance: string
  currency?: string
  showSwap?: boolean
  isLoading?: boolean
}

export const OverviewDemo = ({ balance, currency = 'USD', showSwap = true, isLoading = false }: OverviewDemoProps) => {
  if (isLoading) {
    return (
      <Card className="border-0 px-6 pt-5 pb-3">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-muted rounded mb-2" />
          <div className="h-10 w-48 bg-muted rounded" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-0 px-6 pt-5 pb-3">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total balance</p>
            <p className="text-4xl font-semibold tracking-tight">
              {balance}{' '}
              <span className="text-2xl font-normal text-muted-foreground">{currency}</span>
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <Button className="flex-1 md:flex-none h-[42px] gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Send
            </Button>

            {showSwap && (
              <Button variant="secondary" className="flex-1 md:flex-none h-[42px] gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Swap
              </Button>
            )}

            <Button variant="secondary" className="flex-1 md:flex-none h-[42px] gap-2">
              <ArrowDownLeft className="h-4 w-4" />
              Receive
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OverviewDemo
