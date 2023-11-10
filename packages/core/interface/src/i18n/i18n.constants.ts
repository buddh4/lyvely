export const I18N_MODULE_ID = 'i18n';

/**
 * This array contains an array of locales supported by the core, which means
 * there are actually translations available for those languages.
 * This is used to restrict enabled locales.
 * Furthermore, the locales defined here should be supported by the used date-time adapter.
 */
export const LOCALES_SUPPORTED = ['en-US', 'de-DE'];

/**
 * This contains the default enabled locales.
 * Enabled locales need to be a subset of supported locales and are used for locale validation and language selection.
 * Furthermore, the locales defined here should be supported by the used date-time adapter.
 */
export const DEFAULT_ENABLED_LOCALES: string[] = ['en-US', 'de-DE'];

/**
 * This contains the default fallback locale of the platform.
 * This can be overwritten by VITE_FALLBACK_LOCALE env variable in the frontend + i18n configuration in the backend.
 */
export const DEFAULT_FALLBACK_LOCALE = 'en-US';

/**
 * Defines all known locales with names.
 * This array needs to be extended in case additional locales need to be supported.
 */
export const LOCALE_NAMES = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'de-DE': 'Deutsch',
  'fr-FR': 'Français',
  'es-ES': 'Español (ES)',
  'es-MX': 'Español (MX)',
  'it-IT': 'Italiano',
  'pt-PT': 'Português (PT)',
  'pt-BR': 'Português (BR)',
  'ja-JP': '日本語',
  'zh-CN': '简体中文 (中国大陆)',
  'zh-TW': '繁體中文 (台灣)',
  'ru-RU': 'Русский',
  'ar-SA': 'العربية',
  'ko-KR': '한국어',
  'nl-NL': 'Nederlands',
  'sv-SE': 'Svenska',
  'fi-FI': 'Suomi',
  'da-DK': 'Dansk',
  'nb-NO': 'Norsk bokmål',
  'tr-TR': 'Türkçe',
  'pl-PL': 'Polski',
  'cs-CZ': 'Čeština',
  'hu-HU': 'Magyar',
  'ro-RO': 'Română',
  'sk-SK': 'Slovenčina',
  'sl-SI': 'Slovenščina',
  'el-GR': 'Ελληνικά',
  'bg-BG': 'Български',
  'th-TH': 'ไทย',
  'hi-IN': 'हिन्दी',
};
