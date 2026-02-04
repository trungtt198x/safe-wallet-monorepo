import type { ReactElement } from 'react'
import { Controller, FieldPath, FieldValues, useFormContext } from 'react-hook-form'
import AddressAutocomplete from '../AddressAutocomplete/AddressAutocomplete'
import { triggerValidationDelayed } from '../../utils/triggerValidation'
import type { AddressAutocompleteFieldProps } from './types'

const AddressAutocompleteField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  deps,
  validate,
  ...autocompleteProps
}: AddressAutocompleteFieldProps<TFieldValues, TName>): ReactElement => {
  const formContext = useFormContext<TFieldValues>()
  const usedControl = control ?? formContext?.control

  // Trigger re-validation of dependent fields
  const { trigger } = formContext ?? {}

  // Combine custom validate with rules.validate if both provided
  const combinedRules = {
    ...rules,
    deps,
    validate: validate
      ? {
          ...(typeof rules?.validate === 'object' ? rules.validate : {}),
          custom: validate,
        }
      : rules?.validate,
  }

  return (
    <Controller
      name={name}
      control={usedControl}
      rules={combinedRules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => (
        <AddressAutocomplete
          {...autocompleteProps}
          name={field.name}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={() => {
            field.onBlur()
            autocompleteProps.onBlur?.()
            triggerValidationDelayed(trigger, name)
          }}
          error={fieldState.error?.message}
        />
      )}
    />
  )
}

export default AddressAutocompleteField
