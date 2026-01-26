import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormFieldProps extends ComponentProps<typeof Input> {
  label: string
  error?: string
  hint?: string
  required?: boolean
}

/**
 * Direct FormField molecule - combines Input with label and error handling.
 * Uses shadcn components directly with minimal abstraction.
 */
export const FormField = ({ label, error, hint, required, id, className, ...inputProps }: FormFieldProps) => {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={fieldId} className="text-sm font-medium leading-none">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Input
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(error && 'border-destructive focus-visible:ring-destructive')}
        {...inputProps}
      />
      {error && (
        <p id={`${fieldId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}

export default FormField
