import { useAuthStore } from '@/modules/auth/store/auth.store';
import { usePageStore } from '@/modules/core/store/page.store';
import { NavigationGuardWithThis } from 'vue-router';
import { isModuleMessagesLoaded, isGlobalMessagesLoaded, setLocale, loadModuleMessages } from '@/i18n';

export const messageLoaderGuard: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const { locale } = useAuthStore();
  const { setShowAppLoader } = usePageStore();

  const promises: Promise<any>[] = [];

  if (!isGlobalMessagesLoaded(locale)) {
    setShowAppLoader(true);
    promises.push(setLocale(locale));
  }

  if (to.meta?.i18n?.module && !isModuleMessagesLoaded(locale, to.meta?.i18n?.module)) {
    promises.push(loadModuleMessages(locale, to.meta?.i18n?.module));
  }

  if (promises.length) {
    await Promise.all(promises);
  }

  next();
};
