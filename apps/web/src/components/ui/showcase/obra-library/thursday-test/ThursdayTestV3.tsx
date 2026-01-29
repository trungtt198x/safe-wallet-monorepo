'use client'

/**
 * Thursday Test V3: Full Screen - Most Componentized
 *
 * Full screen layout from Figma node 1:3203 combining:
 * - AppSidebar (floating variant)
 * - AssetTableV3 (4 rows, most componentized)
 */

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AssetTableV3 } from './AssetTableV3'

export function ThursdayTestV3() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/40 p-6">
        <AssetTableV3 />
      </SidebarInset>
    </SidebarProvider>
  )
}
