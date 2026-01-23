/**
 * Returns the current TOTP value (hour-based).
 * The delegate API uses totp = floor(now / 3600) as a time-based nonce.
 */
export const getCurrentTotp = (): number => {
  return Math.floor(Date.now() / 1000 / 3600)
}

/**
 * Checks if a TOTP value from a delegation message is still valid.
 * The backend accepts current TOTP ± 1 previous interval (~2 hour window).
 */
export const isTotpValid = (messageTotp: number): boolean => {
  const currentTotp = getCurrentTotp()
  return currentTotp - messageTotp <= 1
}
