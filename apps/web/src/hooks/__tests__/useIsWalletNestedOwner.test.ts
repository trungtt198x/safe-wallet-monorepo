import { renderHook, waitFor } from '@/tests/test-utils'
import { useIsWalletNestedOwner } from '../useIsWalletNestedOwner'
import useSafeInfo from '@/hooks/useSafeInfo'
import useWallet from '@/hooks/wallets/useWallet'
import { faker } from '@faker-js/faker'
import { addressExBuilder, extendedSafeInfoBuilder } from '@/tests/builders/safe'
import { connectedWalletBuilder } from '@/tests/builders/wallet'
import { isSmartContractWallet } from '@/utils/wallets'

jest.mock('@/hooks/useSafeInfo')
jest.mock('@/hooks/wallets/useWallet')
jest.mock('@/utils/wallets', () => ({
  isSmartContractWallet: jest.fn(),
}))

describe('useIsWalletNestedOwner', () => {
  const mockUseSafeInfo = useSafeInfo as jest.MockedFunction<typeof useSafeInfo>
  const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>
  const mockIsSmartContractWallet = isSmartContractWallet as jest.MockedFunction<typeof isSmartContractWallet>

  const parentSafeAddress = faker.finance.ethereumAddress()
  const eoaAddress = faker.finance.ethereumAddress()
  const safeAddress = faker.finance.ethereumAddress()

  const mockSafeInfo = {
    safeAddress,
    safe: extendedSafeInfoBuilder()
      .with({ address: { value: safeAddress } })
      .with({ chainId: '1' })
      .with({ owners: [addressExBuilder().with({ value: parentSafeAddress }).build()] })
      .build(),
    safeLoaded: true,
    safeLoading: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSafeInfo.mockReturnValue(mockSafeInfo)
  })

  it('should return false when wallet is not connected', () => {
    mockUseWallet.mockReturnValue(null)

    const { result } = renderHook(() => useIsWalletNestedOwner())

    expect(result.current).toBe(false)
  })

  it('should return false when wallet address is not in owners list', async () => {
    const wallet = connectedWalletBuilder().with({ address: eoaAddress, chainId: '1' }).build()
    mockUseWallet.mockReturnValue(wallet)

    const { result } = renderHook(() => useIsWalletNestedOwner())

    expect(result.current).toBe(false)
  })

  it('should return false when wallet is in owners but is an EOA (not smart contract)', async () => {
    const wallet = connectedWalletBuilder().with({ address: parentSafeAddress, chainId: '1' }).build()
    mockUseWallet.mockReturnValue(wallet)
    mockIsSmartContractWallet.mockResolvedValue(false)

    const { result } = renderHook(() => useIsWalletNestedOwner())

    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  it('should return true when wallet is in owners AND is a smart contract', async () => {
    const wallet = connectedWalletBuilder().with({ address: parentSafeAddress, chainId: '1' }).build()
    mockUseWallet.mockReturnValue(wallet)
    mockIsSmartContractWallet.mockResolvedValue(true)

    const { result } = renderHook(() => useIsWalletNestedOwner())

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should return false when safe is not loaded', () => {
    mockUseSafeInfo.mockReturnValue({
      ...mockSafeInfo,
      safeLoaded: false,
    })
    const wallet = connectedWalletBuilder().with({ address: parentSafeAddress, chainId: '1' }).build()
    mockUseWallet.mockReturnValue(wallet)

    const { result } = renderHook(() => useIsWalletNestedOwner())

    expect(result.current).toBe(false)
  })

  it('should handle case-insensitive address comparison', async () => {
    const wallet = connectedWalletBuilder().with({ address: parentSafeAddress.toLowerCase(), chainId: '1' }).build()
    mockUseWallet.mockReturnValue(wallet)
    mockIsSmartContractWallet.mockResolvedValue(true)

    const { result } = renderHook(() => useIsWalletNestedOwner())

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })
})
