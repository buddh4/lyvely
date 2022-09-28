import { useAuthStore } from "@/modules/users/store/auth.store";
import { usePageStore } from "@/modules/core/store/page.store";
import { NavigationGuardWithThis } from "vue-router";
import { toRefs } from "vue";
import * as i18n from "@/i18n";

const util: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const { locale } = useAuthStore();
  const { showAppLoader } = toRefs(usePageStore());

  const promises: Promise<any>[] = [];

  if (!i18n.isGlobalMessagesLoaded(locale)) {
    showAppLoader.value = true;
    promises.push(i18n.setLocale(locale));
  }

  if (
    to.meta?.i18n?.module &&
    !i18n.isModuleMessagesLoaded(locale, to.meta?.i18n?.module)
  ) {
    showAppLoader.value = true;
    promises.push(i18n.loadModuleMessages(locale, to.meta?.i18n?.module));
  }

  if (promises.length) {
    await Promise.all(promises).catch(() => (showAppLoader.value = false));
  }

  if (usePageStore().showAppLoader) {
    setTimeout(() => (usePageStore().showAppLoader = false), 600);
  }

  next();
};

export default util;
