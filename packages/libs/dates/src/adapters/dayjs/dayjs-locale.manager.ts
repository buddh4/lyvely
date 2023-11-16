import { ICalendarPreferences, ILocaleManager } from '../../interfaces';
import dayjs from 'dayjs';

export interface IDayJsLocale {
  name: string;
  weekdays?: string[];
  months?: string[];
  weekStart?: number;
  weekdaysShort?: string[];
  monthsShort?: string[];
  weekdaysMin?: string[];
  ordinal?: (n: number) => number | string;
  formats: Partial<{
    LT: string;
    LTS: string;
    L: string;
    LL: string;
    LLL: string;
    LLLL: string;
  }>;
  relativeTime: Partial<{
    future: string;
    past: string;
    s: string;
    m: string;
    mm: string;
    h: string;
    hh: string;
    d: string;
    dd: string;
    M: string;
    MM: string;
    y: string;
    yy: string;
  }>;
}

const supportedLocales: string[] = [
  'af',
  'am',
  'ar',
  'ar-dz',
  'ar-iq',
  'ar-kw',
  'ar-ly',
  'ar-ma',
  'ar-sa',
  'ar-tn',
  'az',
  'be',
  'bg',
  'bi',
  'bm',
  'bn',
  'bn-bd',
  'bo',
  'br',
  'bs',
  'ca',
  'cs',
  'cv',
  'cy',
  'da',
  'de',
  'de-at',
  'de-ch',
  'dv',
  'el',
  'en',
  'en-au',
  'en-ca',
  'en-gb',
  'en-ie',
  'en-il',
  'en-in',
  'en-nz',
  'en-sg',
  'en-tt',
  'eo',
  'es',
  'es-do',
  'es-us',
  'et',
  'eu',
  'fa',
  'fi',
  'fo',
  'fr',
  'fr-ca',
  'fr-ch',
  'fy',
  'ga',
  'gd',
  'gl',
  'gom-latn',
  'gu',
  'he',
  'hi',
  'hr',
  'hu',
  'hy-am',
  'id',
  'is',
  'it',
  'it-ch',
  'ja',
  'jv',
  'ka',
  'kk',
  'km',
  'kn',
  'ko',
  'ku',
  'ky',
  'lb',
  'lo',
  'lt',
  'lv',
  'me',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'ms-my',
  'mt',
  'my',
  'nb',
  'ne',
  'nl',
  'nl-be',
  'nn',
  'oc-lnc',
  'pa-in',
  'pl',
  'pt',
  'pt-br',
  'ro',
  'ru',
  'sd',
  'se',
  'si',
  'sk',
  'sl',
  'sq',
  'sr',
  'sr-cyrl',
  'ss',
  'sv',
  'sw',
  'ta',
  'te',
  'tet',
  'tg',
  'th',
  'tk',
  'tl-ph',
  'tlh',
  'tr',
  'tzl',
  'tzm',
  'tzm-latn',
  'ug-cn',
  'uk',
  'ur',
  'uz',
  'uz-latn',
  'vi',
  'x-pseudo',
  'yo',
  'zh-cn',
  'zh-hk',
  'zh-tw',
];

/**
 * The LocaleLoader class is responsible for loading and storing Day.js locales.
 */
class DayjsLocaleManager implements ILocaleManager<IDayJsLocale> {
  /** A map to store loaded locale modules, preventing redundant imports. **/
  loadedLocales = new Map<string, IDayJsLocale>();

  /**
   * Stores explicitly enabled locales.
   * If not set all supported locales are enabled.
   **/
  enabledLocales: Array<string> | undefined;

  /**
   * Asynchronously loads a locale module based on the provided locale string.
   * The locale string is expected to be in the format 'language' or 'language-country'.
   * @param locale
   */
  async loadLocale(locale: string) {
    const resolveLocale = this.resolveLocaleString(locale);

    if (!resolveLocale) throw new Error(`Locale ${locale} is not supported.`);

    if (!this.loadedLocales.has(resolveLocale)) {
      try {
        // Dynamically import the locale data module
        const localeModule = await import(`./locales/${resolveLocale}.js`);
        this.loadedLocales.set(resolveLocale, localeModule.default); // Cache the imported locale module
        console.log(`Locale ${locale} has been loaded.`);
      } catch (error) {
        console.error(`Error loading the locale '${locale}':`, error);
      }
    }
  }

  /**
   * This function is responsible for translating platform locale names to dayjs locale names.
   * Some locale names used in the platform may differ from the internal name used by dayjs.
   * E.g. the platform uses en-us while dayjs only knows en.
   * @param locale
   * @private
   */
  private resolveLocaleString(locale: string) {
    locale = locale.toLowerCase();
    const localeCode = supportedLocales.includes(locale) ? locale : locale.split('-')[0];
    if (!supportedLocales.includes(localeCode)) return null;
    return localeCode;
  }

  /**
   * Checks if a given locale is already loaded.
   * @param locale
   */
  isLoaded(locale: string, strict = false): boolean {
    const resolveLocale = strict ? locale : this.resolveLocaleString(locale);
    if (!resolveLocale) return false;
    return this.loadedLocales.has(resolveLocale);
  }

  /**
   * This function can be used to create custom locales based on a baseLocale and calendar-preferences.
   * This function will create and register a custom locales.
   * @param baseLocale
   * @param preferences
   */
  extendLocale(baseLocale: string | undefined | null, preferences: ICalendarPreferences): string {
    baseLocale ||= 'en';

    if (!this.isLoaded(baseLocale)) throw new Error('Can not extend locale which is not loaded.');

    const localeName = this.getPreferenceLocale(baseLocale, preferences);
    if (this.isLoaded(localeName, true)) return localeName;

    const { weekStart, yearStart } = preferences;

    const customLocale = { ...dayjs.Ls.en };

    customLocale.name = localeName;

    if (typeof weekStart !== 'undefined') {
      customLocale.weekStart = weekStart;
    }

    // yearStart = 0 === iso for us, but not for dayjs
    if (typeof yearStart !== 'undefined' && yearStart !== 0) {
      (<any>customLocale).yearStart = yearStart;
    }

    dayjs.locale(customLocale, undefined, true);
    this.loadedLocales.set(localeName, customLocale);

    return localeName;
  }

  private getPreferenceLocale(baseLocale: string, preferences: ICalendarPreferences): string {
    const { weekStart, yearStart } = preferences;

    let result = this.resolveLocaleString(baseLocale) || 'en';

    if (typeof weekStart !== 'undefined') {
      result += `-ws-${weekStart}`;
    }

    if (typeof yearStart !== 'undefined' && yearStart !== 0) {
      result += `-ys-${yearStart}`;
    }

    return result;
  }

  /**
   * Returns an already loaded locale.
   * @param locale
   */
  getLocale(locale: string): IDayJsLocale | undefined {
    const resolveLocale = this.resolveLocaleString(locale);

    if (!resolveLocale) return undefined;

    return this.loadedLocales.get(resolveLocale);
  }

  /**
   * Sets the global default locale.
   * @param locale
   */
  setGlobalLocale(locale: string) {
    dayjs.locale(locale.toLowerCase());
  }

  /**
   * Sets the enabled locales.
   * @param locales Array of locale strings in the format 'language' or 'language-country'.
   */
  setEnabledLocales(locales: string[]) {
    this.enabledLocales = locales
      .filter((locale) => !!this.resolveLocaleString(locale))
      .map((locale) => locale.toLowerCase());
  }

  /**
   * Returns the enabled locales.
   * If not restricted, this function will return all supported locales of the adapter.
   */
  getEnabledLocales(): Array<string> {
    return this.enabledLocales?.length ? this.enabledLocales : supportedLocales;
  }

  /**
   * Returns the default calendar-preferences for a given locale.
   * Note, the locale should already be loaded for this to work properly.
   * @param locale The targeted locale.
   */
  getDefaultPreferences(locale: string): Required<ICalendarPreferences> {
    const resolvedLocale = this.resolveLocaleString(locale);

    if (!resolvedLocale) {
      return {
        weekStart: 0,
        yearStart: 4,
      };
    }

    if (!this.isLoaded(resolvedLocale)) {
      console.warn('Tried to get default calendar-preferences of non loaded locale');
    }

    // https://github.com/iamkun/dayjs/issues/2506
    const localeObj = dayjs.Ls[resolvedLocale];
    return {
      weekStart: localeObj?.weekStart || 1,
      yearStart: (<any>localeObj)?.yearStart || 1,
    };
  }

  /**
   * Resets enabled locales.
   */
  reset(): void {
    this.enabledLocales = undefined;
  }
}

const instance = new DayjsLocaleManager();
export const useDayJsLocaleManager = () => instance;
