import { Control, Controller, FieldValues, FieldPath, PathValue } from 'react-hook-form'
import type { ReactElement } from 'react'

export interface SelectItem {
  id: string
  label: string
  iconUrl?: string
  subLabel?: string
}

import {
  BOOLEAN_FIELD_TYPE,
  CONTRACT_METHOD_FIELD_TYPE,
  CUSTOM_TRANSACTION_DATA_FIELD_TYPE,
  isAddressFieldType,
  isBooleanFieldType,
} from './fields'
import AddressAutocompleteWrapper from './AddressAutocompleteWrapper'
import SelectContractField from './SelectContractField'
import TextareaContractField from './TextareaContractField'
import TextContractField from './TextContractField'
import validateField, { ValidationFunction } from '../validations/validateField'

const CUSTOM_DEFAULT_VALUES: CustomDefaultValueTypes = {
  [BOOLEAN_FIELD_TYPE]: 'true',
  [CONTRACT_METHOD_FIELD_TYPE]: '0', // first contract method as default
}

const BOOLEAN_DEFAULT_OPTIONS: SelectItem[] = [
  { id: 'true', label: 'True' },
  { id: 'false', label: 'False' },
]

const DEFAULT_OPTIONS: DefaultOptionTypes = {
  [BOOLEAN_FIELD_TYPE]: BOOLEAN_DEFAULT_OPTIONS,
}

interface CustomDefaultValueTypes {
  [key: string]: string
}

interface DefaultOptionTypes {
  [key: string]: SelectItem[]
}

type FieldProps<T extends FieldValues = FieldValues> = {
  fieldType: string
  control: Control<T>
  id: string
  name: FieldPath<T> | string
  label: string
  fullWidth?: boolean
  required?: boolean
  validations?: ValidationFunction[]
  getAddressFromDomain?: (name: string) => Promise<string>
  networkPrefix?: string
  showErrorsInTheLabel?: boolean
  shouldUnregister?: boolean
  options?: SelectItem[]
}

import type { ChangeEvent } from 'react'

/**
 * React-hook-form's field.onChange is polymorphic - it can accept either:
 * - A ChangeEvent (for native inputs)
 * - A value directly (for custom components)
 *
 * We use this type to properly type field components that may receive either format.
 */
type FieldOnChange = {
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void
  (value: string): void
}

/** Props for field rendering - uses polymorphic onChange for type safety */
interface FieldRenderProps {
  name: string
  value: string
  onChange: FieldOnChange
  onBlur?: () => void
  label: string
  error?: string
  id: string
  required?: boolean
  fullWidth?: boolean
  options?: SelectItem[]
  getAddressFromDomain?: (name: string) => Promise<string>
  networkPrefix?: string
  showErrorsInTheLabel?: boolean
}

/**
 * Renders the appropriate field component based on fieldType.
 * Uses explicit conditional rendering instead of unsafe type casts.
 */
const renderFieldComponent = (fieldType: string, props: FieldRenderProps): ReactElement => {
  const { options, getAddressFromDomain, networkPrefix, showErrorsInTheLabel, required, fullWidth, ...baseProps } =
    props

  if (isAddressFieldType(fieldType)) {
    return (
      <AddressAutocompleteWrapper
        {...baseProps}
        getAddressFromDomain={getAddressFromDomain}
        networkPrefix={networkPrefix}
        showErrorsInTheLabel={showErrorsInTheLabel}
      />
    )
  }

  if (isBooleanFieldType(fieldType) || fieldType === CONTRACT_METHOD_FIELD_TYPE) {
    return <SelectContractField {...baseProps} options={options || []} required={required} />
  }

  if (fieldType === CUSTOM_TRANSACTION_DATA_FIELD_TYPE) {
    return (
      <TextareaContractField
        {...baseProps}
        required={required}
        fullWidth={fullWidth}
        showErrorsInTheLabel={showErrorsInTheLabel}
      />
    )
  }

  return (
    <TextContractField
      {...baseProps}
      required={required}
      fullWidth={fullWidth}
      showErrorsInTheLabel={showErrorsInTheLabel}
    />
  )
}

const Field = <T extends FieldValues = FieldValues>({
  fieldType,
  control,
  name,
  shouldUnregister = true,
  options,
  required = true,
  validations,
  ...props
}: FieldProps<T>) => {
  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      defaultValue={(CUSTOM_DEFAULT_VALUES[fieldType] || '') as PathValue<T, FieldPath<T>>}
      shouldUnregister={shouldUnregister}
      rules={{
        required: {
          value: required,
          message: 'Required',
        },
        validate: validateField(fieldType, validations),
      }}
      render={({ field, fieldState }) =>
        renderFieldComponent(fieldType, {
          name: field.name,
          onChange: field.onChange,
          onBlur: field.onBlur,
          value: field.value,
          options: options || DEFAULT_OPTIONS[fieldType],
          error: fieldState.error?.message,
          required,
          ...props,
        })
      }
    />
  )
}

export default Field
