import type { ReactNode } from 'react'
import { render, screen } from '@/tests/test-utils'
import SafeShieldWidget from '../index'
import type { AsyncResult } from '@safe-global/utils/hooks/useAsync'
import type {
  ContractAnalysisResults,
  RecipientAnalysisResults,
  ThreatAnalysisResults,
} from '@safe-global/utils/features/safe-shield/types'
import { useSafeShield } from '../SafeShieldContext'
import { useLoadFeature } from '@/features/__core__'
import { useCheckSimulation } from '../hooks/useCheckSimulation'
import type { HypernativeEligibility } from '@/features/hypernative'

jest.mock('../SafeShieldContext')
jest.mock('@/features/__core__', () => ({
  ...jest.requireActual('@/features/__core__'),
  useLoadFeature: jest.fn(),
}))
jest.mock('../hooks/useCheckSimulation')

const mockUseSafeShield = useSafeShield as jest.MockedFunction<typeof useSafeShield>
const mockUseLoadFeature = useLoadFeature as jest.MockedFunction<typeof useLoadFeature>
const mockUseCheckSimulation = useCheckSimulation as jest.MockedFunction<typeof useCheckSimulation>

const emptyRecipient: AsyncResult<RecipientAnalysisResults> = [{}, undefined, false]
const emptyContract: AsyncResult<ContractAnalysisResults> = [{}, undefined, false]
const emptyThreat: AsyncResult<ThreatAnalysisResults> = [undefined, undefined, false]

const makeEligibility = (overrides: Partial<HypernativeEligibility> = {}): HypernativeEligibility => ({
  isHypernativeEligible: false,
  isHypernativeGuard: false,
  isAllowlistedSafe: false,
  loading: false,
  ...overrides,
})

const mockUseHypernativeOAuth = jest.fn()
const mockUseIsHypernativeEligible = jest.fn()

// Mock component that renders children
const MockHypernativeTooltip = ({ children }: { children: ReactNode }) => <>{children}</>

const createMockHnFeature = () =>
  ({
    useHypernativeOAuth: mockUseHypernativeOAuth,
    useIsHypernativeEligible: mockUseIsHypernativeEligible,
    HypernativeTooltip: MockHypernativeTooltip,
    $isReady: true,
    $isLoading: false,
    $isDisabled: false,
    $error: null,
    name: 'hypernative',
    useIsEnabled: () => true,
  }) as unknown as ReturnType<typeof useLoadFeature>

describe('SafeShieldWidget', () => {
  beforeEach(() => {
    mockUseSafeShield.mockReturnValue({
      recipient: emptyRecipient,
      contract: emptyContract,
      threat: emptyThreat,
      safeTx: undefined,
      needsRiskConfirmation: false,
      isRiskConfirmed: false,
      setIsRiskConfirmed: jest.fn(),
      setRecipientAddresses: jest.fn(),
      setSafeTx: jest.fn(),
    })
    mockUseHypernativeOAuth.mockReturnValue({
      isAuthenticated: false,
      isTokenExpired: false,
      initiateLogin: jest.fn(),
      logout: jest.fn(),
    })
    mockUseIsHypernativeEligible.mockReturnValue(makeEligibility())
    mockUseCheckSimulation.mockReturnValue({ hasSimulationError: false })
    mockUseLoadFeature.mockReturnValue(createMockHnFeature())
  })

  it('does not show Hypernative info when Safe is ineligible', () => {
    render(<SafeShieldWidget />)

    expect(screen.queryByText('Hypernative Guardian is active')).not.toBeInTheDocument()
    expect(screen.queryByText('Log in to Hypernative to view the full analysis.')).not.toBeInTheDocument()
  })

  it('shows Hypernative login CTA with guardian status when Safe has the guard installed', () => {
    mockUseIsHypernativeEligible.mockReturnValue(
      makeEligibility({ isHypernativeEligible: true, isHypernativeGuard: true }),
    )

    render(<SafeShieldWidget />)

    expect(screen.getByText('Hypernative Guardian is active')).toBeInTheDocument()
    expect(screen.getByText('Log in to Hypernative to view the full analysis.')).toBeInTheDocument()
  })

  it('shows Hypernative login CTA without guardian status when Safe is eligible via outreach only', () => {
    mockUseIsHypernativeEligible.mockReturnValue(
      makeEligibility({ isHypernativeEligible: true, isAllowlistedSafe: true }),
    )

    render(<SafeShieldWidget />)

    expect(screen.queryByText('Hypernative Guardian is active')).not.toBeInTheDocument()
    expect(screen.getByText('Log in to Hypernative to view the full analysis.')).toBeInTheDocument()
  })

  it('does not show Hypernative info while eligibility is loading', () => {
    mockUseIsHypernativeEligible.mockReturnValue(makeEligibility({ isHypernativeEligible: true, loading: true }))

    render(<SafeShieldWidget />)

    expect(screen.queryByText('Hypernative Guardian is active')).not.toBeInTheDocument()
  })
})
