'use client'

import { TotalAssetValueCard } from './TotalAssetValueCard'
import { AssetsList, type Asset } from './AssetsList'
import { PendingCard, type PendingItem } from './PendingCard'

export interface ObraLibraryProps {
  totalAssetValue: string
  assets: Asset[]
  pendingItems: PendingItem[]
}

export function ObraLibrary({ totalAssetValue, assets, pendingItems }: ObraLibraryProps) {
  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-[#f4f4f4] p-6">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-6">
          <TotalAssetValueCard value={totalAssetValue} />
          <AssetsList assets={assets} />
        </div>
        <div className="hidden flex-col lg:flex">
          <PendingCard items={pendingItems} />
        </div>
      </div>
    </div>
  )
}
