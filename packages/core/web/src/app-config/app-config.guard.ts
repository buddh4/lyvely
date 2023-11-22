import { NavigationGuardWithThis } from 'vue-router';
import { useAppConfigStore } from './app-config.store';
import { Status } from '@/core';

export const appConfigGuard: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const appConfigStore = useAppConfigStore();
  if (!appConfigStore.isStatus(Status.SUCCESS)) {
    await appConfigStore.loadConfig();
  }

  next();
};
