import { nextTick } from "vue";
import { createI18n, I18n } from "vue-i18n";
import { getModules } from "@/module.loader";
import { isDevelopEnvironment } from "@/modules/core/environment";

export const SUPPORT_LOCALES = ["en-US", "de-DE"];

let i18n: I18n;

export const LOCALES_AVAILABLE = {
  "en-US": "English",
  "de-DE": "Deutsch",
};

export function getI18n() {
  return i18n;
}

export function translate(key: string, options?: any) {
  return (<any>getI18n().global).t(key, options);
}

export async function setupI18n(options = { locale: "en-US" }) {
  options.locale = options.locale;
  i18n = createI18n({
    legacy: false,
    fallbackLocale: "en-US",
    missingWarn: isDevelopEnvironment(),
  });
  await setLocale(options.locale);
  return i18n;
}

const loadedModules: Record<string, Record<string, boolean>> = {};
const loadedCoreLocales: string[] = [];

export function isModuleMessagesLoaded(
  locale: string,
  module: string,
  prefix?: string
) {
  return (
    loadedModules[module] &&
    loadedModules[module][prefix ? prefix + "." + locale : locale]
  );
}

function setModuleMessagesLoaded(
  locale: string,
  module: string,
  prefix?: string
) {
  loadedModules[module] = loadedModules[module] || {};
  loadedModules[module][prefix ? prefix + "." + locale : locale] = true;
}

export function loadModuleMessages(locale: string, module: string) {
  return import(`./modules/${module}/locales/${locale}.json`)
    .then((data) => mergeMessages(locale, data))
    .then(() => setModuleMessagesLoaded(locale, module))
    .then(() => nextTick());
}

export function loadModuleBaseMessages(locale: string) {
  // TODO: here we assume all modules have base message files
  getModules().forEach((module) => {
    console.log("Load base module messages for " + module.getId());
    if (isModuleMessagesLoaded(locale, module.getId(), "base")) return;

    return import(`./modules/${module.getId()}/locales/base.${locale}.json`)
      .then((data) => mergeMessages(locale, data))
      .then(() => setModuleMessagesLoaded(locale, module.getId(), "base"))
      .then(() => nextTick())
      .catch(console.error);
  });
}

export function setMessages(locale: string, data: any) {
  i18n.global.mergeLocaleMessage(locale, data);
}

export function mergeMessages(locale: string, data: any) {
  i18n.global.mergeLocaleMessage(locale, data);
}

export function isGlobalMessagesLoaded(locale: string) {
  return loadedCoreLocales.includes(locale);
}

export async function setLocale(locale: string) {
  if (!isGlobalMessagesLoaded(locale)) {
    await loadLocaleMessages(locale);
    await loadModuleBaseMessages(locale);
  }

  if (i18n.mode === "legacy" || typeof i18n.global.locale === "string") {
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

export function getLocale() {
  return i18n.global.locale;
}

export async function loadLocaleMessages(locale: string) {
  // load locale messages with dynamic import
  console.log("Load core locales");
  return import(`../locales/${locale}.json`)
    .then((data) => mergeMessages(locale, data))
    .then(() => loadedCoreLocales.push(locale))
    .then(() => nextTick());
}
