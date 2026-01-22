import { ReactElement, useMemo, SyntheticEvent, useCallback, useState, useEffect } from 'react'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import type { AddressBookItem } from '@safe-global/safe-apps-sdk'
import { useAddressBook } from '../../../store/addressBookContext'
import TextFieldInput from './TextFieldInput'
import {
  isValidAddress,
  isValidEnsName,
  checksumAddress,
  isChecksumAddress,
  addNetworkPrefix,
  getAddressWithoutNetworkPrefix,
  getNetworkPrefix,
} from '../../../utils/address'

interface AddressAutocompleteProps {
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
}

const MAX_RESULTS = 10

// Hoisted slotProps to prevent recreation on each render
const PAPER_SLOT_PROPS = {
  paper: {
    sx: {
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: 3,
      mt: 0.5,
    },
  },
}

// Checksum valid addresses
const checksumValidAddress = (address: string) => {
  if (isValidAddress(address) && !isChecksumAddress(address)) {
    return checksumAddress(address)
  }
  return address
}

// Add network prefix if needed
const formatAddressWithPrefix = (address: string, networkPrefix?: string): string => {
  if (!address || !networkPrefix) return address
  const hasPrefix = !!getNetworkPrefix(address)
  if (!hasPrefix) {
    return addNetworkPrefix(address, networkPrefix)
  }
  return address
}

const AddressAutocomplete = ({
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
}: AddressAutocompleteProps): ReactElement => {
  const { addressBook } = useAddressBook()
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const [isResolvingEns, setIsResolvingEns] = useState(false)

  // Custom filter that accounts for network prefix
  const filterOptions = useMemo(() => {
    return createFilterOptions<AddressBookItem>({
      stringify: (option) => {
        const prefixedAddress = networkPrefix ? addNetworkPrefix(option.address, networkPrefix) : option.address
        return `${option.name} ${option.address} ${prefixedAddress}`
      },
      limit: MAX_RESULTS,
    })
  }, [networkPrefix])

  // Sync input value with external value changes
  useEffect(() => {
    const formatted = formatAddressWithPrefix(checksumValidAddress(value), networkPrefix)
    setInputValue(formatted)
  }, [value, networkPrefix])

  // Find if current value matches an address book entry
  const selectedContact = useMemo(() => {
    if (!value) return null
    return addressBook.find((item) => item.address.toLowerCase() === value.toLowerCase()) || null
  }, [addressBook, value])

  // Compute the label to display when a contact is selected
  const displayLabel = useMemo(() => {
    if (selectedContact) {
      return `${label} (${selectedContact.name})`
    }
    return label
  }, [label, selectedContact])

  // Handle ENS resolution
  const resolveEnsName = useCallback(
    async (ensName: string) => {
      if (!getAddressFromDomain || !isValidEnsName(ensName)) return

      setIsResolvingEns(true)
      try {
        const resolvedAddress = await getAddressFromDomain(ensName)
        if (resolvedAddress && resolvedAddress !== ensName) {
          const checksummed = checksumValidAddress(resolvedAddress)
          onChange(checksummed)
          setInputValue(formatAddressWithPrefix(checksummed, networkPrefix))
        }
      } catch {
        // ENS resolution failed, keep the original value
      } finally {
        setIsResolvingEns(false)
      }
    },
    [getAddressFromDomain, onChange, networkPrefix],
  )

  // Process input value and update form state
  const processInputValue = useCallback(
    (rawValue: string) => {
      const trimmed = rawValue.trim()
      const inputPrefix = getNetworkPrefix(trimmed)
      const addressWithoutPrefix = getAddressWithoutNetworkPrefix(trimmed)

      // If valid network prefix is present, remove it from the stored value
      const isValidPrefix = networkPrefix === inputPrefix
      const finalValue = checksumValidAddress(isValidPrefix ? addressWithoutPrefix : trimmed)

      onChange(finalValue)

      // Check for ENS name
      if (isValidEnsName(finalValue)) {
        resolveEnsName(finalValue)
      }
    },
    [networkPrefix, onChange, resolveEnsName],
  )

  // Handle option selection from dropdown
  const handleChange = useCallback(
    (_event: SyntheticEvent, newValue: AddressBookItem | string | null) => {
      if (newValue === null) {
        onChange('')
        setInputValue('')
        return
      }

      if (typeof newValue === 'string') {
        processInputValue(newValue)
        return
      }

      // Selected from address book
      onChange(newValue.address)
      setInputValue(formatAddressWithPrefix(newValue.address, networkPrefix))
      setOpen(false)
    },
    [onChange, processInputValue, networkPrefix],
  )

  // Handle typing in the input
  const handleInputChange = useCallback(
    (_event: SyntheticEvent, newInputValue: string, reason: string) => {
      setInputValue(newInputValue)

      // Only process on user input, not on reset/clear
      if (reason === 'input') {
        processInputValue(newInputValue)
      }
    },
    [processInputValue],
  )

  // Control dropdown visibility
  const handleOpen = useCallback(() => {
    // Show dropdown if we have address book entries and no valid address yet
    if (addressBook.length > 0 && !isValidAddress(value)) {
      setOpen(true)
    }
  }, [addressBook.length, value])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  // Memoized getOptionLabel to prevent recreation on each render
  const getOptionLabel = useCallback((option: AddressBookItem | string) => {
    if (typeof option === 'string') return option
    return option.address
  }, [])

  // Memoized isOptionEqualToValue to prevent recreation on each render
  const isOptionEqualToValue = useCallback((option: AddressBookItem, val: AddressBookItem | string | null) => {
    if (!val || typeof val === 'string') return false
    return option.address.toLowerCase() === val.address.toLowerCase()
  }, [])

  return (
    <Autocomplete
      id={`${id}-autocomplete`}
      freeSolo
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={addressBook}
      value={selectedContact}
      inputValue={inputValue}
      onChange={handleChange}
      onInputChange={handleInputChange}
      filterOptions={filterOptions}
      slotProps={PAPER_SLOT_PROPS}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={(props, option) => {
        const { key: _key, ...rest } = props
        return (
          <Box component="li" key={option.address} {...rest}>
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight="bold" noWrap>
                {option.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {option.address}
              </Typography>
            </Box>
          </Box>
        )
      }}
      renderInput={(params) => (
        <TextFieldInput
          {...params}
          id={id}
          name={name}
          label={displayLabel}
          error={error}
          fullWidth
          onBlur={onBlur}
          autoComplete="off"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {(isResolvingEns || showLoadingSpinner) && (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                )}
                {endAdornment}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}

export default AddressAutocomplete
