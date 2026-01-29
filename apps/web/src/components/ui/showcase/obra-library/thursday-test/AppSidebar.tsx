'use client'

/**
 * AppSidebar: Shared sidebar component for the Thursday Test full screens.
 *
 * Matches the Figma design with:
 * - Header: Acme Inc / Space with avatar (opens workspace menu)
 * - Navigation: Home, Transactions, Portfolio, Apps
 * - Defi section: Swap, Bridge, Stake, Earn
 * - Footer: Settings
 *
 * Interactive behavior:
 * - Workspace switcher opens dropdown menu
 * - Clicking menu items updates active state
 * - onNavigate callback for parent components
 */

import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Home,
  ArrowRightLeft,
  Coins,
  LayoutGrid,
  Repeat,
  SquareDashed,
  Settings,
  ChevronsUpDown,
  Plus,
  LogOut,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  id: string
  title: string
  icon: LucideIcon
  group: 'main' | 'defi' | 'footer'
}

interface Workspace {
  id: string
  name: string
  label: string
  avatarFallback: string
}

const workspaces: Workspace[] = [
  { id: 'acme', name: 'Acme Inc', label: 'Space', avatarFallback: 'AI' },
  { id: 'personal', name: 'Personal', label: 'Wallet', avatarFallback: 'P' },
  { id: 'dao', name: 'My DAO', label: 'Treasury', avatarFallback: 'MD' },
]

const navItems: NavItem[] = [
  { id: 'home', title: 'Home', icon: Home, group: 'main' },
  { id: 'transactions', title: 'Transactions', icon: ArrowRightLeft, group: 'main' },
  { id: 'assets', title: 'Assets', icon: Coins, group: 'main' },
  { id: 'apps', title: 'Apps', icon: LayoutGrid, group: 'main' },
  { id: 'swap', title: 'Swap', icon: Repeat, group: 'defi' },
  { id: 'bridge', title: 'Bridge', icon: SquareDashed, group: 'defi' },
  { id: 'stake', title: 'Stake', icon: SquareDashed, group: 'defi' },
  { id: 'earn', title: 'Earn', icon: SquareDashed, group: 'defi' },
  { id: 'settings', title: 'Settings', icon: Settings, group: 'footer' },
]

export interface AppSidebarProps {
  /** Initial active item ID */
  defaultActiveId?: string
  /** Initial workspace ID */
  defaultWorkspaceId?: string
  /** Callback when navigation item is clicked */
  onNavigate?: (id: string) => void
  /** Callback when workspace is changed */
  onWorkspaceChange?: (workspaceId: string) => void
}

export function AppSidebar({
  defaultActiveId = 'assets',
  defaultWorkspaceId = 'acme',
  onNavigate,
  onWorkspaceChange,
}: AppSidebarProps) {
  const [activeId, setActiveId] = useState(defaultActiveId)
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(defaultWorkspaceId)

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0]

  const handleNavClick = (id: string) => {
    setActiveId(id)
    onNavigate?.(id)
  }

  const handleWorkspaceChange = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId)
    onWorkspaceChange?.(workspaceId)
  }

  const mainItems = navItems.filter((item) => item.group === 'main')
  const defiItems = navItems.filter((item) => item.group === 'defi')
  const footerItems = navItems.filter((item) => item.group === 'footer')

  return (
    <Sidebar variant="floating" collapsible="none">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" className="bg-muted/50 data-[popup-open]:bg-muted">
                    <Avatar size="sm">
                      <AvatarFallback>{activeWorkspace.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 text-left text-sm leading-tight">
                      <span className="font-medium">{activeWorkspace.name}</span>
                      <span className="text-xs text-muted-foreground">{activeWorkspace.label}</span>
                    </div>
                    <ChevronsUpDown className="size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent side="bottom" align="start" sideOffset={8} className="w-[220px]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                  {workspaces.map((workspace) => (
                    <DropdownMenuItem key={workspace.id} onClick={() => handleWorkspaceChange(workspace.id)}>
                      <Avatar size="sm">
                        <AvatarFallback>{workspace.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 text-left leading-tight">
                        <span className="font-medium">{workspace.name}</span>
                        <span className="text-xs text-muted-foreground">{workspace.label}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="size-4" />
                  <span>Add workspace</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={activeId === item.id} onClick={() => handleNavClick(item.id)}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Defi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {defiItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={activeId === item.id} onClick={() => handleNavClick(item.id)}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton isActive={activeId === item.id} onClick={() => handleNavClick(item.id)}>
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
