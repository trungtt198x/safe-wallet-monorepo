'use client'

import * as React from 'react'
import { Button } from '../../button'
import { AssetValueCard } from './AssetValueCard'
import { PendingTransactionsCard, type Transaction } from './PendingTransactionsCard'
import { PortfolioCard, type Asset, type Position } from './PortfolioCard'
import { CreateProjectCard, type Project } from './CreateProjectCard'
import { WalletSidebar, type User, type Organization } from './WalletSidebar'
import { ZapIcon } from 'lucide-react'

export interface WalletDashboardProps {
  user: User
  organization: Organization
  totalAssetValue: string
  pendingTransactions: Transaction[]
  assets: Asset[]
  positions: Position[]
  projects: Project[]
  activeNavItem?: string
  onNavigate?: (itemId: string) => void
  onSend?: () => void
  onSwap?: () => void
  onReceive?: () => void
  onViewAllTransactions?: () => void
  onViewAllPortfolio?: () => void
  onProjectAction?: (projectId: string, action: 'edit' | 'copy' | 'delete') => void
}

export function WalletDashboard({
  user,
  organization,
  totalAssetValue,
  pendingTransactions,
  assets,
  positions,
  projects,
  activeNavItem = 'dashboard',
  onNavigate,
  onSend,
  onSwap,
  onReceive,
  onViewAllTransactions,
  onViewAllPortfolio,
  onProjectAction,
}: WalletDashboardProps) {
  return (
    <div className="bg-muted/30 flex h-screen w-full">
      {/* Sidebar */}
      <WalletSidebar user={user} organization={organization} activeItemId={activeNavItem} onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto p-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          {/* Top Row: Asset Value + Pending Transactions */}
          <div className="grid gap-6 md:grid-cols-2">
            <AssetValueCard value={totalAssetValue} onSend={onSend} onSwap={onSwap} onReceive={onReceive} />
            <PendingTransactionsCard transactions={pendingTransactions} onViewAll={onViewAllTransactions} />
          </div>

          {/* Portfolio Section */}
          <PortfolioCard assets={assets} positions={positions} onViewAll={onViewAllPortfolio} />

          {/* Create Project Section */}
          <CreateProjectCard projects={projects} onProjectAction={onProjectAction} />

          {/* Bottom Action Button */}
          <div className="flex justify-start">
            <Button>
              <ZapIcon data-icon="inline-start" />
              Button
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
