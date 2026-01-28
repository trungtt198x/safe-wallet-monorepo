import type { ComponentType } from 'react'
import { withHnBannerConditions, type WithHnBannerConditionsProps } from '../withHnBannerConditions'
import { withHnSignupFlow } from '../withHnSignupFlow'
import { BannerType } from '../../hooks/useBannerStorage'
import { HnMiniTxBannerWithDismissal } from './HnMiniTxBannerWithDismissal'

// Export the original pure component for tests and stories
export { HnMiniTxBanner } from './HnMiniTxBanner'
export type { HnMiniTxBannerProps } from './HnMiniTxBanner'

// Export the composed HOC as default for use in transaction flows
// Apply withHnSignupFlow first (inner), then withHnBannerConditions
// Note: withHnFeature removed - feature gating is now handled by main barrel file
const HnMiniTxBannerWithSignupAndDismissal = withHnSignupFlow(HnMiniTxBannerWithDismissal)
const HnMiniTxBannerWithConditions = withHnBannerConditions(BannerType.Promo)(
  HnMiniTxBannerWithSignupAndDismissal as ComponentType<WithHnBannerConditionsProps>,
)
export default HnMiniTxBannerWithConditions
