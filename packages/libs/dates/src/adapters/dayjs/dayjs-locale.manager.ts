import { ILocaleManager } from '../../interfaces';
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
  'ar',
  'ar-dz',
  'ar-kw',
  'ar-ly',
  'ar-sa',
  'az',
  'be',
  'bg',
  'bi',
  'bm',
  'bn',
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
  'en-us',
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
  loadedLocales = new Map();

  /**
   * Stores explicitly enabled locales.
   * If not set all supported locales are enabled.
   **/
  enabledLocales: Array<string> | undefined;

  /**
   * Asynchronously loads a locale module based on the provided locale string.
   * The locale string is expected to be in the format 'language' or 'language-COUNTRY'.
   * @param locale
   */
  async loadLocale(locale: string) {
    const localeCode = this.resolveLocaleString(locale);

    if (!this.loadedLocales.has(localeCode)) {
      try {
        // Dynamically import the locale data module
        const localeModule = await import(`./locales/${localeCode}.js`);
        this.loadedLocales.set(localeCode, localeModule.default); // Cache the imported locale module
        console.log(`Locale ${localeCode} has been loaded.`);
      } catch (error) {
        console.error(`Error loading the locale '${localeCode}':`, error);
      }
    }
  }

  isLoaded(locale: string): boolean {
    return this.loadedLocales.has(locale) || this.loadedLocales.has(locale.split('-')[0]);
  }

  private resolveLocaleString(locale: string) {
    const localeCode = supportedLocales.includes(locale) ? locale : locale.split('-')[0];
    if (!supportedLocales.includes(localeCode)) {
      throw new Error(`Locale ${locale} is not supported.`);
    }
    return localeCode;
  }

  /**
   * Returns an already loaded locale.
   * @param locale
   */
  getLocale(locale: string): IDayJsLocale | undefined {
    return this.loadedLocales.get(locale.split('-')[0]);
  }

  /**
   * Sets the global default locale.
   * @param locale
   */
  setGlobalLocale(locale: string) {
    dayjs.locale(locale.split('-')[0]);
  }

  /**
   * Sets the enabled locales.
   * @param locales Array of locale strings in the format 'language' or 'language-COUNTRY'.
   */
  setEnabledLocales(locales: string[]) {
    this.enabledLocales = locales.filter((locale) => {
      const localeCode = supportedLocales.includes(locale) ? locale : locale.split('-')[0];
      return supportedLocales.includes(localeCode);
    });
  }

  /**
   * Returns the enabled locales.
   * If not restricted, this function will return all supported locales of the adapter.
   */
  getEnabledLocales(): Array<string> {
    return this.enabledLocales?.length ? this.enabledLocales : supportedLocales;
  }
}

const loaderInstance = new DayjsLocaleManager();
export const useDayJsLocaleLoader = () => loaderInstance;
