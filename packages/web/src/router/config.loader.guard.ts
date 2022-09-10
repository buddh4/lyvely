import { useAuthStore } from "@/modules/user/store/auth.store";
import { usePageStore } from "@/modules/core/store/page.store";
import { NavigationGuardWithThis } from "vue-router";
import { toRefs } from "vue";
import * as i18n from "@/i18n";
import authRepository from "@/modules/user/repositories/auth.repository";
import { useAppConfigStore } from "@/modules/core/store/app.config.store";
import { Status } from "@/store/status";

const util: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const appConfigStore = useAppConfigStore();
  if(!appConfigStore.isStatus(Status.SUCCESS)) {
    await appConfigStore.loadConfig()
  }

  next();
}

export default util;
