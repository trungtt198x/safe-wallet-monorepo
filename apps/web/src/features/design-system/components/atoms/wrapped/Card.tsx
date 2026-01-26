import { forwardRef } from 'react'
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter,
  CardTitle as ShadcnCardTitle,
  CardDescription as ShadcnCardDescription,
} from '@/components/ui/card'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends ComponentProps<typeof ShadcnCard> {
  /** Adds hover effect */
  interactive?: boolean
}

/**
 * Safe-styled Card component.
 * Wraps shadcn Card with Safe-specific defaults.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive, className, ...props }, ref) => {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          interactive && 'cursor-pointer hover:shadow-md transition-shadow',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = ShadcnCardHeader
export const CardContent = ShadcnCardContent
export const CardFooter = ShadcnCardFooter
export const CardTitle = ShadcnCardTitle
export const CardDescription = ShadcnCardDescription
