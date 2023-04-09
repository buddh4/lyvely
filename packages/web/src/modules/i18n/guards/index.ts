import { useAuthStore } from '@/modules/auth/store/auth.store';
import { usePageStore } from '@/modules/core/store/page.store';
import { NavigationGuardWithThis } from 'vue-router';
import {
  isModuleMessagesLoaded,
  isGlobalMessagesLoaded,
  setLocale,
  loadModuleMessages,
} from '@/i18n';

export const messageLoaderGuard: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const { locale } = useAuthStore();
  const { setShowAppLoader } = usePageStore();

  const promises: Promise<any>[] = [];

  if (!isGlobalMessagesLoaded(locale)) {
    setShowAppLoader(true);
    promises.push(setLocale(locale));
  }

  if (to.meta?.i18n?.module) {
    const i18nModules =
      typeof to.meta.i18n.module === 'string' ? [to.meta.i18n.module] : to.meta.i18n.module;
    i18nModules.forEach((module) => {
      if (!isModuleMessagesLoaded(locale, module)) {
        promises.push(loadModuleMessages(locale, module));
      }
    });
  }

  if (promises.length) {
    await Promise.all(promises);
  }

  next();
};
