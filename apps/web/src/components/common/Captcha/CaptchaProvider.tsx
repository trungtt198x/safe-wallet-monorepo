import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { useCaptchaToken } from '@/hooks/useCaptchaToken'
import { useDarkMode } from '@/hooks/useDarkMode'
import CaptchaModal from './CaptchaModal'

interface CaptchaContextType {
  token: string | null
  isLoading: boolean
  isReady: boolean
  error: Error | null
  refreshToken: () => void
}

const CaptchaContext = createContext<CaptchaContextType | undefined>(undefined)

export function CaptchaProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useDarkMode()
  const captcha = useCaptchaToken({ theme: isDarkMode ? 'dark' : 'light' })

  const contextValue = useMemo(
    () => ({
      token: captcha.token,
      isLoading: captcha.isLoading,
      error: captcha.error,
      refreshToken: captcha.refreshToken,
      // Ready when we have a token or when loading is complete (no captcha configured)
      isReady: !!captcha.token || (!captcha.isLoading && !captcha.error),
    }),
    [captcha.token, captcha.isLoading, captcha.error, captcha.refreshToken],
  )

  return (
    <CaptchaContext.Provider value={contextValue}>
      {children}
      <CaptchaModal open={captcha.isModalOpen} onWidgetContainerReady={captcha.onWidgetContainerReady} />
    </CaptchaContext.Provider>
  )
}

export function useCaptcha() {
  const context = useContext(CaptchaContext)
  if (!context) {
    throw new Error('useCaptcha must be used within a CaptchaProvider')
  }
  return context
}
