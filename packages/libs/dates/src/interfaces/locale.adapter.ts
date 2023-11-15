import { ILocaleManager } from './locale-manager.interface';
import { ICalendarPreferences } from './calendar.interface';

let localeManager: ILocaleManager;

export function setLocaleManager(loader: ILocaleManager) {
  localeManager = loader;
}

/**
 * Asynchronously loads a locale module based on the provided locale string.
 * @param locale The locale string in the format 'language' or 'language-country'.
 */
export async function loadDateTimeLocale(locale: string): Promise<void> {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.loadLocale(locale);
}

/**
 * Sets the given locale as global locale.
 * Note, the given locale needs to be loaded.
 * @param locale The locale string in the format 'language' or 'language-country'.
 */
export function setGlobalDateTimeLocale(locale: string): void {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.setGlobalLocale(locale);
}

/**
 * Checks if a specific locale is already loaded.
 * @param locale The locale string in the format 'language' or 'language-country'.
 */
export function isDateTimeLocaleLoaded(locale: string): boolean {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.isLoaded(locale);
}

/**
 * Returns an already loaded locale or undefined in case it was not loaded or does not exist.
 * Note, the format will depend on adapter.
 * @param locale The locale string in the format 'language' or 'language-country'.
 */
export function getDateTimeLocale<TLocale = any>(locale: string): TLocale | undefined {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.getLocale(locale);
}

/**
 * Sets the enabled locales.
 * @param locales Array of locale strings in the format 'language' or 'language-country'.
 */
export function setEnabledLocales(locales: string[]): void {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.setEnabledLocales(locales);
}

/**
 * Returns the enabled locales.
 * If not restricted, this function will return all supported locales of the adapter.
 */
export function getEnabledLocales(): string[] {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.getEnabledLocales();
}

/**
 * Returns the default calendar-preferences for a given locale.
 * Note, the locale should already be loaded for this to work properly.
 * @param locale The targeted locale.
 */
export function getDefaultCalendarPreferences(locale: string): ICalendarPreferences {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.getDefaultPreferences(locale);
}

/**
 * Resets enabled locale state.
 */
export function resetLocales(): void {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  localeManager.reset();
}
