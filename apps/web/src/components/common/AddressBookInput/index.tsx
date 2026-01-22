import { type ReactElement, useState, useMemo, useCallback } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { SvgIcon, Typography } from '@mui/material'
import { AddressAutocomplete, type AddressBookEntry } from '@safe-global/ui'
import type { AddressInputProps } from '../AddressInput'
import InfoIcon from '@/public/images/notifications/info.svg'
import EntryDialog from '@/components/address-book/EntryDialog'
import css from './styles.module.css'
import inputCss from '@/styles/inputs.module.css'
import { sameAddress } from '@safe-global/utils/utils/addresses'
import { validateAddress } from '@safe-global/utils/utils/validation'
import { useMergedAddressBooks } from '@/hooks/useAllAddressBooks'
import { useCurrentChain } from '@/hooks/useChains'
import { useWeb3ReadOnly } from '@/hooks/wallets/web3'
import { resolveName, isDomain } from '@/services/ens'
import { FEATURES, hasFeature } from '@safe-global/utils/utils/chains'

/**
 * Address input with address book autocomplete using shared @safe-global/ui component
 */
const AddressBookInput = ({
  name,
  canAdd,
  validate,
  ...props
}: AddressInputProps & { canAdd?: boolean }): ReactElement => {
  const [openAddressBook, setOpenAddressBook] = useState<boolean>(false)
  const mergedAddressBook = useMergedAddressBooks()

  const { control, trigger } = useFormContext()
  const addressValue = useWatch({ name, control })

  const currentChain = useCurrentChain()
  const ethersProvider = useWeb3ReadOnly()

  const networkPrefix = currentChain?.shortName || ''
  const isDomainLookupEnabled = !!currentChain && hasFeature(currentChain, FEATURES.DOMAIN_LOOKUP)

  // Convert merged address book to format expected by AddressAutocomplete
  const addressBook: AddressBookEntry[] = useMemo(
    () =>
      mergedAddressBook.list.map((entry) => ({
        address: entry.address,
        name: entry.name,
        chainId: entry.chainIds[0],
      })),
    [mergedAddressBook],
  )

  const isInAddressBook = useMemo(
    () => addressBook.some((entry) => sameAddress(entry.address, addressValue)),
    [addressBook, addressValue],
  )

  // ENS resolution function
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

  const onAddressBookClick = canAdd
    ? () => {
        setOpenAddressBook(true)
      }
    : undefined

  const defaultLabel = isDomainLookupEnabled ? 'Recipient address or ENS' : 'Recipient address'

  // Extract data-testid from props for test compatibility, default to 'address-item'
  const dataTestId = (props as { 'data-testid'?: string })['data-testid'] || 'address-item'

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: {
            // Address format and checksum validation
            format: (value: string) => {
              if (!value) return true // Empty is handled by required
              const error = validateAddress(value)
              return error || true // Return error message or true for valid
            },
            // Custom validation from props
            ...(validate && { custom: validate }),
          },
        }}
        render={({ field, fieldState }) => (
          <div data-testid={dataTestId}>
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
              label={typeof props.label === 'string' ? props.label : defaultLabel}
              addressBook={addressBook}
              resolveAddress={resolveAddress}
              networkPrefix={networkPrefix}
              disabled={props.disabled}
              error={fieldState.error?.message}
              onAddressBookClick={canAdd && !isInAddressBook ? onAddressBookClick : undefined}
              showErrorsInTheLabel
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                className: inputCss.input,
              }}
            />
          </div>
        )}
      />

      {canAdd && !isInAddressBook ? (
        <Typography variant="body2" className={css.unknownAddress}>
          <SvgIcon component={InfoIcon} fontSize="small" />
          <span>
            This is an unknown address. You can{' '}
            <a role="button" onClick={onAddressBookClick}>
              add it to your address book
            </a>
            .
          </span>
        </Typography>
      ) : null}

      {openAddressBook && (
        <EntryDialog
          handleClose={() => setOpenAddressBook(false)}
          defaultValues={{ name: '', address: addressValue }}
        />
      )}
    </>
  )
}

export default AddressBookInput
