import type { ReactElement } from 'react'
import { HnQueueAssessment } from './HnQueueAssessment'
import { useQueueAssessment } from '../../hooks/useQueueAssessment'
import { useHypernativeOAuth } from '../../hooks/useHypernativeOAuth'
import { useShowHypernativeAssessment } from '../../hooks/useShowHypernativeAssessment'

interface HnQueueAssessmentForTxSummaryProps {
  safeTxHash: string | undefined
  isQueue: boolean
}

/**
 * Self-contained wrapper for HnQueueAssessment used in TxSummary.
 *
 * This component encapsulates all the visibility logic and data fetching:
 * - Visibility check via useShowHypernativeAssessment
 * - Assessment data via useQueueAssessment
 * - Auth state via useHypernativeOAuth
 *
 * Consumers only need to pass the minimal props that can't be derived from hooks:
 * - safeTxHash: from getSafeTxHashFromTxId(tx.id)
 * - isQueue: from isTxQueued(tx.txStatus)
 *
 * @example
 * // Before (consumer imports 3 hooks + does conditional rendering):
 * const assessment = useQueueAssessment(safeTxHash)
 * const { isAuthenticated } = useHypernativeOAuth()
 * const showAssessment = useShowHypernativeAssessment({ isQueue, safeTxHash })
 * {showAssessment && <HnQueueAssessment ... />}
 *
 * // After (consumer just renders):
 * <HnQueueAssessmentForTxSummary safeTxHash={safeTxHash} isQueue={isQueue} />
 */
export const HnQueueAssessmentForTxSummary = ({
  safeTxHash,
  isQueue,
}: HnQueueAssessmentForTxSummaryProps): ReactElement | null => {
  // All visibility logic encapsulated here
  const showAssessment = useShowHypernativeAssessment({ isQueue, safeTxHash })

  // Data hooks - only called when needed (hooks are always called but data is conditionally used)
  const assessment = useQueueAssessment(safeTxHash)
  const { isAuthenticated } = useHypernativeOAuth()

  // Self-contained visibility decision
  if (!showAssessment || !safeTxHash) {
    return null
  }

  return <HnQueueAssessment safeTxHash={safeTxHash} assessment={assessment} isAuthenticated={isAuthenticated} />
}
