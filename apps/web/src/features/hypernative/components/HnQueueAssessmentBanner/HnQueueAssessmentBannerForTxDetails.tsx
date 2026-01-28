import type { ReactElement } from 'react'
import { HnQueueAssessmentBanner } from './HnQueueAssessmentBanner'
import { useQueueAssessment } from '../../hooks/useQueueAssessment'
import { useHypernativeOAuth } from '../../hooks/useHypernativeOAuth'
import { useShowHypernativeAssessment } from '../../hooks/useShowHypernativeAssessment'

interface HnQueueAssessmentBannerForTxDetailsProps {
  safeTxHash: string | undefined
  isQueue: boolean
}

/**
 * Self-contained wrapper for HnQueueAssessmentBanner used in TxDetails.
 *
 * This component encapsulates all the visibility logic and data fetching:
 * - Visibility check via useShowHypernativeAssessment
 * - Assessment data via useQueueAssessment
 * - Auth state via useHypernativeOAuth
 *
 * Consumers only need to pass the minimal props that can't be derived from hooks:
 * - safeTxHash: from txDetails.detailedExecutionInfo
 * - isQueue: from isTxQueued(txSummary.txStatus)
 *
 * @example
 * // Before (consumer imports 3 hooks + does conditional rendering):
 * const assessment = useQueueAssessment(safeTxHash)
 * const { isAuthenticated } = useHypernativeOAuth()
 * const showAssessmentBanner = useShowHypernativeAssessment({ isQueue, safeTxHash })
 * {showAssessmentBanner && safeTxHash && chainId && <HnQueueAssessmentBanner ... />}
 *
 * // After (consumer just renders):
 * <HnQueueAssessmentBannerForTxDetails safeTxHash={safeTxHash} isQueue={isQueue} />
 */
export const HnQueueAssessmentBannerForTxDetails = ({
  safeTxHash,
  isQueue,
}: HnQueueAssessmentBannerForTxDetailsProps): ReactElement | null => {
  // All visibility logic encapsulated here
  const showAssessmentBanner = useShowHypernativeAssessment({ isQueue, safeTxHash })

  // Data hooks - only called when needed (hooks are always called but data is conditionally used)
  const assessment = useQueueAssessment(safeTxHash)
  const { isAuthenticated } = useHypernativeOAuth()

  // Self-contained visibility decision
  if (!showAssessmentBanner || !safeTxHash) {
    return null
  }

  return <HnQueueAssessmentBanner safeTxHash={safeTxHash} assessment={assessment} isAuthenticated={isAuthenticated} />
}
