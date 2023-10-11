import { NavigationGuardWithThis } from 'vue-router';
import {
  isGlobalMessagesLoaded,
  isModuleMessagesLoaded,
  loadModuleMessages,
  setLocale,
} from './i18n';
import { usePageStore } from '@/core';
import { useI18nStore } from './i18n.store';

export const messageLoaderGuard: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const { locale } = useI18nStore();
  const { setShowAppLoader } = usePageStore();

  const promises: Promise<any>[] = [];

  if (!isGlobalMessagesLoaded(locale)) {
    setShowAppLoader(true);
    promises.push(setLocale(locale));
  }

  if (to.meta?.i18n?.module) {
    const i18nModules =
      typeof to.meta.i18n.module === 'string' ? [to.meta.i18n.module] : to.meta.i18n.module;
    i18nModules.forEach((translationId) => {
      const [module, key] = translationId.split('.');
      if (!isModuleMessagesLoaded(locale, module, key)) {
        promises.push(loadModuleMessages(locale, module));
      }
    });
  }

  if (promises.length) {
    await Promise.all(promises);
  }

  next();
};
