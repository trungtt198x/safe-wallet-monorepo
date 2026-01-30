import type { Meta, StoryObj } from '@storybook/react'
import { Paper } from '@mui/material'
import { StoreDecorator } from '@/stories/storeDecorator'
import SafeHeaderInfo from './SafeHeaderInfo'
import { extendedSafeInfoBuilder } from '@/tests/builders/safe'
import { toBeHex } from 'ethers'
import { TOKEN_LISTS } from '@/store/settingsSlice'

const MOCK_SAFE_ADDRESS = '0x0000000000000000000000000000000000005AFE'

const createMockSafe = (deployed: boolean, threshold: number, ownersCount: number) => {
  return extendedSafeInfoBuilder()
    .with({
      address: { value: MOCK_SAFE_ADDRESS },
      chainId: '1',
      threshold,
      owners: Array.from({ length: ownersCount }, (_, i) => ({
        value: toBeHex(i + 1, 20),
      })),
      deployed,
    })
    .build()
}

const createInitialState = (mockSafe: ReturnType<typeof createMockSafe>, ensName?: string, isDarkMode = false) => ({
  safeInfo: {
    data: mockSafe,
    loading: false,
    loaded: true,
    error: undefined,
  },
  settings: {
    currency: 'usd',
    hiddenTokens: {},
    tokenList: TOKEN_LISTS.ALL,
    shortName: { copy: true, qr: true, show: true },
    theme: { darkMode: isDarkMode },
    hideDust: false,
    env: { tenderly: { url: '', accessToken: '' }, rpc: {} },
    signing: { onChainSigning: false, blindSigning: false },
    transactionExecution: true,
  },
  chains: {
    data: [{ chainId: mockSafe.chainId, chainName: 'Ethereum', features: ['DOMAIN_LOOKUP', 'DEFAULT_TOKENLIST'] }],
    loading: false,
    loaded: true,
    error: undefined,
  },
  addressBook: ensName ? { [mockSafe.chainId]: { [MOCK_SAFE_ADDRESS]: ensName } } : {},
})

const meta = {
  component: SafeHeaderInfo,
  parameters: {
    componentSubtitle: 'Displays Safe header information',
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      const mockSafe = createMockSafe(true, 2, 3)
      const isDarkMode = context.globals?.theme === 'dark'

      return (
        <StoreDecorator initialState={createInitialState(mockSafe, undefined, isDarkMode)} context={context}>
          <Paper sx={{ padding: 3, minWidth: 300 }}>
            <Story />
          </Paper>
        </StoreDecorator>
      )
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SafeHeaderInfo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CounterfactualSafe: Story = {
  decorators: [
    (Story, context) => {
      const mockSafe = createMockSafe(false, 2, 3)
      const isDarkMode = context.globals?.theme === 'dark'

      return (
        <StoreDecorator initialState={createInitialState(mockSafe, undefined, isDarkMode)} context={context}>
          <Paper sx={{ padding: 3, minWidth: 300 }}>
            <Story />
          </Paper>
        </StoreDecorator>
      )
    },
  ],
}

export const SingleOwner: Story = {
  decorators: [
    (Story, context) => {
      const mockSafe = createMockSafe(true, 1, 1)
      const isDarkMode = context.globals?.theme === 'dark'

      return (
        <StoreDecorator initialState={createInitialState(mockSafe, undefined, isDarkMode)} context={context}>
          <Paper sx={{ padding: 3, minWidth: 300 }}>
            <Story />
          </Paper>
        </StoreDecorator>
      )
    },
  ],
}

export const LoadingState: Story = {
  decorators: [
    (Story, context) => {
      const isDarkMode = context.globals?.theme === 'dark'

      return (
        <StoreDecorator
          initialState={{
            ...createInitialState(createMockSafe(true, 2, 3), undefined, isDarkMode),
            safeInfo: {
              data: undefined,
              loading: true,
              loaded: false,
              error: undefined,
            },
          }}
          context={context}
        >
          <Paper sx={{ padding: 3, minWidth: 300 }}>
            <Story />
          </Paper>
        </StoreDecorator>
      )
    },
  ],
}
