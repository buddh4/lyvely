import { IModule } from '@/core';
import { authGuard } from './guards';
import { registerGuards } from '@/lyvely.router';
import { authRoutes } from './routes';
import { AUTH_MODULE_ID } from '@lyvely/interface';
import { registerMenuEntries } from '@lyvely/ui';
import { MENU_ACCOUNT_DRAWER } from '@/user-account';
import { useAuthStore } from './stores/auth.store';
import { useAPIVisitorInterceptor, useAutoTokenRefresh } from './interceptors';

export const authModule = () => {
  return {
    id: 'auth',
    moduleId: AUTH_MODULE_ID,
    routes: authRoutes,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      login: (locale: string) => import(`./locales/login.${locale}.json`),
      'reset-password': (locale: string) => import(`./locales/reset-password.${locale}.json`),
    },
    init: () => {
      registerGuards([{ guard: authGuard, sortOrder: 2000 }]);
      registerMenuEntries(MENU_ACCOUNT_DRAWER, [
        () => ({
          id: 'account-logout',
          sortOrder: 5000,
          moduleId: AUTH_MODULE_ID,
          icon: 'logout',
          iconBindings: { autoScale: true },
          condition: useAuthStore().isAuthenticated,
          click: () => useAuthStore().logout(),
          text: 'auth.account.logout',
        }),
        () => ({
          id: 'account-login',
          sortOrder: 5000,
          moduleId: AUTH_MODULE_ID,
          icon: 'logout',
          iconBindings: { autoScale: true },
          condition: !useAuthStore().isAuthenticated,
          to: { name: 'Login' },
          text: 'auth.account.login',
        }),
      ]);
      useAutoTokenRefresh();
      useAPIVisitorInterceptor();
    },
  } as IModule;
};
