import { defineStore } from 'pinia';
import { readonly, ref } from 'vue';
import { getDefaultLocale } from './locale.helper';
import {
  I18N_MODULE_ID,
  I18nAppConfig,
  ILocaleDefinition,
  DEFAULT_ENABLED_LOCALES,
  LOCALES_SUPPORTED,
  getLocaleDefinitions,
  getLocaleName,
} from '@lyvely/core-interface';
import { EVENT_APP_CONFIG_LOADED, useAppConfigStore } from '@/app-config';
import { getFallbackLocale, setLocale } from './i18n';
import { eventBus } from '@/core';
import {
  setEnabledLocales,
  setGlobalDateTimeLocale,
  getTimezone,
  getTimezones,
} from '@lyvely/dates';

/**
 * This store provides translation state and helper functions.
 */
export const useI18nStore = defineStore('i18n', () => {
  const locale = ref(getDefaultLocale(getEnabledLocales(), getFallbackLocale()));
  const timezone = ref(getTimezone());

  /**
   * Here we sync the enabled locales setting with our date time adapter.
   * This is e.g. required for locale validation in models.
   */
  eventBus.on(EVENT_APP_CONFIG_LOADED, () => {
    setEnabledLocales(getEnabledLocales());
  });

  /**
   * Returns all supported and enabled locales definitions by configuration.
   */
  function getEnabledLocaleDefinitions(): ILocaleDefinition[] {
    return useAppConfigStore()
      .getModuleConfig<I18nAppConfig, ILocaleDefinition[]>(
        I18N_MODULE_ID,
        'locales',
        getLocaleDefinitions(DEFAULT_ENABLED_LOCALES),
      )
      .filter(({ locale }) => LOCALES_SUPPORTED.includes(locale));
  }

  /**
   * Returns all supported and enabled locales by configuration.
   */
  function getEnabledLocales(): string[] {
    return getEnabledLocaleDefinitions().map(({ locale }) => locale);
  }

  /**
   * Checks if a given locale is supported and enabled.
   * @param locale
   */
  function isEnabledLocale(locale: string) {
    return !!getEnabledLocaleDefinitions().find(({ locale: l }) => l === locale);
  }

  /**
   * Sets the currently active locale, this may be a default value or the user locale for authenticated users.
   * @param localeUpdate
   */
  async function setActiveLocale(localeUpdate: string) {
    if (!isEnabledLocale(localeUpdate)) {
      //This call assures that we call setLocale to load initial translations.
      return setActiveLocale(locale.value);
    }

    locale.value = localeUpdate;
    setGlobalDateTimeLocale(localeUpdate);
    return setLocale(localeUpdate);
  }

  /**
   * Sets the active timezone for this session.
   * @param tz A valid timezone-identifier.
   */
  function setTimezone(tz: string) {
    if (getTimezones().includes(tz)) {
      timezone.value = tz;
    }
  }

  return {
    locale: readonly(locale),
    timezone: readonly(timezone),
    setTimezone,
    setActiveLocale,
    getEnabledLocales,
    getEnabledLocaleDefinitions,
    getLocaleName,
  };
});
