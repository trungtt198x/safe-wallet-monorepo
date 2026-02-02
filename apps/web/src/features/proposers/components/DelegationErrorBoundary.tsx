import type { ReactNode } from 'react'
import { ErrorBoundary } from '@sentry/react'
import { Box, Button, Typography } from '@mui/material'

type FallbackProps = {
  error: Error
  componentStack: string | null
  eventId: string | null
  resetError: () => void
}

type DelegationErrorBoundaryProps = {
  children: ReactNode
  fallbackMessage?: string
  onRetry?: () => void
}

const DelegationFallback = ({
  error,
  resetError,
  fallbackMessage,
  onRetry,
}: FallbackProps & { fallbackMessage?: string; onRetry?: () => void }) => {
  const handleRetry = () => {
    onRetry?.()
    resetError()
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'var(--color-error-background)',
        borderRadius: 1,
        border: '1px solid var(--color-error-main)',
      }}
    >
      <Typography variant="body2" color="error.main" gutterBottom>
        {fallbackMessage || 'Something went wrong loading this content.'}
      </Typography>
      {process.env.NODE_ENV !== 'production' && (
        <Typography variant="caption" color="text.secondary" component="pre" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
          {error.message}
        </Typography>
      )}
      <Button size="small" variant="outlined" color="error" onClick={handleRetry}>
        Try again
      </Button>
    </Box>
  )
}

const DelegationErrorBoundary = ({ children, fallbackMessage, onRetry }: DelegationErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={(props) => <DelegationFallback {...props} fallbackMessage={fallbackMessage} onRetry={onRetry} />}
    >
      {children}
    </ErrorBoundary>
  )
}

export default DelegationErrorBoundary
