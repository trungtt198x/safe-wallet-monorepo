import { ReactElement, useMemo } from 'react'
import { AddressAutocomplete } from '@safe-global/ui'
import type { AddressBookEntry } from '@safe-global/ui'
import { useAddressBook } from '../../../store/addressBookContext'

interface AddressAutocompleteWrapperProps {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  label: string
  error?: string
  getAddressFromDomain?: (name: string) => Promise<string>
  networkPrefix?: string
  onBlur?: () => void
  showLoadingSpinner?: boolean
  endAdornment?: React.ReactNode
  showErrorsInTheLabel?: boolean
}

const AddressAutocompleteWrapper = ({
  id,
  name,
  value,
  onChange,
  label,
  error,
  getAddressFromDomain,
  networkPrefix,
  onBlur,
  showLoadingSpinner,
  endAdornment,
  showErrorsInTheLabel,
}: AddressAutocompleteWrapperProps): ReactElement => {
  const { addressBook: rawAddressBook } = useAddressBook()

  // Convert Safe Apps SDK AddressBookItem to AddressBookEntry
  const addressBook: AddressBookEntry[] = useMemo(() => {
    return rawAddressBook.map((item) => ({
      address: item.address,
      name: item.name,
      chainId: item.chainId,
    }))
  }, [rawAddressBook])

  // Wrap the getAddressFromDomain to match the resolveAddress signature
  const resolveAddress = useMemo(() => {
    if (!getAddressFromDomain) return undefined
    return async (nameOrDomain: string): Promise<string | null> => {
      try {
        const address = await getAddressFromDomain(nameOrDomain)
        return address || null
      } catch {
        return null
      }
    }
  }, [getAddressFromDomain])

  return (
    <AddressAutocomplete
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      label={label}
      addressBook={addressBook}
      resolveAddress={resolveAddress}
      isResolvingAddress={showLoadingSpinner}
      networkPrefix={networkPrefix}
      error={error}
      onBlur={onBlur}
      endAdornment={endAdornment}
      showErrorsInTheLabel={showErrorsInTheLabel}
    />
  )
}

export default AddressAutocompleteWrapper
