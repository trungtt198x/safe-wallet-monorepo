import type { ReactElement } from 'react'
import { isAddress } from 'ethers'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import SvgIcon from '@mui/material/SvgIcon'
import Identicon from '../Identicon'
import type { EthHashInfoProps } from './types'

export type { EthHashInfoProps } from './types'

const shortenAddress = (address: string, length = 4): string => {
  if (!address) {
    return ''
  }
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

const AddressBookIcon = () => (
  <SvgIcon inheritViewBox fontSize="small" sx={{ color: 'border.main' }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.66671 5.99998V9.99998H2.00004C1.63185 9.99998 1.33337 10.2985 1.33337 10.6666C1.33337 11.0348 1.63185 11.3333 2.00004 11.3333H2.66671V13.3333C2.66671 14.0697 3.26366 14.6666 4.00004 14.6666H12C12.7364 14.6666 13.3334 14.0697 13.3334 13.3333V2.66665C13.3334 1.93027 12.7364 1.33331 12 1.33331H4.00004C3.26366 1.33331 2.66671 1.93027 2.66671 2.66665V4.66665H2.00004C1.63185 4.66665 1.33337 4.96512 1.33337 5.33331C1.33337 5.7015 1.63185 5.99998 2.00004 5.99998H2.66671ZM4.66671 9.99998H4.00004V5.99998H4.66671C5.0349 5.99998 5.33337 5.7015 5.33337 5.33331C5.33337 4.96512 5.0349 4.66665 4.66671 4.66665H4.00004V2.66665H12V13.3333H4.00004V11.3333H4.66671C5.0349 11.3333 5.33337 11.0348 5.33337 10.6666C5.33337 10.2985 5.0349 9.99998 4.66671 9.99998Z"
        fill="currentColor"
      />
    </svg>
  </SvgIcon>
)

const EthHashInfo = ({
  address,
  customAvatar,
  prefix = '',
  showPrefix = true,
  shortAddress = true,
  showAvatar = true,
  onlyName = false,
  avatarSize,
  name,
  showAddressBookIcon = false,
  children,
}: EthHashInfoProps): ReactElement => {
  const shouldPrefix = isAddress(address)
  const identicon = <Identicon address={address} size={avatarSize} />

  const addressElement = (
    <Typography variant="body2" component="span" noWrap>
      {showPrefix && shouldPrefix && prefix && <b>{prefix}:</b>}
      {shortAddress ? shortenAddress(address) : address}
    </Typography>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5em',
        lineHeight: 1.4,
        width: '100%',
      }}
    >
      {showAvatar && (
        <Box
          sx={{
            flexShrink: 0,
            position: 'relative',
            width: avatarSize !== undefined ? `${avatarSize}px` : undefined,
            height: avatarSize !== undefined ? `${avatarSize}px` : undefined,
            '& > *': {
              width: '100% !important',
              height: '100% !important',
            },
          }}
        >
          {customAvatar ? (
            <Box
              component="img"
              src={customAvatar}
              alt=""
              sx={{
                borderRadius: '50%',
                width: avatarSize,
                height: avatarSize,
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.currentTarget
                target.style.display = 'none'
              }}
            />
          ) : (
            identicon
          )}
        </Box>
      )}

      <Box
        sx={{
          overflow: 'hidden',
          display: onlyName ? 'flex' : 'block',
          alignItems: onlyName ? 'center' : undefined,
        }}
      >
        {!!name && (
          <Box title={name} className="ethHashInfo-name" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" noWrap>
              {name}
            </Typography>
            {showAddressBookIcon && (
              <Tooltip title="From your address book" placement="top">
                <span style={{ lineHeight: 0 }}>
                  <AddressBookIcon />
                </span>
              </Tooltip>
            )}
          </Box>
        )}

        {(!onlyName || !name) && (
          <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {addressElement}
            {children}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default EthHashInfo
