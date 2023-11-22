import { nextTick } from 'vue';
import { createI18n, I18n } from 'vue-i18n';
import { IModule, getModule, isDevelopEnvironment, getModules } from '@/core';
import { Translatable } from '@lyvely/ui';
import { DEFAULT_FALLBACK_LOCALE, LOCALES_SUPPORTED, ITranslatable } from '@lyvely/interface';
import { loadDateTimeLocale, isDateTimeLocaleLoaded } from '@lyvely/dates';

let i18n: I18n;

export function getI18n() {
  return i18n;
}

export type ITranslation = () => string;

const DEFAULT_TRANSLATION_SECTION = 'locale';
const BASE_TRANSLATION_SECTION = 'base';

// Note that at this time, we can not access app config from the backend.
let fallBackLocale = import.meta.env.VITE_FALLBACK_LOCALE || DEFAULT_FALLBACK_LOCALE;

if (!LOCALES_SUPPORTED.includes(fallBackLocale)) {
  fallBackLocale = DEFAULT_FALLBACK_LOCALE;
}

let activeLocale = fallBackLocale;

export function translation(key: string, options?: any) {
  return () => translate(key, options);
}

export function translationAdapter(t: Translatable) {
  if (!t) return '';
  if (typeof t === 'string') return translate(t);
  if (typeof t === 'object') return t.plain;
  if (typeof t === 'function') return t();

  return '';
}

export function translate(key: ITranslatable, params?: Record<string, string>): string {
  if (typeof key === 'function') return key(params);
  if (!(<any>getI18n()?.global)) {
    console.error(new Error('Translation attempt before app initialization.'));
    return 'error';
  }

  if (key && typeof key === 'object' && 'key' in key) {
    return (<any>getI18n().global).t(key.key, key.params || params);
  }

  if (key && typeof key === 'object' && 'plain' in key) {
    return key.plain;
  }

  if (typeof key === 'string') {
    return (<any>getI18n().global).t(key, params);
  }

  console.error('Invalid translation', key);

  return '';
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
  locale ??= activeLocale;
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
  locale ??= activeLocale;

  loadedModules[module] = loadedModules[module] || {};
  loadedModules[module][section ? section + '.' + locale : locale] = true;
}

export async function loadModuleMessages(
  moduleId: string,
  section = DEFAULT_TRANSLATION_SECTION,
  locale?: string,
): Promise<any> {
  section ??= DEFAULT_TRANSLATION_SECTION;
  locale ??= activeLocale;

  locale = locale.toLowerCase();

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
        console.error(`Error loading module message file: ${moduleId} for locale ${locale}`, e);
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
  i18n.global.mergeLocaleMessage(locale.toLowerCase(), data);
}

export function mergeMessages(locale: string, data: any) {
  i18n.global.mergeLocaleMessage(locale.toLowerCase(), data.default ? data.default : data);
}

export function isGlobalMessagesLoaded(locale: string) {
  return loadedCoreLocales.includes(locale.toLowerCase());
}

export function isBaseModuleMessagesLoaded(locale: string) {
  return baseModuleLocales.includes(locale.toLowerCase());
}

/**
 * Sets the locale used for translations and loads base translations.
 * This function should not be called directly, otherwise we are out of sync with stored.
 * Note, this function will not load any non-base translation files.
 * @param locale
 */
export async function setLocale(locale: string) {
  const promises = [];

  if (!isGlobalMessagesLoaded(locale)) {
    promises.push(loadRootLocaleMessages(locale));
  }

  if (!isGlobalMessagesLoaded(fallBackLocale)) {
    promises.push(loadRootLocaleMessages(fallBackLocale));
  }

  if (!isBaseModuleMessagesLoaded(locale)) {
    promises.push(loadModuleBaseMessages(locale));
  }

  if (!isDateTimeLocaleLoaded(fallBackLocale)) {
    promises.push(loadDateTimeLocale(fallBackLocale));
  }

  if (!isDateTimeLocaleLoaded(locale)) {
    promises.push(loadDateTimeLocale(locale));
  }

  await Promise.all(promises);

  if (i18n.mode === 'legacy' || typeof i18n.global.locale === 'string') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }

  activeLocale = locale;

  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')?.setAttribute('lang', locale);
}

export function getFallbackLocale() {
  return fallBackLocale;
}

export async function loadRootLocaleMessages(locale: string) {
  locale = locale.toLowerCase();
  return import(`../../locales/${locale}.json`)
    .then((data) => mergeMessages(locale, data))
    .then(() => loadedCoreLocales.push(locale))
    .then(() => nextTick());
}
