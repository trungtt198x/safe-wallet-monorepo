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
import { isAddress } from 'ethers'

// Import address utilities from @safe-global/utils
import {
  checksumAddress,
  isChecksummedAddress,
  parsePrefixedAddress,
  formatPrefixedAddress,
} from '@safe-global/utils/utils/addresses'
import useDebounce from '@safe-global/utils/hooks/useDebounce'

import type { AddressAutocompleteProps, AddressBookEntry } from './types'
import AddressOptionItem from '../AddressOptionItem'

// Save/add contact icon paths (person with plus sign)
const saveAddressIconPaths = (
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.49801 3C10.417 3 11.164 3.747 11.164 4.666C11.164 5.585 10.417 6.332 9.49801 6.332C8.58001 6.332 7.83301 5.585 7.83301 4.666C7.83301 3.747 8.58001 3 9.49801 3ZM16.458 13.715C15.787 11.413 14.604 8.512 11.877 7.432C12.658 6.759 13.164 5.775 13.164 4.666C13.164 2.645 11.519 1 9.49801 1C7.47701 1 5.83301 2.645 5.83301 4.666C5.83301 5.78 6.34301 6.768 7.13001 7.44C7.00201 7.492 6.87201 7.538 6.74801 7.599C6.25101 7.841 6.04501 8.439 6.28601 8.936C6.52901 9.432 7.12801 9.641 7.62301 9.397C8.17601 9.128 8.79001 8.997 9.50001 8.997C11.953 8.997 13.46 10.575 14.538 14.275C14.665 14.712 15.064 14.995 15.498 14.995C15.59 14.995 15.685 14.982 15.778 14.955C16.309 14.801 16.612 14.245 16.458 13.715Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.498 10.9902H6.497C7.05 10.9902 7.497 11.4382 7.497 11.9902C7.497 12.5432 7.05 12.9902 6.497 12.9902H5.498V13.9892C5.498 14.5422 5.051 14.9892 4.498 14.9892C3.946 14.9892 3.498 14.5422 3.498 13.9892V12.9902H2.5C1.947 12.9902 1.5 12.5432 1.5 11.9902C1.5 11.4382 1.947 10.9902 2.5 10.9902H3.498V9.99219C3.498 9.43919 3.946 8.99219 4.498 8.99219C5.051 8.99219 5.498 9.43919 5.498 9.99219V10.9902Z"
    />
  </>
)

const MAX_RESULTS = 10
const MAX_INPUT_LENGTH = 512 // ENS names can be long but not unlimited
const ENS_DEBOUNCE_MS = 350
const VALIDATION_DEBOUNCE_MS = 300

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

/**
 * Check if address is valid (wrapper that handles undefined/empty)
 */
const isValidAddress = (address?: string): boolean => {
  return !!address && isAddress(address)
}

// Based on https://docs.ens.domains/dapp-developer-guide/resolving-names
const validENSRegex = /[^[\]]+\.[^[\]]/
const isValidEnsName = (name: string): boolean => validENSRegex.test(name)

/**
 * Checksum valid addresses, return unchanged if invalid
 */
const checksumValidAddress = (address: string): string => {
  if (isValidAddress(address) && !isChecksummedAddress(address)) {
    return checksumAddress(address)
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
  startAdornment,
  endAdornment,
  fullWidth = true,
  showErrorsInTheLabel = false,
  showNameInLabel = true,
  renderOption: customRenderOption,
  onBlur,
  onClick,
  onAddressBookClick,
  onOpenChange,
  InputLabelProps,
  InputProps,
}: AddressAutocompleteProps): ReactElement => {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const [isResolvingEns, setIsResolvingEns] = useState(false)
  const [validationError, setValidationError] = useState<string | undefined>(undefined)
  const [isValidating, setIsValidating] = useState(false)
  const [pendingEnsName, setPendingEnsName] = useState<string | null>(null)

  // Abort controller ref to cancel in-flight ENS resolution requests
  const abortControllerRef = useRef<AbortController | null>(null)

  // Debounce ENS name before resolution (350ms)
  const debouncedEnsName = useDebounce(pendingEnsName, ENS_DEBOUNCE_MS)

  // Debounce value for validation (300ms)
  const debouncedValueForValidation = useDebounce(value, VALIDATION_DEBOUNCE_MS)

  // Custom filter that accounts for network prefix
  const filterOptions = useMemo(() => {
    return createFilterOptions<AddressBookEntry>({
      stringify: (option) => {
        const prefixedAddress = networkPrefix ? formatPrefixedAddress(option.address, networkPrefix) : option.address
        return `${option.name} ${option.address} ${prefixedAddress}`
      },
      limit: MAX_RESULTS,
    })
  }, [networkPrefix])

  // Sync input value with external value changes
  useEffect(() => {
    // Don't add network prefix to input display value - keep it clean
    setInputValue(checksumValidAddress(value))
  }, [value])

  // Find if current value matches an address book entry
  const selectedContact = useMemo(() => {
    if (!value) return null
    return addressBook.find((item) => item.address.toLowerCase() === value.toLowerCase()) || null
  }, [addressBook, value])

  // Run validation when debounced value changes (with cancellation)
  useEffect(() => {
    if (!validate || !debouncedValueForValidation) {
      setValidationError(undefined)
      setIsValidating(false)
      return
    }

    let cancelled = false
    setIsValidating(true)

    const runValidation = async () => {
      try {
        const result = await validate(debouncedValueForValidation)
        if (!cancelled) {
          setValidationError(result)
        }
      } catch {
        if (!cancelled) {
          setValidationError(undefined)
        }
      } finally {
        if (!cancelled) {
          setIsValidating(false)
        }
      }
    }

    runValidation()

    return () => {
      cancelled = true
    }
  }, [debouncedValueForValidation, validate])

  // Compute the label to display when a contact is selected
  const displayLabel = useMemo(() => {
    if (showNameInLabel && selectedContact) {
      return `${label} (${selectedContact.name})`
    }
    return label
  }, [label, selectedContact, showNameInLabel])

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
          // Validate resolved address before using it (security check)
          if (!isValidAddress(resolvedAddress)) {
            console.warn('ENS resolver returned invalid address:', resolvedAddress)
            return
          }
          const checksummed = checksumValidAddress(resolvedAddress)
          onChange(checksummed)
          // Don't add network prefix to input display value
          setInputValue(checksummed)
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
    [resolveAddress, onChange],
  )

  // Resolve debounced ENS name
  useEffect(() => {
    if (debouncedEnsName && isValidEnsName(debouncedEnsName)) {
      resolveEnsName(debouncedEnsName)
    }
  }, [debouncedEnsName, resolveEnsName])

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

      // Reject overly long inputs to prevent DoS
      if (trimmed.length > MAX_INPUT_LENGTH) {
        return
      }

      // Parse prefixed address to extract prefix and address
      const { prefix: inputPrefix, address: addressWithoutPrefix } = parsePrefixedAddress(trimmed)

      // If valid network prefix is present, remove it from the stored value
      const isValidPrefix = networkPrefix === inputPrefix
      const finalValue = checksumValidAddress(isValidPrefix ? addressWithoutPrefix : trimmed)

      onChange(finalValue)

      // Set pending ENS name for debounced resolution (instead of direct call)
      if (isValidEnsName(finalValue)) {
        setPendingEnsName(finalValue)
      } else {
        setPendingEnsName(null)
      }
    },
    [networkPrefix, onChange],
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
      // Don't add network prefix to input display value
      setInputValue(newValue.address)
      setOpen(false)
    },
    [onChange, processInputValue],
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
      onOpenChange?.(true)
    }
  }, [addressBook.length, value, onOpenChange])

  const handleClose = useCallback(() => {
    setOpen(false)
    onOpenChange?.(false)
  }, [onOpenChange])

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
          onClick={onClick}
          autoComplete="off"
          InputLabelProps={{
            ...params.InputLabelProps,
            ...InputLabelProps,
          }}
          InputProps={{
            ...params.InputProps,
            ...InputProps,
            startAdornment:
              startAdornment ||
              (networkPrefix ? (
                <InputAdornment position="start" sx={{ ml: 0, mr: 0.5 }}>
                  <Box component="span" sx={{ color: 'text.secondary' }}>
                    {networkPrefix}:
                  </Box>
                </InputAdornment>
              ) : undefined),
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
                      <SvgIcon viewBox="0 0 17 16" fontSize="small" color="primary">
                        {saveAddressIconPaths}
                      </SvgIcon>
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
