import { ReactElement, useMemo, SyntheticEvent, useCallback, useState, useEffect, useRef } from 'react'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import SvgIcon from '@mui/material/SvgIcon'
import { styled } from '@mui/material/styles'
import { getAddress, isAddress, isHexString } from 'ethers'

import type { AddressAutocompleteProps, AddressBookEntry } from './types'
import AddressOptionItem from '../AddressOptionItem'

// Save/bookmark icon for address book
const SaveAddressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
  </svg>
)

const MAX_RESULTS = 10

// Custom Paper component that properly inherits theme
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(0.5),
  '& .MuiAutocomplete-listbox': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  '& .MuiAutocomplete-option': {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&[aria-selected="true"]': {
      backgroundColor: theme.palette.action.selected,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))

// Address utility functions
const isValidAddress = (address?: string): boolean => {
  if (address) {
    return isHexString(address, 20) && isAddress(address)
  }
  return false
}

const isChecksumAddress = (address?: string): boolean => {
  if (address) {
    try {
      return getAddress(address) === address
    } catch {
      return false
    }
  }
  return false
}

const checksumAddress = (address: string): string => getAddress(address)

// Based on https://docs.ens.domains/dapp-developer-guide/resolving-names
const validENSRegex = /[^[\]]+\.[^[\]]/
const isValidEnsName = (name: string): boolean => validENSRegex.test(name)

const getAddressWithoutNetworkPrefix = (address = ''): string => {
  const hasPrefix = address.includes(':')
  if (!hasPrefix) {
    return address
  }
  const [, ...addressWithoutNetworkPrefix] = address.split(':')
  return addressWithoutNetworkPrefix.join('')
}

const getNetworkPrefix = (address = ''): string => {
  const splitAddress = address.split(':')
  const hasPrefixDefined = splitAddress.length > 1
  const [prefix] = splitAddress
  return hasPrefixDefined ? prefix : ''
}

const addNetworkPrefix = (address: string, prefix: string | undefined): string => {
  return prefix ? `${prefix}:${address}` : address
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
  addressBook,
  resolveAddress,
  isResolvingAddress = false,
  networkPrefix,
  error,
  validate,
  disabled = false,
  placeholder,
  endAdornment,
  fullWidth = true,
  showErrorsInTheLabel = false,
  renderOption: customRenderOption,
  onBlur,
  onAddressBookClick,
  InputLabelProps,
  InputProps,
}: AddressAutocompleteProps): ReactElement => {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const [isResolvingEns, setIsResolvingEns] = useState(false)
  const [validationError, setValidationError] = useState<string | undefined>(undefined)
  const [isValidating, setIsValidating] = useState(false)

  // Abort controller ref to cancel in-flight ENS resolution requests
  const abortControllerRef = useRef<AbortController | null>(null)

  // Custom filter that accounts for network prefix
  const filterOptions = useMemo(() => {
    return createFilterOptions<AddressBookEntry>({
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

  // Run validation when value changes
  useEffect(() => {
    if (!validate || !value) {
      setValidationError(undefined)
      return
    }

    const runValidation = async () => {
      setIsValidating(true)
      try {
        const result = await validate(value)
        setValidationError(result)
      } catch {
        setValidationError(undefined)
      } finally {
        setIsValidating(false)
      }
    }

    runValidation()
  }, [value, validate])

  // Compute the label to display when a contact is selected
  const displayLabel = useMemo(() => {
    if (selectedContact) {
      return `${label} (${selectedContact.name})`
    }
    return label
  }, [label, selectedContact])

  // Handle ENS resolution with abort controller to prevent race conditions
  const resolveEnsName = useCallback(
    async (ensName: string) => {
      if (!resolveAddress || !isValidEnsName(ensName)) return

      // Cancel any previous in-flight ENS request
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsResolvingEns(true)
      try {
        const resolvedAddress = await resolveAddress(ensName)

        // Check if this request was aborted (newer request started)
        if (controller.signal.aborted) return

        if (resolvedAddress && resolvedAddress !== ensName) {
          const checksummed = checksumValidAddress(resolvedAddress)
          onChange(checksummed)
          setInputValue(formatAddressWithPrefix(checksummed, networkPrefix))
        }
      } catch (e) {
        // Ignore abort errors, keep original value for other errors
        if (e instanceof Error && e.name === 'AbortError') return
      } finally {
        // Only update loading state if this request wasn't aborted
        if (!controller.signal.aborted) {
          setIsResolvingEns(false)
        }
      }
    },
    [resolveAddress, onChange, networkPrefix],
  )

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

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
    (_event: SyntheticEvent, newValue: AddressBookEntry | string | null) => {
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
  const getOptionLabel = useCallback((option: AddressBookEntry | string) => {
    if (typeof option === 'string') return option
    return option.address
  }, [])

  // Memoized isOptionEqualToValue to prevent recreation on each render
  const isOptionEqualToValue = useCallback((option: AddressBookEntry, val: AddressBookEntry | string | null) => {
    if (!val || typeof val === 'string') return false
    return option.address.toLowerCase() === val.address.toLowerCase()
  }, [])

  // Combine external error with internal validation error
  const displayError = error || validationError
  const hasError = !!displayError
  const isLoading = isResolvingEns || isResolvingAddress || isValidating

  return (
    <Autocomplete
      id={`${id}-autocomplete`}
      freeSolo
      disablePortal
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={addressBook}
      value={selectedContact}
      inputValue={inputValue}
      onChange={handleChange}
      onInputChange={handleInputChange}
      filterOptions={filterOptions}
      slots={{ paper: StyledPaper }}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      disabled={disabled}
      renderOption={(props, option) => {
        const { key: _key, ...rest } = props
        return (
          <Box component="li" key={option.address} {...rest}>
            {customRenderOption ? (
              customRenderOption(option)
            ) : (
              <AddressOptionItem address={option.address} name={option.name} networkPrefix={networkPrefix} />
            )}
          </Box>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          id={id}
          name={name}
          label={showErrorsInTheLabel && hasError ? displayError : displayLabel}
          helperText={!showErrorsInTheLabel && hasError ? displayError : undefined}
          error={hasError}
          placeholder={placeholder}
          fullWidth={fullWidth}
          onBlur={onBlur}
          autoComplete="off"
          InputLabelProps={{
            ...params.InputLabelProps,
            ...InputLabelProps,
          }}
          InputProps={{
            ...params.InputProps,
            ...InputProps,
            endAdornment: (
              <>
                {isLoading && (
                  <InputAdornment position="end">
                    <CircularProgress size={16} aria-label="Loading" />
                  </InputAdornment>
                )}
                {onAddressBookClick && !disabled && isValidAddress(value) && (
                  <InputAdornment position="end">
                    <IconButton onClick={onAddressBookClick} size="small" aria-label="Save to address book">
                      <SvgIcon component={SaveAddressIcon} inheritViewBox fontSize="small" color="primary" />
                    </IconButton>
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
