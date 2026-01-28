'use client'

import * as React from 'react'
import { TotalAssetValueCard } from './TotalAssetValueCard'
import { AssetsList, type Asset } from './AssetsList'
import { PendingCard, type PendingItem } from './PendingCard'

export interface ObraLibraryProps {
  totalAssetValue: string
  assets: Asset[]
  pendingItems: PendingItem[]
  activeFilter?: string
  filters?: string[]
  onFilterChange?: (filter: string) => void
}

export function ObraLibrary({
  totalAssetValue,
  assets,
  pendingItems,
  activeFilter,
  filters,
  onFilterChange,
}: ObraLibraryProps) {
  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-muted/30 p-6">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-6">
          <TotalAssetValueCard
            value={totalAssetValue}
            activeFilter={activeFilter}
            filters={filters}
            onFilterChange={onFilterChange}
          />
          <AssetsList assets={assets} />
        </div>
        <div className="hidden flex-col lg:flex">
          <PendingCard items={pendingItems} />
        </div>
      </div>
    </div>
  )
}
