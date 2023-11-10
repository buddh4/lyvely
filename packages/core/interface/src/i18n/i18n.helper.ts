import { LOCALE_NAMES } from './i18n.constants';
import { ILocaleDefinition } from './interfaces';

/**
 * Returns a locale definition for the given locale string.
 * Note, if the locale is not known the name part of the definition will be an empty string.
 * @param locale The locale string in the format 'language-COUNTRY'.
 */
export function getLocaleDefinition(locale: string): ILocaleDefinition {
  return { locale, name: getLocaleName(locale) };
}

/**
 * Returns an array of locale definition for the given locale strings.
 * Note, if a locale is not known the name part of the definition will be an empty string.
 * @param locales Array of locale strings in the format 'language-COUNTRY'.
 */
export function getLocaleDefinitions(locales: string[]): ILocaleDefinition[] {
  return locales.map((locale) => getLocaleDefinition(locale));
}

/**
 * Returns the name of the given locale.
 * Note, if the locale is not known this function will return an empty string.
 * @param locale The locale string in the format 'language-COUNTRY'.
 */
export function getLocaleName(locale: string): string {
  return Object.hasOwn(LOCALE_NAMES, locale)
    ? (LOCALE_NAMES[locale as keyof typeof LOCALE_NAMES] as string)
    : '';
}
