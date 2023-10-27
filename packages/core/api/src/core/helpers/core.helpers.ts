export function getDefaultLocale() {
  return Intl.DateTimeFormat().resolvedOptions().locale;
  //return process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE;
}
