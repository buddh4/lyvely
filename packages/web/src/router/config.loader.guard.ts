import { useAuthStore } from "@server/modules/user/store/auth.store";
import { usePageStore } from "@server/modules/core/store/page.store";
import { NavigationGuardWithThis } from "vue-router";
import { toRefs } from "vue";
import * as i18n from "@server/i18n";
import authRepository from "@server/modules/user/repositories/auth.repository";
import { useAppConfigStore } from "@server/modules/core/store/app.config.store";
import { Status } from "@server/store/status";

const util: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const appConfigStore = useAppConfigStore();
  if(!appConfigStore.isStatus(Status.SUCCESS)) {
    await appConfigStore.loadConfig()
  }

  next();
}

export default util;
