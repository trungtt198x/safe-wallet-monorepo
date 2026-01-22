import type { FieldPath, FieldValues, UseControllerProps, Path } from 'react-hook-form'
import type { AddressAutocompleteProps, ValidateCallback } from '../AddressAutocomplete'

export interface AddressAutocompleteFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<AddressAutocompleteProps, 'name' | 'value' | 'onChange' | 'error' | 'validate'>,
    Pick<UseControllerProps<TFieldValues, TName>, 'name' | 'control' | 'rules' | 'defaultValue' | 'shouldUnregister'> {
  // Field dependencies for re-validation when other fields change
  deps?: Path<TFieldValues> | Path<TFieldValues>[]
  // Custom validation (combined with rules.validate if both provided)
  validate?: ValidateCallback
}
