import { NavigationGuardWithThis } from 'vue-router';
import {
  isGlobalMessagesLoaded,
  isModuleMessagesLoaded,
  loadModuleMessages,
  setLocale,
} from './i18n';
import { usePageStore } from '@/ui';
import { useI18nStore } from './i18n.store';

export const messageLoaderGuard: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const { locale } = useI18nStore();
  const { setShowAppLoader } = usePageStore();

  const promises: Promise<any>[] = [];

  if (!isGlobalMessagesLoaded(locale)) {
    setShowAppLoader(true);
    promises.push(setLocale(locale));
  }

  if (to.meta?.i18n?.load?.length) {
    to.meta.i18n.load.forEach((load) => {
      const moduleId = typeof load === 'string' ? load : load.module;
      const section = typeof load === 'string' ? undefined : load.section;
      if (!isModuleMessagesLoaded(moduleId, section)) {
        promises.push(loadModuleMessages(moduleId, section));
      }
    });
  }

  if (promises.length) {
    await Promise.all(promises);
  }

  next();
};
