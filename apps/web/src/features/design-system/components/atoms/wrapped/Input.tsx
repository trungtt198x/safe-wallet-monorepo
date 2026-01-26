import { forwardRef } from 'react'
import { Input as ShadcnInput } from '@/components/ui/input'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends ComponentProps<typeof ShadcnInput> {
  /** Error state shows red border */
  error?: boolean
  /** Helper text shown below the input */
  helperText?: string
}

/**
 * Safe-styled Input component.
 * Wraps shadcn Input with Safe-specific defaults and additional props.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <ShadcnInput
          ref={ref}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
        {helperText && (
          <p className={cn('mt-1 text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
