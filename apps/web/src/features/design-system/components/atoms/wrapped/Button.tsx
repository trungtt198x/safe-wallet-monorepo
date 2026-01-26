import { forwardRef } from 'react'
import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from '@/components/ui/button'

export interface ButtonProps extends Omit<ShadcnButtonProps, 'asChild'> {
  /** Loading state shows a spinner and disables the button */
  loading?: boolean
}

/**
 * Safe-styled Button component.
 * Wraps shadcn Button with Safe-specific defaults and additional props.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, disabled, children, className, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        disabled={disabled || loading}
        className={className}
        {...props}
      >
        {loading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </ShadcnButton>
    )
  }
)

Button.displayName = 'Button'

export default Button
