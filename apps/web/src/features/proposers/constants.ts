/** TOTP interval in seconds (1 hour) */
export const TOTP_INTERVAL_SECONDS = 3600

/** Minimum polling interval for pending delegations (milliseconds) */
export const DELEGATION_POLLING_INTERVAL_MS = 5000

/** Maximum polling interval after backoff (milliseconds) */
export const MAX_POLLING_INTERVAL_MS = 60000

/** Backoff multiplier for exponential polling increase */
export const BACKOFF_MULTIPLIER = 1.5
