import { type ReactElement, useMemo, useCallback, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { AddressAutocomplete, type AddressBookEntry } from '@safe-global/ui'
import { useCurrentChain } from '@/hooks/useChains'
import { useWeb3ReadOnly } from '@/hooks/wallets/web3'
import { useMergedAddressBooks } from '@/hooks/useAllAddressBooks'
import { resolveName, isDomain } from '@/services/ens'
import { validatePrefixedAddress } from '@safe-global/utils/utils/validation'
import { parsePrefixedAddress } from '@safe-global/utils/utils/addresses'
import { FEATURES, hasFeature } from '@safe-global/utils/utils/chains'
import type { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import EntryDialog from '@/components/address-book/EntryDialog'
import inputCss from '@/styles/inputs.module.css'

export interface AddressAutocompleteInputProps {
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
  chain?: Chain
  deps?: string | string[]
  validate?: (address: string) => string | undefined | Promise<string | undefined>
  canAdd?: boolean
}

const AddressAutocompleteInput = ({
  name,
  label,
  required = true,
  disabled = false,
  chain,
  deps,
  validate,
  canAdd = false,
}: AddressAutocompleteInputProps): ReactElement => {
  const [openAddressBook, setOpenAddressBook] = useState(false)

  const { control, trigger } = useFormContext()
  const addressValue = useWatch({ name, control }) as string | undefined

  const currentChain = useCurrentChain()
  const ethersProvider = useWeb3ReadOnly()
  const mergedAddressBook = useMergedAddressBooks()

  const actualChain = chain || currentChain
  const networkPrefix = actualChain?.shortName || ''
  const isDomainLookupEnabled = !!actualChain && hasFeature(actualChain, FEATURES.DOMAIN_LOOKUP)

  // Convert merged address book to format expected by AddressAutocomplete
  const addressBook: AddressBookEntry[] = useMemo(() => {
    return mergedAddressBook.list.map((entry) => ({
      address: entry.address,
      name: entry.name,
      chainId: entry.chainIds[0],
    }))
  }, [mergedAddressBook])

  // Check if current address is in address book
  const isInAddressBook = useMemo(() => {
    const normalizedValue = addressValue?.toLowerCase()
    return addressBook.some((entry) => entry.address.toLowerCase() === normalizedValue)
  }, [addressBook, addressValue])

  // ENS resolution function for AddressAutocomplete
  const resolveAddress = useCallback(
    async (nameOrDomain: string): Promise<string | null> => {
      if (!ethersProvider || !isDomainLookupEnabled || !isDomain(nameOrDomain)) {
        return null
      }
      try {
        const resolved = await resolveName(ethersProvider, nameOrDomain)
        return resolved || null
      } catch {
        return null
      }
    },
    [ethersProvider, isDomainLookupEnabled],
  )

  // Validation function for prefix validation
  const validatePrefixed = useMemo(() => validatePrefixedAddress(networkPrefix), [networkPrefix])

  // Combined validation: prefix validation + custom validation
  const combinedValidate = useCallback(
    async (value: string): Promise<string | undefined> => {
      if (!value) return required ? 'Required' : undefined

      // Validate prefixed address
      const prefixValidation = validatePrefixed(value)
      if (prefixValidation) return prefixValidation

      // Run custom validation on the address without prefix
      if (validate) {
        const { address } = parsePrefixedAddress(value)
        return validate(address)
      }

      return undefined
    },
    [validatePrefixed, required, validate],
  )

  const handleAddressBookClick = useCallback(() => {
    setOpenAddressBook(true)
  }, [])

  const defaultLabel = isDomainLookupEnabled ? 'Recipient address or ENS' : 'Recipient address'

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? 'Required' : false,
          deps,
          validate: combinedValidate,
        }}
        render={({ field, fieldState }) => (
          <AddressAutocomplete
            id={`${name}-autocomplete`}
            name={field.name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={() => {
              field.onBlur()
              // Workaround for react-hook-form caching errors
              setTimeout(() => trigger(name), 100)
            }}
            label={label || defaultLabel}
            addressBook={addressBook}
            resolveAddress={resolveAddress}
            networkPrefix={networkPrefix}
            disabled={disabled}
            error={fieldState.error?.message}
            onAddressBookClick={canAdd && !isInAddressBook ? handleAddressBookClick : undefined}
            showErrorsInTheLabel
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              className: inputCss.input,
            }}
          />
        )}
      />

      {openAddressBook && (
        <EntryDialog
          handleClose={() => setOpenAddressBook(false)}
          defaultValues={{ name: '', address: addressValue || '' }}
        />
      )}
    </>
  )
}

export default AddressAutocompleteInput
