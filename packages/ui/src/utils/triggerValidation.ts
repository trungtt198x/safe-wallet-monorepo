/**
 * Workaround for react-hook-form caching errors.
 *
 * When onBlur is called, react-hook-form may not have finished updating
 * the field value, causing validation to run against a stale value.
 * This utility triggers validation after a short delay to ensure
 * the form state has been updated.
 *
 * @param trigger - The trigger function from react-hook-form's useFormContext
 * @param name - The field name to trigger validation for
 * @param delay - Delay in ms before triggering (default: 100ms)
 */
export const triggerValidationDelayed = <TName = string>(
  trigger: ((name?: TName) => Promise<boolean>) | undefined,
  name: TName,
  delay = 100,
): void => {
  if (trigger) {
    setTimeout(() => trigger(name), delay)
  }
}
