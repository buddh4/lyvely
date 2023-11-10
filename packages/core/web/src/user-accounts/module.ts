import { userAccountsRoutes } from './routes';
import { USER_ACCOUNTS_MODULE_ID } from '@lyvely/core-interface';
import { IModule } from '@/core';
import { registerComponentStackEntries, registerMenuEntries } from '@lyvely/ui';
import { MENU_ACCOUNT_DRAWER } from '@/user-accounts/user-accounts.constants';
import { STACK_PROFILE_TOP_RIGHT_NAVIGATION } from '@/profiles';
import AccountDrawer from './components/menus/AccountDrawer.vue';

export default () => {
  return {
    id: USER_ACCOUNTS_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      'my-account': (locale: string) => import(`./locales/my-account.${locale}.json`),
      otp: (locale: string) => import(`./locales/otp.${locale}.json`),
    },
    routes: userAccountsRoutes,
    init: () => {
      registerComponentStackEntries(STACK_PROFILE_TOP_RIGHT_NAVIGATION, [
        {
          id: 'account-drawer',
          component: AccountDrawer,
          sortOrder: 100,
        },
      ]);
      registerMenuEntries(MENU_ACCOUNT_DRAWER, [
        {
          id: 'my-account',
          sortOrder: 1000,
          moduleId: USER_ACCOUNTS_MODULE_ID,
          icon: 'account',
          text: 'user-accounts.drawer.my-account',
          to: { name: 'MyAccountInfo' },
        },
      ]);
    },
  } as IModule;
};
