import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import type { SvgIconProps } from '@mui/material'

/**
 * A spinning icon component for indicating loading/processing states.
 * Uses MUI's AutorenewRounded icon with a continuous rotation animation.
 */
const SpinningIcon = (props: SvgIconProps) => {
  return (
    <AutorenewRoundedIcon
      {...props}
      sx={{
        ...props.sx,
        animation: 'spin 2s linear infinite',
        '@keyframes spin': {
          '0%': {
            transform: 'rotate(0)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      }}
    />
  )
}

export default SpinningIcon
