import type { ReactNode } from 'react'
import type { TextFieldProps } from '@mui/material/TextField'

export interface AddressBookEntry {
  address: string
  name: string
  chainId?: string
}

export type ValidateCallback = (address: string) => string | undefined | Promise<string | undefined>

export interface AddressAutocompleteProps {
  // Core
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  label: string

  // Address book (injected by consuming app)
  addressBook: AddressBookEntry[]

  // ENS resolution (optional)
  resolveAddress?: (nameOrDomain: string) => Promise<string | null>
  isResolvingAddress?: boolean

  // Network prefix
  networkPrefix?: string

  // Validation
  error?: string
  validate?: ValidateCallback

  // UI
  disabled?: boolean
  placeholder?: string
  endAdornment?: ReactNode
  fullWidth?: boolean
  showErrorsInTheLabel?: boolean

  // Render customization (optional - defaults to AddressOptionItem)
  renderOption?: (entry: AddressBookEntry) => ReactNode

  // Events
  onBlur?: () => void
  onAddressBookClick?: () => void

  // Additional TextField props
  InputLabelProps?: TextFieldProps['InputLabelProps']
  InputProps?: TextFieldProps['InputProps']
}
