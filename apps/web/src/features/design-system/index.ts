/**
 * Design System Feature
 *
 * This feature provides shadcn/ui components styled with Figma tokens.
 * Components are organized in two patterns:
 * - Direct: Use shadcn components directly from @/components/ui/*
 * - Wrapped: Use wrapper components with Safe-specific defaults
 */

// Re-export shadcn atoms for direct usage
export { Button, buttonVariants, type ButtonProps } from '@/components/ui/button'
export { Input } from '@/components/ui/input'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
export { Badge, badgeVariants } from '@/components/ui/badge'

// Re-export direct molecules
export { FormField, ActionCard } from './components/molecules/direct'

// Export wrapped components with namespace for clarity
export * as Wrapped from './components/atoms/wrapped'
export * as WrappedMolecules from './components/molecules/wrapped'
