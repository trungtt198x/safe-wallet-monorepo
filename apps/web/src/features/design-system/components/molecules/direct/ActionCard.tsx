import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ActionCardProps {
  title: string
  description?: string
  children?: ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
  }
  className?: string
}

/**
 * Direct ActionCard molecule - Card with action buttons in footer.
 * Uses shadcn components directly with minimal abstraction.
 */
export const ActionCard = ({
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  className,
}: ActionCardProps) => {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {(primaryAction || secondaryAction) && (
        <CardFooter className="flex justify-end gap-2">
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick} disabled={secondaryAction.disabled}>
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button onClick={primaryAction.onClick} disabled={primaryAction.disabled}>
              {primaryAction.label}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default ActionCard
