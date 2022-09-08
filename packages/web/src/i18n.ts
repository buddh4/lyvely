import { nextTick } from "vue";
import { createI18n, I18n } from "vue-i18n";
import type { LocaleMessage } from '@intlify/core-base';
import { getModules } from "@/module.loader";

export const SUPPORT_LOCALES = ["en", "de"];

let i18n: I18n;

export const LOCALES_AVAILABLE = {
  'en': 'English',
  'de': 'Deutsch',
}

export function getI18n() {
  return i18n;
}

export function translate(key: string, options?: any) {
  return (<any> getI18n().global).t(key, options);
}

export function setupI18n(options = { locale: "en" }) {
  options.locale = transformLocale(options.locale);
  i18n = createI18n({
    legacy: false,
    fallbackLocale: 'en'
  });
  setLocale(options.locale);
  return i18n;
}

function transformLocale(locale: string) {
  return locale.split("-")[0];
}

const loadedModules: Record<string, Record<string, boolean>>  = {};

export function isModuleMessagesLoaded(locale: string, module: string, prefix?: string) {
  locale = transformLocale(locale);
  return loadedModules[module] && loadedModules[module][prefix ? prefix+'.'+locale : locale];
}

function setModuleMessagesLoaded(locale: string, module: string, prefix?: string) {
  locale = transformLocale(locale);
  loadedModules[module] = loadedModules[module] || {};
  loadedModules[module][prefix ? prefix+'.'+locale : locale] = true;
}

export function loadModuleMessages(locale: string, module: string) {
  locale = transformLocale(locale);
  return import(`./modules/${module}/locales/${locale}.json`)
    .then(data => mergeMessages(locale, data))
    .then(() => setModuleMessagesLoaded(locale, module))
    .then(() => nextTick());
}

export function loadModuleBaseMessages(locale: string) {
  locale = transformLocale(locale);

  // TODO: here we assume all modules have base message files
  getModules().forEach(module => {
    console.log('Load base module messages for '+module.getId());
    if(isModuleMessagesLoaded(locale, module.getId(), 'base')) return

    return import(`./modules/${module.getId()}/locales/base.${locale}.json`)
      .then(data => mergeMessages(locale, data))
      .then(() => setModuleMessagesLoaded(locale, module.getId(), 'base'))
      .then(() => nextTick());
  });
}

export function setMessages(locale: string, data: any) {
  i18n.global.mergeLocaleMessage(locale, data);
}

export function mergeMessages(locale: string, data: any) {
  i18n.global.mergeLocaleMessage(locale, data);
}

export function isGlobalMessagesLoaded(locale: string) {
  return i18n.global.availableLocales.includes(locale);
}

export async function setLocale(locale: string) {
  locale = transformLocale(locale);

  if (!isGlobalMessagesLoaded(locale)) {
    await loadLocaleMessages(locale);
    await loadModuleBaseMessages(locale);
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
  return import(`../locales/${locale}.json`)
    .then(data => mergeMessages(locale, data))
    .then(() => nextTick());
}
