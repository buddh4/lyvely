export function getDefaultLocale() {
  return Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
}

export function getDefaultTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
