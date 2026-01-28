'use client'

import * as React from 'react'
import { Card } from '../../card'
import { Button } from '../../button'

export interface TotalAssetValueCardProps {
  label?: string
  value: string
  activeFilter?: string
  filters?: string[]
  onFilterChange?: (filter: string) => void
}

export function TotalAssetValueCard({
  label = 'Total asset value',
  value,
  activeFilter,
  filters = ['Label', 'Label', 'Label'],
  onFilterChange,
}: TotalAssetValueCardProps) {
  return (
    <Card className="!ring-border/20 !shadow-none flex flex-col gap-3 p-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">{label}</span>
          <span className="text-4xl font-medium tracking-tight">{value}</span>
        </div>

        <div className="flex items-center gap-2">
          {filters.map((filter, index) => {
            const isActive = activeFilter === filter || (activeFilter === undefined && index === 0)
            return (
              <Button
                key={index}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange?.(filter)}
              >
                {filter}
              </Button>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
