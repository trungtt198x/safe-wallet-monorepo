import { renderHook } from '@/tests/test-utils'
import { useIsOutreachSafe } from '@/features/targetedFeatures/hooks/useIsOutreachSafe'
import { useIsHypernativeGuard } from '../useIsHypernativeGuard'
import { HYPERNATIVE_ALLOWLIST_OUTREACH_ID } from '../../constants'
import { useIsHypernativeEligible } from '../useIsHypernativeEligible'
import type { SafeInfo } from '@safe-global/safe-gateway-typescript-sdk'

jest.mock('@/features/targetedFeatures/hooks/useIsOutreachSafe')
jest.mock('../useIsHypernativeGuard')

const mockUseIsOutreachSafe = useIsOutreachSafe as jest.MockedFunction<typeof useIsOutreachSafe>
const mockUseIsHypernativeGuard = useIsHypernativeGuard as jest.MockedFunction<typeof useIsHypernativeGuard>

const buildMockSafeInfo = (overrides: Partial<SafeInfo> = {}): SafeInfo =>
  ({
    address: { value: '0x1234567890123456789012345678901234567890' },
    chainId: '1',
    version: '1.4.1',
    ...overrides,
  }) as SafeInfo

describe('useIsHypernativeEligible', () => {
  beforeEach(() => {
    mockUseIsOutreachSafe.mockReturnValue({ isTargeted: false, loading: false })
    mockUseIsHypernativeGuard.mockReturnValue({ isHypernativeGuard: false, loading: false })
  })

  it('returns eligible when guard is installed and prerequisites are met', () => {
    mockUseIsHypernativeGuard.mockReturnValue({ isHypernativeGuard: true, loading: false })

    const { result } = renderHook(() => useIsHypernativeEligible())

    expect(result.current.isHypernativeEligible).toBe(true)
    expect(result.current.isHypernativeGuard).toBe(true)
    expect(result.current.isAllowlistedSafe).toBe(false)
  })

  it('returns eligible when Safe is targeted and prerequisites are met', () => {
    mockUseIsOutreachSafe.mockReturnValue({ isTargeted: true, loading: false })

    const { result } = renderHook(() => useIsHypernativeEligible())

    expect(result.current.isHypernativeEligible).toBe(true)
    expect(result.current.isHypernativeGuard).toBe(false)
    expect(result.current.isAllowlistedSafe).toBe(true)
  })

  it('returns eligible when both guard is installed and Safe is targeted', () => {
    mockUseIsHypernativeGuard.mockReturnValue({ isHypernativeGuard: true, loading: false })
    mockUseIsOutreachSafe.mockReturnValue({ isTargeted: true, loading: false })

    const { result } = renderHook(() => useIsHypernativeEligible())

    expect(result.current.isHypernativeEligible).toBe(true)
    expect(result.current.isHypernativeGuard).toBe(true)
    expect(result.current.isAllowlistedSafe).toBe(true)
  })

  it('returns ineligible when neither guard nor targeting applies', () => {
    const { result } = renderHook(() => useIsHypernativeEligible())

    expect(result.current.isHypernativeEligible).toBe(false)
    expect(result.current.isHypernativeGuard).toBe(false)
    expect(result.current.isAllowlistedSafe).toBe(false)
  })

  it('passes the outreach ID and undefined safeInfo to targeted messaging when no safeInfo provided', () => {
    renderHook(() => useIsHypernativeEligible())

    expect(mockUseIsOutreachSafe).toHaveBeenCalledWith(HYPERNATIVE_ALLOWLIST_OUTREACH_ID, { safeInfo: undefined })
  })

  it('exposes guard loading state', () => {
    mockUseIsHypernativeGuard.mockReturnValue({ isHypernativeGuard: false, loading: true })

    const { result } = renderHook(() => useIsHypernativeEligible())

    expect(result.current.loading).toBe(true)
  })

  it('exposes outreach loading state', () => {
    mockUseIsOutreachSafe.mockReturnValue({ isTargeted: false, loading: true })

    const { result } = renderHook(() => useIsHypernativeEligible())

    expect(result.current.loading).toBe(true)
  })

  it('returns loading true when both guard and outreach are loading', () => {
    mockUseIsHypernativeGuard.mockReturnValue({ isHypernativeGuard: false, loading: true })
    mockUseIsOutreachSafe.mockReturnValue({ isTargeted: false, loading: true })

    const { result } = renderHook(() => useIsHypernativeEligible())

    expect(result.current.loading).toBe(true)
  })

  it('returns loading false when neither guard nor outreach are loading', () => {
    mockUseIsHypernativeGuard.mockReturnValue({ isHypernativeGuard: false, loading: false })
    mockUseIsOutreachSafe.mockReturnValue({ isTargeted: false, loading: false })

    const { result } = renderHook(() => useIsHypernativeEligible())

    expect(result.current.loading).toBe(false)
  })

  describe('with custom safeInfo parameter', () => {
    it('passes safeInfo to useIsHypernativeGuard', () => {
      const customSafeInfo = buildMockSafeInfo({ chainId: '137' })

      renderHook(() => useIsHypernativeEligible(customSafeInfo))

      expect(mockUseIsHypernativeGuard).toHaveBeenCalledWith(customSafeInfo)
    })

    it('passes safeInfo to useIsOutreachSafe in options', () => {
      const customSafeInfo = buildMockSafeInfo({ chainId: '137' })

      renderHook(() => useIsHypernativeEligible(customSafeInfo))

      expect(mockUseIsOutreachSafe).toHaveBeenCalledWith(HYPERNATIVE_ALLOWLIST_OUTREACH_ID, {
        safeInfo: customSafeInfo,
      })
    })

    it('returns eligibility based on custom safeInfo guard status', () => {
      const customSafeInfo = buildMockSafeInfo()
      mockUseIsHypernativeGuard.mockReturnValue({ isHypernativeGuard: true, loading: false })

      const { result } = renderHook(() => useIsHypernativeEligible(customSafeInfo))

      expect(result.current.isHypernativeEligible).toBe(true)
      expect(result.current.isHypernativeGuard).toBe(true)
    })

    it('returns eligibility based on custom safeInfo targeting status', () => {
      const customSafeInfo = buildMockSafeInfo()
      mockUseIsOutreachSafe.mockReturnValue({ isTargeted: true, loading: false })

      const { result } = renderHook(() => useIsHypernativeEligible(customSafeInfo))

      expect(result.current.isHypernativeEligible).toBe(true)
      expect(result.current.isAllowlistedSafe).toBe(true)
    })

    it('passes undefined to hooks when no safeInfo provided', () => {
      renderHook(() => useIsHypernativeEligible())

      expect(mockUseIsHypernativeGuard).toHaveBeenCalledWith(undefined)
      expect(mockUseIsOutreachSafe).toHaveBeenCalledWith(HYPERNATIVE_ALLOWLIST_OUTREACH_ID, { safeInfo: undefined })
    })
  })
})
