export function getDefaultLocale() {
  return Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
}
