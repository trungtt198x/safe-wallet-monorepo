import { useState } from 'react'
import { Box, Button, Chip, CircularProgress, LinearProgress, Typography } from '@mui/material'
import EthHashInfo from '@/components/common/EthHashInfo'
import ErrorMessage from '@/components/tx/ErrorMessage'
import { signProposerTypedDataForSafe } from '@/features/proposers/utils/utils'
import { confirmDelegationMessage } from '@/features/proposers/services/delegationMessages'
import { useSubmitDelegation } from '@/features/proposers/hooks/useSubmitDelegation'
import { usePendingDelegations } from '@/features/proposers/hooks/usePendingDelegations'
import useChainId from '@/hooks/useChainId'
import useWallet from '@/hooks/wallets/useWallet'
import { useAppDispatch } from '@/store'
import { showNotification } from '@/store/notificationsSlice'
import { getAssertedChainSigner } from '@/services/tx/tx-sender/sdk'
import type { PendingDelegation as PendingDelegationType } from '@/features/proposers/types'

type PendingDelegationProps = {
  delegation: PendingDelegationType
}

const PendingDelegationCard = ({ delegation }: PendingDelegationProps) => {
  const [isSignLoading, setIsSignLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const chainId = useChainId()
  const wallet = useWallet()
  const dispatch = useAppDispatch()
  const { submitDelegation, isSubmitting } = useSubmitDelegation()
  const { refetch } = usePendingDelegations()

  const progress = (delegation.confirmationsSubmitted / delegation.confirmationsRequired) * 100
  const hasAlreadySigned = delegation.confirmations.some(
    (c) => c.owner.value.toLowerCase() === wallet?.address?.toLowerCase(),
  )

  const handleSign = async () => {
    if (!wallet?.provider) return

    setError(undefined)
    setIsSignLoading(true)

    try {
      const signer = await getAssertedChainSigner(wallet.provider)

      // Sign the same SafeMessage that the initiator signed
      const eoaSignature = await signProposerTypedDataForSafe(
        chainId,
        delegation.delegateAddress,
        delegation.parentSafeAddress,
        signer,
      )

      // Confirm the off-chain message
      await confirmDelegationMessage(dispatch, chainId, delegation.messageHash, eoaSignature)

      // Check if this confirmation meets the threshold
      const newConfirmationsCount = delegation.confirmationsSubmitted + 1
      if (newConfirmationsCount >= delegation.confirmationsRequired) {
        // Refetch to get the updated preparedSignature, then auto-submit
        refetch()

        // Compute what the preparedSignature would contain for auto-submission
        // We need to refetch and get the updated message with preparedSignature
        // The refetch will update the delegation status to 'ready' and show the submit button
        dispatch(
          showNotification({
            variant: 'success',
            groupKey: 'delegation-threshold-met',
            title: 'Threshold met!',
            message: 'All required signatures have been collected. You can now submit the delegation.',
          }),
        )
      } else {
        dispatch(
          showNotification({
            variant: 'success',
            groupKey: 'delegation-signed',
            title: 'Signature added',
            message: `${newConfirmationsCount} of ${delegation.confirmationsRequired} signatures collected.`,
          }),
        )
        refetch()
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsSignLoading(false)
    }
  }

  const handleSubmit = async () => {
    setError(undefined)
    try {
      await submitDelegation(delegation)
      dispatch(
        showNotification({
          variant: 'success',
          groupKey: 'delegation-submitted',
          title: `Proposer ${delegation.action === 'add' ? 'added' : 'removed'} successfully!`,
          message: '',
        }),
      )
      refetch()
    } catch (err) {
      setError(err as Error)
    }
  }

  const statusChip = {
    pending: <Chip label="Pending" size="small" color="warning" />,
    ready: <Chip label="Ready to submit" size="small" color="success" />,
    expired: <Chip label="Expired" size="small" color="error" />,
  }

  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight={700}>
            {delegation.action === 'add' ? 'Add' : 'Remove'} proposer
          </Typography>
          {statusChip[delegation.status]}
        </Box>
      </Box>

      <Box mb={1}>
        <EthHashInfo address={delegation.delegateAddress} showCopyButton shortAddress name={delegation.delegateLabel} />
      </Box>

      {delegation.status !== 'expired' && (
        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" color="text.secondary">
              Signatures
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {delegation.confirmationsSubmitted} of {delegation.confirmationsRequired}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
        <Typography variant="caption" color="text.secondary">
          Initiated by <EthHashInfo address={delegation.proposedBy.value} showCopyButton shortAddress avatarSize={16} />
        </Typography>

        <Box display="flex" gap={1}>
          {delegation.status === 'pending' && !hasAlreadySigned && (
            <Button
              size="small"
              variant="contained"
              onClick={handleSign}
              disabled={isSignLoading}
              sx={{ minWidth: '80px' }}
            >
              {isSignLoading ? <CircularProgress size={16} /> : 'Sign'}
            </Button>
          )}

          {delegation.status === 'pending' && hasAlreadySigned && (
            <Typography variant="caption" color="text.secondary">
              You have signed
            </Typography>
          )}

          {delegation.status === 'ready' && (
            <Button
              size="small"
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{ minWidth: '100px' }}
            >
              {isSubmitting ? <CircularProgress size={16} /> : 'Submit delegation'}
            </Button>
          )}

          {delegation.status === 'expired' && (
            <Typography variant="caption" color="text.secondary">
              This delegation request has expired. Please initiate a new one.
            </Typography>
          )}
        </Box>
      </Box>

      {error && (
        <Box mt={1}>
          <ErrorMessage error={error}>
            {delegation.status === 'ready' ? 'Error submitting delegation' : 'Error signing delegation'}
          </ErrorMessage>
        </Box>
      )}
    </Box>
  )
}

export default PendingDelegationCard
