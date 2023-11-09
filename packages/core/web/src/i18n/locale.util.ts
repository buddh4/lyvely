import { ILocaleDefinition } from '@lyvely/core-interface';

/**
 * Returns the default locale while respecting enabled locales and a fallback locale.
 * This function returns the navigator locale if this is a enabled locale, otherwise the configured fallback or
 * 'en-US' in case no fallback was configured.
 * The locale returned by this function is save to be used for translations and other locale related operation.
 * The enabledLocales and fallback is usually contained within a configuration.
 * @param enabledLocales An array of ILocaleDefinitions usually configured in the backend.
 * @param fallback An optional fallback locale used in case the navigator locale is not enabled.
 */
export function getDefaultLocale(enabledLocales?: ILocaleDefinition[], fallback?: string): string {
  let result;

  const locale = getNavigatorLocale();

  if (locale && enabledLocales) {
    result = navigator.languages.find((locale) => enabledLocales.find((l) => l.locale === locale));
  }

  return result || fallback || 'en-US';
}

/**
 * Returns the locale configured in the navigator.
 * Note, this locale may not be enabled by the platform.
 */
export function getNavigatorLocale(): string {
  return navigator.languages ? navigator.languages[0] : navigator.language;
}
