'use client'

/**
 * Thursday Test V1: Full Screen - Less Componentized
 *
 * Full screen layout from Figma node 15:2185 combining:
 * - AppSidebar (floating variant)
 * - AssetTableV1 (8 rows, less componentized)
 */

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AssetTableV1 } from './AssetTableV1'

export function ThursdayTestV1() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/40 p-6">
        <AssetTableV1 />
      </SidebarInset>
    </SidebarProvider>
  )
}
