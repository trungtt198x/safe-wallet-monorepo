/**
 * Maximum display length for address book names.
 * Long names will be truncated to prevent UI issues.
 */
const MAX_NAME_LENGTH = 50

/**
 * Sanitizes a name for display.
 * Truncates to MAX_NAME_LENGTH to prevent UI overflow issues.
 *
 * @param name - The name to sanitize (may be null/undefined)
 * @returns Sanitized name string, or empty string if input is falsy
 */
export const sanitizeName = (name: string | null | undefined): string => {
  if (!name) return ''
  if (name.length <= MAX_NAME_LENGTH) return name
  return `${name.slice(0, MAX_NAME_LENGTH - 1)}…`
}
