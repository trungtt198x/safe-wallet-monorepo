'use client'

/**
 * Thursday Test V2: Full Screen - With Annotations
 *
 * Full screen layout from Figma node 15:2648 combining:
 * - AppSidebar (floating variant)
 * - AssetTableV2 (8 rows, with designer annotations)
 */

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AssetTableV2 } from './AssetTableV2'

export function ThursdayTestV2() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/40 p-6">
        <AssetTableV2 />
      </SidebarInset>
    </SidebarProvider>
  )
}
