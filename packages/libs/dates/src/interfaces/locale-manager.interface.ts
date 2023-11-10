export interface ILocaleManager<TLocale = any> {
  /**
   * Asynchronously loads a locale module based on the provided locale string.
   * @param locale The locale string in the format 'language' or 'language-COUNTRY'.
   */
  loadLocale(locale: string): Promise<void>;

  /**
   * Returns an already loaded locale or undefined in case it was not loaded or does not exist.
   * @param locale The locale string in the format 'language' or 'language-COUNTRY'.
   */
  getLocale(locale: string): TLocale | undefined;

  /**
   * Sets the given locale as global locale.
   * Note, the given locale needs to be loaded.
   * @param locale The locale string in the format 'language' or 'language-COUNTRY'.
   */
  setGlobalLocale(locale: string): void;

  /**
   * Checks if a specific locale is already loaded.
   * @param locale The locale string in the format 'language' or 'language-COUNTRY'.
   */
  isLoaded(locale: string): boolean;

  /**
   * Sets the enabled locales.
   * @param locales Array of locale strings in the format 'language' or 'language-COUNTRY'.
   */
  setEnabledLocales(locales: string[]): void;

  /**
   * Returns the enabled locales.
   * If not restricted, this function will return all supported locales of the adapter.
   */
  getEnabledLocales(): string[];
}
