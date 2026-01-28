'use client'

import { Avatar, AvatarFallback, AvatarImage } from '../../avatar'
import { Button } from '../../button'
import { Separator } from '../../separator'
import {
  LayoutDashboardIcon,
  WalletIcon,
  ListIcon,
  SettingsIcon,
  ArrowLeftRightIcon,
  TrendingUpIcon,
  RefreshCwIcon,
  MoreHorizontalIcon,
  ChevronsUpDownIcon,
  GalleryVerticalEndIcon,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
}

export interface User {
  name: string
  email: string
  avatarSrc?: string
  avatarFallback: string
}

export interface Organization {
  name: string
  plan: string
  logoSrc?: string
  logoFallback: string
}

export interface WalletSidebarProps {
  user: User
  organization: Organization
  activeItemId?: string
  onNavigate?: (itemId: string) => void
}

const walletNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon /> },
  { id: 'assets', label: 'Assets', icon: <WalletIcon /> },
  { id: 'transactions', label: 'Transactions', icon: <ListIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
]

const defiNavItems: NavItem[] = [
  { id: 'bridge', label: 'Bridge', icon: <ArrowLeftRightIcon /> },
  { id: 'earn', label: 'Earn', icon: <TrendingUpIcon /> },
  { id: 'swap', label: 'Swap', icon: <RefreshCwIcon /> },
  { id: 'more', label: 'More', icon: <MoreHorizontalIcon /> },
]

function NavGroup({
  title,
  items,
  activeItemId,
  onNavigate,
}: {
  title: string
  items: NavItem[]
  activeItemId?: string
  onNavigate?: (itemId: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground px-2 py-1.5 text-xs font-medium">{title}</span>
      {items.map((item) => (
        <Button
          key={item.id}
          variant={activeItemId === item.id ? 'secondary' : 'ghost'}
          size="sm"
          className="justify-start gap-2"
          onClick={() => onNavigate?.(item.id)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </div>
  )
}

export function WalletSidebar({ user, organization, activeItemId = 'dashboard', onNavigate }: WalletSidebarProps) {
  return (
    <div className="border-border flex h-full w-64 flex-col border-r bg-white">
      {/* Organization Switcher */}
      <div className="p-3">
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-semibold">{organization.name}</span>
              <span className="text-muted-foreground text-xs">{organization.plan}</span>
            </div>
          </div>
          <ChevronsUpDownIcon className="text-muted-foreground size-4" />
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
        <NavGroup title="Wallet" items={walletNavItems} activeItemId={activeItemId} onNavigate={onNavigate} />
        <NavGroup title="DeFi" items={defiNavItems} activeItemId={activeItemId} onNavigate={onNavigate} />
      </div>

      <Separator />

      {/* User Account */}
      <div className="p-3">
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              {user.avatarSrc && <AvatarImage src={user.avatarSrc} alt={user.name} />}
              <AvatarFallback>{user.avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-muted-foreground text-xs">{user.email}</span>
            </div>
          </div>
          <ChevronsUpDownIcon className="text-muted-foreground size-4" />
        </Button>
      </div>
    </div>
  )
}
