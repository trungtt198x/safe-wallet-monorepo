import { Box, Typography } from '@mui/material'
import PendingDelegationCard from './PendingDelegation'
import { usePendingDelegations } from '@/features/proposers/hooks/usePendingDelegations'

const PendingDelegationsList = () => {
  const { pendingDelegations, isLoading } = usePendingDelegations()

  if (isLoading || pendingDelegations.length === 0) return null

  return (
    <Box mb={2}>
      <Typography variant="subtitle2" fontWeight={700} mb={1}>
        Pending delegations
      </Typography>

      {pendingDelegations.map((delegation) => (
        <PendingDelegationCard key={delegation.messageHash} delegation={delegation} />
      ))}
    </Box>
  )
}

export default PendingDelegationsList
