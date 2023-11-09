import { defineStore } from 'pinia';
import { readonly, ref } from 'vue';
import { getDefaultLocale } from './locale.util';
import {
  I18N_MODULE_ID,
  I18nAppConfig,
  ILocaleDefinition,
  DEFAULT_ENABLED_LOCALES,
  LOCALES_SUPPORTED,
  DEFAULT_LOCALE_NAMES,
} from '@lyvely/core-interface';
import { useAppConfigStore } from '@/app-config';
import { getFallbackLocale, setLocale } from '../i18n';

/**
 * This store provides translation state and helper functions.
 */
export const useI18nStore = defineStore('i18n', () => {
  const locale = ref(getDefaultLocale(getEnabledLocales(), getFallbackLocale()));

  /**
   * Returns all supported and enabled locales by configuration.
   */
  function getEnabledLocales(): ILocaleDefinition[] {
    return useAppConfigStore()
      .getModuleConfig<I18nAppConfig, ILocaleDefinition[]>(
        I18N_MODULE_ID,
        'locales',
        DEFAULT_ENABLED_LOCALES,
      )
      .filter(({ locale }) => LOCALES_SUPPORTED.includes(locale));
  }

  /**
   * Checks if a given locale is supported and enabled.
   * @param locale
   */
  function isEnabledLocale(locale: string) {
    return !!getEnabledLocales().find((l) => l.locale === locale);
  }

  /**
   * Sets the currently active locale, this may be a default value or the user locale for authenticated users.
   * @param localeUpdate
   */
  async function setActiveLocale(localeUpdate: string) {
    if (!isEnabledLocale(localeUpdate)) {
      /**
       *  This call assures that we call setLocale in any case, which is required to load initial translations,
       *  even if the locale did not change.
       */
      return setActiveLocale(locale.value);
    }

    locale.value = localeUpdate;
    return setLocale(localeUpdate);
  }

  function getLocaleName(locale: string): string {
    if (Object.hasOwn(DEFAULT_LOCALE_NAMES, locale)) {
      return DEFAULT_LOCALE_NAMES[locale as keyof typeof DEFAULT_LOCALE_NAMES] as string;
    }

    return '';
  }

  return {
    locale: readonly(locale),
    setActiveLocale,
    getEnabledLocales,
    getLocaleName,
    isEnabledLocale,
  };
});
