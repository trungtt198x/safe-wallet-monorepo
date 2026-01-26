import { Badge as ShadcnBadge, type badgeVariants } from '@/components/ui/badge'
import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

export interface BadgeProps extends Omit<ComponentProps<typeof ShadcnBadge>, 'variant'> {
  /** Badge variant with Safe-specific semantic variants */
  variant?: BadgeVariant | 'success' | 'warning'
}

const variantMap: Record<string, BadgeVariant> = {
  success: 'default',
  warning: 'secondary',
}

/**
 * Safe-styled Badge component.
 * Wraps shadcn Badge with Safe-specific semantic variants.
 */
export const Badge = ({ variant = 'default', className, ...props }: BadgeProps) => {
  const effectiveVariant = variant ?? 'default'
  const mappedVariant =
    effectiveVariant in variantMap ? variantMap[effectiveVariant] : (effectiveVariant as BadgeVariant)

  const semanticClasses =
    effectiveVariant === 'success'
      ? 'bg-[hsl(var(--state-positive))] text-white'
      : effectiveVariant === 'warning'
        ? 'bg-[hsl(var(--chart-3))] text-black'
        : ''

  return <ShadcnBadge variant={mappedVariant} className={cn(semanticClasses, className)} {...props} />
}

Badge.displayName = 'Badge'

export default Badge
