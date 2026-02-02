import { useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, CircularProgress, SvgIcon, Typography } from '@mui/material'
import DeleteIcon from '@/public/images/common/delete.svg'
import EthHashInfo from '@/components/common/EthHashInfo'
import ErrorMessage from '@/components/tx/ErrorMessage'
import CopyTooltip from '@/components/common/CopyTooltip'
import { signProposerTypedDataForSafe } from '@/features/proposers/utils/utils'
import { confirmDelegationMessage } from '@/features/proposers/services/delegationMessages'
import { useSubmitDelegation } from '@/features/proposers/hooks/useSubmitDelegation'
import { usePendingDelegations } from '@/features/proposers/hooks/usePendingDelegations'
import { getTotpExpirationDate } from '@/features/proposers/utils/totp'
import useChainId from '@/hooks/useChainId'
import useWallet from '@/hooks/wallets/useWallet'
import useOrigin from '@/hooks/useOrigin'
import { useAppDispatch } from '@/store'
import { showNotification } from '@/store/notificationsSlice'
import { getAssertedChainSigner } from '@/services/tx/tx-sender/sdk'
import { AppRoutes } from '@/config/routes'
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
  const router = useRouter()
  const origin = useOrigin()
  const { submitDelegation, isSubmitting } = useSubmitDelegation()
  const { refetch } = usePendingDelegations()

  const hasAlreadySigned = delegation.confirmations.some(
    (c) => c.owner.value.toLowerCase() === wallet?.address?.toLowerCase(),
  )

  const expirationDate = getTotpExpirationDate(delegation.totp)
  const formattedExpiration = expirationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const { safe = '' } = router.query
  const shareUrl = `${origin}${AppRoutes.transactions.msg}?safe=${safe}&messageHash=${delegation.messageHash}`

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
          <Button size="small" variant="outlined" sx={{ minWidth: '100px' }}>
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
          {delegation.action === 'remove' ? (
            <>
              <SvgIcon component={DeleteIcon} inheritViewBox fontSize="small" color="error" sx={{ flexShrink: 0 }} />
              <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                Remove proposer:
              </Typography>
            </>
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              New proposer:
            </Typography>
          )}
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
        Expires on {formattedExpiration}
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
