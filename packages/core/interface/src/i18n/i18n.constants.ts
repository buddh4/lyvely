import { ILocaleDefinition } from './interfaces/locale.interface';

export const I18N_MODULE_ID = 'i18n';
export const LOCALES_SUPPORTED = ['en-US', 'de-DE'];
export const DEFAULT_FALLBACK_LOCALE = 'en-US';
export const DEFAULT_ENABLED_LOCALES: ILocaleDefinition[] = [
  { locale: 'en-US', name: 'English' },
  { locale: 'de-DE', name: 'Deutsch' },
];
export const DEFAULT_LOCALE_NAMES = {
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
