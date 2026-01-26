import type { ComponentProps } from 'react'
import { Input } from '../../atoms/wrapped/Input'
import { cn } from '@/lib/utils'

interface FormFieldProps extends Omit<ComponentProps<typeof Input>, 'error' | 'helperText'> {
  label: string
  error?: string
  hint?: string
  required?: boolean
}

/**
 * Safe-styled FormField molecule - combines wrapped Input with label.
 * Provides Safe-specific styling and accessibility patterns.
 */
export const FormField = ({ label, error, hint, required, id, className, ...inputProps }: FormFieldProps) => {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={fieldId} className="text-sm font-medium leading-none">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Input id={fieldId} error={!!error} helperText={error ?? hint} {...inputProps} />
    </div>
  )
}

export default FormField
