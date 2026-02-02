import { useState, useMemo } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { Countdown } from '@/components/common/Countdown'
import EthHashInfo from '@/components/common/EthHashInfo'
import ErrorMessage from '@/components/tx/ErrorMessage'
import CopyTooltip from '@/components/common/CopyTooltip'
import { signProposerTypedDataForSafe } from '@/features/proposers/utils/utils'
import { confirmDelegationMessage } from '@/features/proposers/services/delegationMessages'
import { useSubmitDelegation } from '@/features/proposers/hooks/useSubmitDelegation'
import { usePendingDelegations } from '@/features/proposers/hooks/usePendingDelegations'
import { getTotpExpirationDate } from '@/features/proposers/utils/totp'
import useChainId from '@/hooks/useChainId'
import { useCurrentChain } from '@/hooks/useChains'
import useWallet from '@/hooks/wallets/useWallet'
import useOrigin from '@/hooks/useOrigin'
import { useAppDispatch } from '@/store'
import { showNotification } from '@/store/notificationsSlice'
import { getAssertedChainSigner } from '@/services/tx/tx-sender/sdk'
import { AppRoutes } from '@/config/routes'
import { logError } from '@/services/exceptions'
import ErrorCodes from '@safe-global/utils/services/exceptions/ErrorCodes'
import { asError } from '@safe-global/utils/services/exceptions/utils'
import type { PendingDelegation as PendingDelegationType } from '@/features/proposers/types'

type PendingDelegationProps = {
  delegation: PendingDelegationType
}

const PendingDelegationCard = ({ delegation }: PendingDelegationProps) => {
  const [isSignLoading, setIsSignLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const chainId = useChainId()
  const chain = useCurrentChain()
  const wallet = useWallet()
  const dispatch = useAppDispatch()
  const origin = useOrigin()
  const { submitDelegation, isSubmitting } = useSubmitDelegation()
  const { refetch } = usePendingDelegations()

  const hasAlreadySigned = delegation.confirmations.some(
    (c) => c.owner.value.toLowerCase() === wallet?.address?.toLowerCase(),
  )

  const expirationDate = getTotpExpirationDate(delegation.totp)

  // Calculate remaining seconds for countdown
  const remainingSeconds = useMemo(() => {
    const now = Date.now()
    const expirationMs = expirationDate.getTime()
    return Math.max(0, Math.floor((expirationMs - now) / 1000))
  }, [expirationDate])

  // Link to the parent safe's message page where other owners can sign
  const parentSafeId = chain?.shortName
    ? `${chain.shortName}:${delegation.parentSafeAddress}`
    : `${chainId}:${delegation.parentSafeAddress}`
  const shareUrl = origin
    ? `${origin}${AppRoutes.transactions.msg}?safe=${parentSafeId}&messageHash=${delegation.messageHash}`
    : ''

  const handleSign = async () => {
    if (!wallet?.provider) return

    setError(undefined)
    setIsSignLoading(true)

    try {
      const signer = await getAssertedChainSigner(wallet.provider)

      const eoaSignature = await signProposerTypedDataForSafe(
        chainId,
        delegation.delegateAddress,
        delegation.parentSafeAddress,
        signer,
      )

      await confirmDelegationMessage(dispatch, chainId, delegation.messageHash, eoaSignature)

      const newConfirmationsCount = delegation.confirmationsSubmitted + 1
      if (newConfirmationsCount >= delegation.confirmationsRequired) {
        refetch()
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
      const error = asError(err)
      setError(error)
      logError(ErrorCodes._820, err)
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
      const error = asError(err)
      setError(error)
      logError(ErrorCodes._820, err)
    }
  }

  const renderActionButton = () => {
    if (delegation.status === 'ready') {
      return (
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{ minWidth: '140px' }}
        >
          {isSubmitting ? <CircularProgress size={16} /> : 'Submit delegation'}
        </Button>
      )
    }

    if (delegation.status === 'pending' && !hasAlreadySigned) {
      return (
        <Button
          size="small"
          variant="contained"
          onClick={handleSign}
          disabled={isSignLoading}
          sx={{ minWidth: '80px' }}
        >
          {isSignLoading ? <CircularProgress size={16} /> : 'Sign'}
        </Button>
      )
    }

    if (delegation.status === 'pending' && hasAlreadySigned) {
      return (
        <CopyTooltip text={shareUrl} initialToolTipText="Copy link to share">
          <Button size="small" variant="outlined" sx={{ minWidth: '100px' }} disabled={!shareUrl}>
            Copy link
          </Button>
        </CopyTooltip>
      )
    }

    return null
  }

  return (
    <Box>
      <Box sx={{ bgcolor: 'var(--color-border-background)', borderRadius: 1, p: 2 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
            {delegation.action === 'remove' ? 'Remove proposer:' : 'New proposer:'}
          </Typography>
          <Box sx={{ '& .ethHashInfo-name': { fontWeight: 700 } }}>
            <EthHashInfo
              address={delegation.delegateAddress}
              showCopyButton
              shortAddress={false}
              name={delegation.delegateLabel}
              hasExplorer
            />
          </Box>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
        {remainingSeconds > 0 ? (
          <>
            Expires in <Countdown seconds={remainingSeconds} />
          </>
        ) : (
          <Typography component="span" variant="caption" color="error">
            Expired
          </Typography>
        )}
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
        <Typography variant="body1">
          <Box component="span" fontWeight={700}>
            {delegation.confirmationsSubmitted}/{delegation.confirmationsRequired}
          </Box>{' '}
          signatures collected
        </Typography>

        {renderActionButton()}
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
