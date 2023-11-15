/**
 * Gets all timezone identifier names.
 */
export function getTimezones(): string[] {
  return Intl.supportedValuesOf('timeZone');
}

export function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
