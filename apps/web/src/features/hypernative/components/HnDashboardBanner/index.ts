import type { ComponentType } from 'react'
import { withHnBannerConditions, type WithHnBannerConditionsProps } from '../withHnBannerConditions'
import { withHnSignupFlow } from '../withHnSignupFlow'
import { BannerType } from '../../hooks/useBannerStorage'
import { HnDashboardBanner } from './HnDashboardBanner'

// Export the original component for tests and stories
export { HnDashboardBanner } from './HnDashboardBanner'
export type { HnDashboardBannerProps } from './HnDashboardBanner'

// Export the composed HOC as default for use in Dashboard FirstSteps
// Apply withHnSignupFlow first (inner), then withHnBannerConditions
// Note: withHnFeature removed - feature gating is now handled by main barrel file
const HnDashboardBannerWithSignup = withHnSignupFlow(HnDashboardBanner)
const HnDashboardBannerWithConditions = withHnBannerConditions(BannerType.Promo)(
  HnDashboardBannerWithSignup as ComponentType<WithHnBannerConditionsProps>,
)
export default HnDashboardBannerWithConditions

// Export the composed HOC for use in Dashboard FirstSteps (no balance check variant)
// Note: withHnFeature removed - feature gating is now handled by main barrel file
export const HnDashboardBannerWithNoBalanceCheck = withHnBannerConditions(BannerType.NoBalanceCheck)(
  HnDashboardBannerWithSignup as ComponentType<WithHnBannerConditionsProps>,
)
