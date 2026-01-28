import type { ComponentType, ReactNode } from 'react'

type GuardedProps = {
  /**
   * Optional wrapper function to wrap the component content.
   * Only renders when the guard returns true.
   * Useful for adding layout containers (Grid areas, Box wrappers) without
   * having to handle conditional rendering at the consumer level.
   *
   * @example
   * <MyFeatureComponent
   *   wrapper={(children) => (
   *     <Box gridArea="feature" className={css.feature}>
   *       {children}
   *     </Box>
   *   )}
   * />
   */
  wrapper?: (children: ReactNode) => ReactNode

  /**
   * Optional fallback to render during loading state (when guard returns undefined).
   * If provided, this is wrapped with the wrapper prop (if also provided).
   * If not provided, nothing is rendered during loading.
   *
   * @example
   * <MyFeatureComponent
   *   wrapper={(children) => <Box mb={3}>{children}</Box>}
   *   loadingFallback={<Skeleton variant="rounded" height={30} />}
   * />
   */
  loadingFallback?: ReactNode
}

/**
 * Wraps a lazy-loaded component with feature guard logic.
 *
 * This utility combines two concerns:
 * 1. **Feature gating**: Component only renders when the guard hook returns true
 * 2. **Layout composition**: Optional wrapper prop for layout containers
 *
 * IMPORTANT: Per Next.js docs, `dynamic()` must be at module level, not inside functions.
 * Create the lazy component at the top of your barrel file, then wrap it with this utility.
 *
 * @param LazyComponent - A component created with `dynamic()` from 'next/dynamic'
 * @param useGuard - Hook that returns whether the feature should render
 *                   - `true`: Render the component
 *                   - `false`: Render nothing
 *                   - `undefined`: Loading state, render nothing
 *
 * @example
 * // In feature barrel file (index.tsx)
 * import dynamic from 'next/dynamic'
 * import { withFeatureGuard } from '@/utils/withFeatureGuard'
 * import { useIsMyFeatureEnabled } from './hooks/useIsMyFeatureEnabled'
 *
 * // Dynamic import at module level (required by Next.js)
 * const LazyWidget = dynamic(() => import('./components/MyFeatureWidget'), { ssr: false })
 *
 * // Wrap with feature guard
 * export const MyFeatureWidget = withFeatureGuard(LazyWidget, useIsMyFeatureEnabled)
 *
 * // Consumer usage - no need to check feature flags
 * <MyFeatureWidget
 *   someProp="value"
 *   wrapper={(children) => <Box className={css.container}>{children}</Box>}
 * />
 */
export function withFeatureGuard<P extends object>(
  LazyComponent: ComponentType<P>,
  useGuard: () => boolean | undefined,
): ComponentType<P & GuardedProps> {
  function GuardedComponent(props: P & GuardedProps) {
    const { wrapper, loadingFallback, ...componentProps } = props
    const shouldRender = useGuard()

    // Loading state (undefined) - show loading fallback if provided
    if (shouldRender === undefined) {
      if (loadingFallback) {
        return wrapper ? <>{wrapper(loadingFallback)}</> : <>{loadingFallback}</>
      }
      return null
    }

    // Feature disabled - render nothing
    if (!shouldRender) {
      return null
    }

    // Feature enabled - render component with optional wrapper
    const content = <LazyComponent {...(componentProps as P)} />

    return wrapper ? <>{wrapper(content)}</> : content
  }

  // Set display name for React DevTools
  const componentName = LazyComponent.displayName || LazyComponent.name || 'Unknown'
  GuardedComponent.displayName = `Guarded(${componentName})`

  return GuardedComponent
}
