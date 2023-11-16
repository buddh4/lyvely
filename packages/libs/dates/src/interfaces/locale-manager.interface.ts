import { ICalendarPreferences } from './calendar.interface';

/**
 * This interface is used by an adapter to manage and load locales. Note that the locale format used by the adapter may differ
 * from the application format. In this case the adapter is required to translate the locale formats.
 * The application assumes a `language` or `language-country` locale format.
 */
export interface ILocaleManager<TLocale = any> {
  /**
   * Asynchronously loads a locale module based on the provided locale string.
   * @param locale The locale string in the format 'language' or 'language-country'.
   */
  loadLocale(locale: string): Promise<void>;

  /**
   * Returns an already loaded locale or undefined in case it was not loaded or does not exist.
   * @param locale The locale string in the format 'language' or 'language-country'.
   */
  getLocale(locale: string): TLocale | undefined;

  /**
   * Sets the given locale as global locale.
   * Note, the given locale needs to be loaded.
   * @param locale The locale string in the format 'language' or 'language-country'.
   */
  setGlobalLocale(locale: string): void;

  /**
   * Checks if a specific locale is already loaded.
   * @param locale The locale string in the format 'language' or 'language-country'.
   */
  isLoaded(locale: string): boolean;

  /**
   * Sets the enabled locales.
   * @param locales Array of locale strings in the format 'language' or 'language-country'.
   */
  setEnabledLocales(locales: string[]): void;

  /**
   * Returns the enabled locales.
   * If not restricted, this function will return all supported locales of the adapter.
   */
  getEnabledLocales(): string[];

  /**
   * Resets enabled locales state, mainly used for testing.
   */
  reset(): void;

  /**
   * Returns the default calendar-preferences for a given locale.
   * Note, the locale should already be loaded for this to work properly.
   * @param locale The targeted locale.
   */
  getDefaultPreferences(locale: string): Required<ICalendarPreferences>;
}
