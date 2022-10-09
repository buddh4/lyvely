import { useAuthStore } from "@/modules/auth/store/auth.store";
import { usePageStore } from "@/modules/core/store/page.store";
import { NavigationGuardWithThis } from "vue-router";
import { toRefs } from "vue";
import * as i18n from "@/i18n";

const util: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const { locale } = useAuthStore();
  const { setShowAppLoader } = usePageStore();

  const promises: Promise<any>[] = [];

  if (!i18n.isGlobalMessagesLoaded(locale)) {
    setShowAppLoader("auto-message-loader", true);
    promises.push(i18n.setLocale(locale));
  }

  if (
    to.meta?.i18n?.module &&
    !i18n.isModuleMessagesLoaded(locale, to.meta?.i18n?.module)
  ) {
    setShowAppLoader("auto-message-loader", true);
    promises.push(i18n.loadModuleMessages(locale, to.meta?.i18n?.module));
  }

  if (promises.length) {
    await Promise.all(promises).finally(() =>
      setShowAppLoader("auto-message-loader", false)
    );
  }

  next();
};

export default util;
