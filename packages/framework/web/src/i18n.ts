import { nextTick } from 'vue';
import { createI18n, I18n } from 'vue-i18n';
import { onModulesLoaded } from '@/module.loader';
import { isDevelopEnvironment } from '@/modules/core/environment';

export const SUPPORT_LOCALES = ['en-US', 'de-DE'];

let i18n: I18n;

// TODO: make this configurable
const fallBackLocale = 'en-US';

export const LOCALES_AVAILABLE = {
  'en-US': 'English',
  'de-DE': 'Deutsch',
};

export function getI18n() {
  return i18n;
}

export type ITranslation = () => string;

export function translation(key: string, options?: any) {
  return () => translate(key, options);
}

export function translate(key: string | (() => string), options?: any) {
  if (typeof key === 'function') return key();
  return (<any>getI18n().global).t(key, options);
}

export function setupI18n() {
  i18n = createI18n({
    legacy: false,
    fallbackLocale: fallBackLocale,
    missingWarn: isDevelopEnvironment(),
  });
  return i18n;
}

const loadedModules: Record<string, Record<string, boolean>> = {};
const loadedCoreLocales: string[] = [];
const baseModuleLocales: string[] = [];

export function isModuleMessagesLoaded(locale: string, module: string, prefix?: string) {
  return loadedModules[module] && loadedModules[module][prefix ? prefix + '.' + locale : locale];
}

function setModuleMessagesLoaded(locale: string, module: string, prefix?: string) {
  loadedModules[module] = loadedModules[module] || {};
  loadedModules[module][prefix ? prefix + '.' + locale : locale] = true;
}

export async function loadModuleMessages(locale: string, module: string): Promise<any> {
  const promises = [];
  if (locale !== fallBackLocale && !isModuleMessagesLoaded(fallBackLocale, module)) {
    promises.push(loadModuleMessages(fallBackLocale, module));
  }

  promises.push(
    import(`./modules/${module}/locales/${locale}.json`)
      .then((data) => mergeMessages(locale, data))
      .then(() => setModuleMessagesLoaded(locale, module))
      .then(() => nextTick())
      .catch(() => {
        console.warn(`Error loading message file: ./modules/${module}/locales/${locale}.json`);
      }),
  );

  return Promise.all(promises);
}

export function loadModuleBaseMessages(locale: string) {
  // TODO: here we assume all modules have base message files

  return onModulesLoaded().then((modules) => {
    const promises: Array<Promise<any>> = modules.map((module) => {
      if (
        module?.options?.i18n?.baseLocales === false ||
        isModuleMessagesLoaded(locale, module.getId(), 'base')
      )
        return Promise.resolve();

      return import(`./modules/${module.getId()}/locales/base.${locale}.json`)
        .then((data) => mergeMessages(locale, data))
        .then(() => setModuleMessagesLoaded(locale, module.getId(), 'base'))
        .then(() => nextTick())
        .catch(console.error);
    });

    if (locale !== fallBackLocale) {
      promises.push(loadModuleBaseMessages(fallBackLocale));
    }

    return Promise.all(promises).then(() => baseModuleLocales.push(locale));
  });
}

export function setMessages(locale: string, data: any) {
  i18n.global.mergeLocaleMessage(locale, data);
}

export function mergeMessages(locale: string, data: any) {
  i18n.global.mergeLocaleMessage(locale, data.default ? data.default : data);
}

export function isGlobalMessagesLoaded(locale: string) {
  return loadedCoreLocales.includes(locale);
}

export function isBaseModuleMessagesLoaded(locale: string) {
  return baseModuleLocales.includes(locale);
}

export async function setLocale(locale: string) {
  const promises = [];

  if (!isGlobalMessagesLoaded(locale)) {
    promises.push(loadLocaleMessages(locale));
  }

  if (!isGlobalMessagesLoaded(fallBackLocale)) {
    promises.push(loadLocaleMessages(fallBackLocale));
  }

  if (!isBaseModuleMessagesLoaded(locale)) {
    promises.push(loadModuleBaseMessages(locale));
  }

  await Promise.all(promises);

  if (i18n.mode === 'legacy' || typeof i18n.global.locale === 'string') {
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
  document.querySelector('html')?.setAttribute('lang', locale);
}

export function getLocale() {
  return i18n.global.locale;
}

export async function loadLocaleMessages(locale: string) {
  // load locale content-stream with dynamic import
  return import(`../locales/${locale}.json`)
    .then((data) => mergeMessages(locale, data))
    .then(() => loadedCoreLocales.push(locale))
    .then(() => nextTick());
}