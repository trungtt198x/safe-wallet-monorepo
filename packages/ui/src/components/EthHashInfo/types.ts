import type { ReactNode } from 'react'

export interface EthHashInfoProps {
  /** Ethereum address to display */
  address: string
  /** Optional name to display (e.g., from address book) */
  name?: string | null
  /** Network prefix to display before the address (e.g., "eth", "sep") */
  prefix?: string
  /** Whether to show the network prefix. Defaults to true when prefix is provided */
  showPrefix?: boolean
  /** Whether to show a shortened version of the address. Defaults to true */
  shortAddress?: boolean
  /** Whether to show the avatar/identicon. Defaults to true */
  showAvatar?: boolean
  /** Size of the avatar in pixels. Defaults to 40 */
  avatarSize?: number
  /** Custom avatar image URL */
  customAvatar?: string | null
  /** Whether to only display the name (hide address when name exists). Defaults to false */
  onlyName?: boolean
  /** Whether to show an address book icon next to the name. Defaults to false */
  showAddressBookIcon?: boolean
  /** Additional elements to render after the address */
  children?: ReactNode
}
