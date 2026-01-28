import { selectUndeployedSafe } from '../../store/undeployedSafesSlice'
import useSafeInfo from '@/hooks/useSafeInfo'
import InfoIcon from '@/public/images/notifications/info.svg'
import { useAppSelector } from '@/store'
import SpinningIcon from '@/components/common/SpinningIcon'
import { IconButton, Tooltip } from '@mui/material'
import classnames from 'classnames'
import css from './styles.module.css'

const CounterfactualStatusButton = () => {
  const { safe, safeAddress } = useSafeInfo()
  const undeployedSafe = useAppSelector((state) => selectUndeployedSafe(state, safe.chainId, safeAddress))

  if (safe.deployed) return null

  const isActivating = undeployedSafe?.status.status !== 'AWAITING_EXECUTION'

  return (
    <Tooltip
      placement="right"
      title={isActivating ? 'Safe Account is being activated' : 'Safe Account is not activated'}
      arrow
    >
      <IconButton
        data-testid="pending-activation-icon"
        className={classnames(css.statusButton, { [css.processing]: isActivating })}
        size="small"
        color={isActivating ? 'info' : 'warning'}
        disableRipple
      >
        {isActivating ? <SpinningIcon /> : <InfoIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default CounterfactualStatusButton
