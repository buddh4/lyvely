import { nextTick } from 'vue';
import { createI18n, I18n } from 'vue-i18n';
import { IModule, getModule, isDevelopEnvironment, getModules } from '@/core';
import { Translatable } from '@lyvely/ui';
import { useI18nStore } from '@/i18n/i18n.store';

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

const DEFAULT_TRANSLATION_SECTION = 'locale';
const BASE_TRANSLATION_SECTION = 'base';

export function translation(key: string, options?: any) {
  return () => translate(key, options);
}

export function translationAdapter(t: Translatable) {
  if (typeof t === 'string') return translate(t);
  if (typeof t === 'object') return t.plain;
  if (typeof t === 'function') return t();

  return '';
}

export function translate(
  key: Translatable | ((params?: Record<string, string>) => string),
  options?: Record<string, string>,
) {
  if (typeof key === 'function') return key(options);
  if (!(<any>getI18n()?.global)) {
    console.error(new Error('Translation attept before app intialization.'));
    return 'error';
  }
  return (<any>getI18n().global).t(key, options);
}

export const t = translate;

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
export function isModuleMessagesLoaded(
  moduleId: string,
  section = DEFAULT_TRANSLATION_SECTION,
  locale?: string,
) {
  section ??= DEFAULT_TRANSLATION_SECTION;
  locale ??= useI18nStore().locale || fallBackLocale;
  return (
    loadedModules[moduleId] && loadedModules[moduleId][section ? section + '.' + locale : locale]
  );
}

const baseModuleLocales: string[] = [];

function setModuleMessagesLoaded(
  module: string,
  section = DEFAULT_TRANSLATION_SECTION,
  locale?: string,
) {
  section ??= DEFAULT_TRANSLATION_SECTION;
  locale ??= useI18nStore().locale || fallBackLocale;

  loadedModules[module] = loadedModules[module] || {};
  loadedModules[module][section ? section + '.' + locale : locale] = true;
}

export async function loadModuleMessages(
  moduleId: string,
  section = DEFAULT_TRANSLATION_SECTION,
  locale?: string,
): Promise<any> {
  section ??= DEFAULT_TRANSLATION_SECTION;
  locale ??= useI18nStore().locale || fallBackLocale;

  const promises = [];
  if (locale !== fallBackLocale && !isModuleMessagesLoaded(moduleId, section, fallBackLocale)) {
    promises.push(loadModuleMessages(moduleId, section, fallBackLocale));
  }

  const module = getModule(moduleId);

  if (!module?.i18n?.[section]) return Promise.resolve();

  promises.push(
    module.i18n[section](locale)
      .then((data) => mergeMessages(locale!, data))
      .then(() => setModuleMessagesLoaded(moduleId, section, locale))
      .then(() => nextTick())
      .catch((e) => {
        console.error(`Error loading module message file: ${module} for locale ${locale}`, e);
      }),
  );

  return Promise.all(promises);
}

export async function loadModuleBaseMessages(locale: string) {
  // TODO: here we assume all modules have base message files

  const promises: Array<Promise<any>> = getModules().map((module: IModule) => {
    if (
      !module.i18n?.[BASE_TRANSLATION_SECTION] ||
      isModuleMessagesLoaded(module.id, BASE_TRANSLATION_SECTION, locale)
    ) {
      return Promise.resolve();
    }

    return loadModuleMessages(module.id, BASE_TRANSLATION_SECTION, locale);
  });

  return Promise.all(promises).then(() => baseModuleLocales.push(locale));
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
  return import(`../../locales/${locale}.json`)
    .then((data) => mergeMessages(locale, data))
    .then(() => loadedCoreLocales.push(locale))
    .then(() => nextTick());
}
