'use client'

/**
 * Dashboard: Full screen home view
 *
 * From Figma node 1:3235 - Complete dashboard with:
 * - Sidebar (floating variant)
 * - Total value card with Send/Receive/Swap buttons
 * - Assets table card
 * - Pending transactions card
 *
 * Layout: Sidebar | [TotalValue + Assets] | Pending
 */

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { TotalValueCard } from './TotalValueCard'
import { AssetsCard } from './AssetsCard'
import { PendingCard } from './PendingCard'

export function Dashboard() {
  const handleNavigate = (id: string) => {
    console.log(`Navigate to: ${id}`)
  }

  return (
    <SidebarProvider>
      <AppSidebar defaultActiveId="home" onNavigate={handleNavigate} />
      <SidebarInset className="bg-muted/40 p-6">
        <div className="flex gap-6">
          {/* Left column: Total Value + Assets */}
          <div className="flex flex-col gap-6 flex-1 max-w-[666px]">
            <TotalValueCard totalValue="1234$" />
            <AssetsCard />
          </div>

          {/* Right column: Pending */}
          <PendingCard />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
