import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../atoms/wrapped/Card'
import { Button } from '../../atoms/wrapped/Button'
import { cn } from '@/lib/utils'

interface ActionCardAction {
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

interface ActionCardProps {
  title: string
  description?: string
  children?: ReactNode
  primaryAction?: ActionCardAction
  secondaryAction?: ActionCardAction
  interactive?: boolean
  className?: string
}

/**
 * Safe-styled ActionCard molecule - Card with action buttons.
 * Uses wrapped components with Safe-specific features like loading states.
 */
export const ActionCard = ({
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  interactive,
  className,
}: ActionCardProps) => {
  return (
    <Card className={cn('w-full', className)} interactive={interactive}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {(primaryAction || secondaryAction) && (
        <CardFooter className="flex justify-end gap-2">
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
              loading={secondaryAction.loading}
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              loading={primaryAction.loading}
            >
              {primaryAction.label}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default ActionCard
