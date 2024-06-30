export const I18N_MODULE_ID = 'i18n';

/**
 * This array contains an array of locales supported by the core, which means
 * there are actually translations available for those languages.
 * This is used to restrict enabled locales.
 * Furthermore, the locales defined here should be supported by the used date-time adapter.
 */
export const LOCALES_SUPPORTED = ['en-us', 'de'];

/**
 * This contains the default enabled locales.
 * Enabled locales need to be a subset of supported locales and are used for locale validation and language selection.
 * Furthermore, the locales defined here should be supported by the used date-time adapter.
 */
export const DEFAULT_ENABLED_LOCALES: string[] = ['en-us', 'de'];

/**
 * This contains the default fallback locale of the platform.
 * This can be overwritten by VITE_FALLBACK_LOCALE env variable in the frontend + i18n configuration in the backend.
 */
export const DEFAULT_FALLBACK_LOCALE = 'en-us';

/**
 * Defines all known locales with names.
 * This array needs to be extended in case additional locales need to be supported.
 */
export const LOCALE_NAMES = {
  en: 'English',
  'en-us': 'English (US)',
  'en-gb': 'English (UK)',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español (ES)',
  'es-mx': 'Español (MX)',
  it: 'Italiano',
  pt: 'Português (PT)',
  'pt-br': 'Português (BR)',
  ja: '日本語',
  'zh-cn': '简体中文 (中国大陆)',
  'zh-tw': '繁體中文 (台灣)',
  ru: 'Русский',
  ar: 'العربية',
  ko: '한국어',
  nl: 'Nederlands',
  sv: 'Svenska',
  fi: 'Suomi',
  da: 'Dansk',
  nb: 'Norsk bokmål',
  tr: 'Türkçe',
  pl: 'Polski',
  cs: 'Čeština',
  hu: 'Magyar',
  ro: 'Română',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  el: 'Ελληνικά',
  bg: 'Български',
  th: 'ไทย',
  hi: 'हिन्दी',
};
