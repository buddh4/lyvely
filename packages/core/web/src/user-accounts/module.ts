import { userAccountsRoutes } from './routes';
import { USER_ACCOUNTS_MODULE_ID } from '@lyvely/core-interface';
import { IModule } from '@/core';
import { registerMenuEntries } from '@/ui';
import { MENU_ACCOUNT_DRAWER } from '@/user-accounts/user-accounts.constants';

export default () => {
  return {
    id: USER_ACCOUNTS_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      'my-account': (locale: string) => import(`./locales/my-account.${locale}.json`),
    },
    routes: userAccountsRoutes,
    init: () => {
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

      setInterval(() => {}, 1000);
    },
  } as IModule;
};
