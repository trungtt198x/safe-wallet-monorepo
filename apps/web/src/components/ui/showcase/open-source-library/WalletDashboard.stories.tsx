import type { Meta, StoryObj } from '@storybook/react'
import { WalletDashboard } from './WalletDashboard'

const sampleUser = {
  name: 'shadcn',
  email: 'm@example.com',
  avatarSrc: 'https://github.com/shadcn.png',
  avatarFallback: 'SC',
}

const sampleOrganization = {
  name: 'Acme Inc',
  plan: 'Enterprise',
  logoFallback: 'AI',
}

const sampleTransactions = [
  {
    id: '1',
    title: 'Send 5 ETH',
    date: 'Jan 21',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'TX',
    confirmations: { current: 1, required: 3 },
  },
  {
    id: '2',
    title: 'Send 5 ETH',
    date: 'Jan 21',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'TX',
    confirmations: { current: 1, required: 3 },
  },
  {
    id: '3',
    title: 'Send 5 ETH',
    date: 'Jan 21',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'TX',
    confirmations: { current: 1, required: 3 },
  },
  {
    id: '4',
    title: 'Send 5 ETH',
    date: 'Jan 21',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'TX',
    confirmations: { current: 1, required: 3 },
  },
]

const sampleAssets = [
  {
    id: '1',
    name: 'ETH',
    symbol: '5 ETH',
    avatarSrc: 'https://github.com/shadcn.png',
    price: 'Credit Card',
    amount: '$250.00',
  },
  {
    id: '2',
    name: 'ETH',
    symbol: 'Description',
    avatarSrc: 'https://github.com/shadcn.png',
    price: 'PayPal',
    amount: '$150.00',
  },
]

const samplePositions = [
  {
    id: '1',
    name: 'ETH',
    symbol: '5 ETH',
    avatarSrc: 'https://github.com/shadcn.png',
    price: 'Credit Card',
    amount: '$250.00',
  },
  {
    id: '2',
    name: 'ETH',
    symbol: 'Description',
    avatarSrc: 'https://github.com/shadcn.png',
    price: 'PayPal',
    amount: '$150.00',
  },
]

const sampleProjects = [
  { id: '1', status: 'Success' as const, email: 'ken99@yahoo...', amount: '$316.00' },
  { id: '2', status: 'Success' as const, email: 'abe45@gmail.c...', amount: '$242.00' },
  { id: '3', status: 'Processing' as const, email: 'monserrat44@...', amount: '$837.00' },
  { id: '4', status: 'Success' as const, email: 'abe45@gmail.c...', amount: '$874.00' },
  { id: '5', status: 'Failed' as const, email: 'carmella@hot...', amount: '$721.00' },
]

const meta = {
  title: 'UI/Showcase/OpenSourceLibrary/WalletDashboard',
  component: WalletDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onNavigate: { action: 'navigate' },
    onSend: { action: 'send' },
    onSwap: { action: 'swap' },
    onReceive: { action: 'receive' },
    onViewAllTransactions: { action: 'view all transactions' },
    onViewAllPortfolio: { action: 'view all portfolio' },
    onProjectAction: { action: 'project action' },
  },
} satisfies Meta<typeof WalletDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    user: sampleUser,
    organization: sampleOrganization,
    totalAssetValue: '$16,801.50',
    pendingTransactions: sampleTransactions,
    assets: sampleAssets,
    positions: samplePositions,
    projects: sampleProjects,
    activeNavItem: 'dashboard',
  },
}

export const AssetsView: Story = {
  args: {
    ...Default.args,
    activeNavItem: 'assets',
  },
}

export const EmptyTransactions: Story = {
  args: {
    ...Default.args,
    pendingTransactions: [],
  },
}

export const LargePortfolio: Story = {
  args: {
    ...Default.args,
    totalAssetValue: '$1,234,567.89',
    assets: [
      ...sampleAssets,
      { id: '3', name: 'BTC', symbol: '2 BTC', price: 'Bank Transfer', amount: '$85,000.00' },
      { id: '4', name: 'USDC', symbol: '10000 USDC', price: 'Credit Card', amount: '$10,000.00' },
    ],
  },
}
