import { nextTick } from "vue";
import { createI18n, I18n } from "vue-i18n";

export const SUPPORT_LOCALES = ["en", "de"];

let i18n: I18n;

export function setupI18n(options = { locale: "en" }) {
  options.locale = transformLocale(options.locale);
  i18n = createI18n({});
  setI18nLanguage(options.locale);
  return i18n;
}

function transformLocale(locale: string) {
  return locale.split("-")[0];
}

export async function setI18nLanguage(locale: string) {
  locale = transformLocale(locale);

  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(locale);
  }

  if (i18n.mode === "legacy" || typeof i18n.global.locale === 'string') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }

  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector("html")?.setAttribute("lang", locale);
}

export async function loadLocaleMessages(locale: string) {
  // load locale messages with dynamic import
  return fetch(`/locales/${locale}.json`)
    .then(response => response.json())
    .then(data => i18n.global.setLocaleMessage(locale, data))
    .then(nextTick as any);
}
