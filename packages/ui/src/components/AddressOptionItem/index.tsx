import type { ReactElement } from 'react'
import EthHashInfo from '../EthHashInfo'

export interface AddressOptionItemProps {
  address: string
  name: string
  networkPrefix?: string
}

const AddressOptionItem = ({ address, name, networkPrefix }: AddressOptionItemProps): ReactElement => {
  return (
    <EthHashInfo
      address={address}
      name={name}
      prefix={networkPrefix}
      showAvatar={true}
      avatarSize={32}
      shortAddress={false}
      copyAddress={false}
      showAddressBookIcon={true}
    />
  )
}

export default AddressOptionItem
