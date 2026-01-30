import { CaptchaProvider } from './CaptchaProvider'

export function Captcha({ children }: { children: React.ReactNode }) {
  return <CaptchaProvider>{children}</CaptchaProvider>
}

export { CaptchaProvider, useCaptcha } from './CaptchaProvider'
