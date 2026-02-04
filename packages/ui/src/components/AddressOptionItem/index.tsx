import { type ReactElement, memo } from 'react'
import EthHashInfo from '../EthHashInfo'

export interface AddressOptionItemProps {
  address: string
  name: string
  networkPrefix?: string
}

const AddressOptionItemComponent = ({ address, name, networkPrefix }: AddressOptionItemProps): ReactElement => {
  return (
    <EthHashInfo
      address={address}
      name={name}
      prefix={networkPrefix}
      showAvatar={true}
      avatarSize={32}
      shortAddress={false}
      showAddressBookIcon={true}
    />
  )
}

const AddressOptionItem = memo(AddressOptionItemComponent)
AddressOptionItem.displayName = 'AddressOptionItem'

export default AddressOptionItem
