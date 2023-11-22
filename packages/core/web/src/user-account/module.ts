import { userAccountRoutes } from './routes';
import { USER_ACCOUNT_MODULE_ID } from '@lyvely/interface';
import { IModule } from '@/core';
import { registerComponentStackEntries, registerMenuEntries } from '@lyvely/ui';
import { MENU_ACCOUNT_DRAWER, MENU_ACCOUNT_SETTINGS } from '@/user-account/user-account.constants';
import { STACK_PROFILE_TOP_RIGHT_NAVIGATION } from '@/profiles';
import AccountDrawer from './components/menus/AccountDrawer.vue';

export default () => {
  return {
    id: USER_ACCOUNT_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      'my-account': (locale: string) => import(`./locales/my-account.${locale}.json`),
      i18n: (locale: string) => import(`./locales/i18n.${locale}.json`),
    },
    routes: userAccountRoutes,
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
          moduleId: USER_ACCOUNT_MODULE_ID,
          icon: 'account',
          text: 'user-account.drawer.my-account',
          to: { name: 'MyAccountInfo' },
        },
      ]);
      registerMenuEntries(MENU_ACCOUNT_DRAWER, [
        {
          id: 'account-settings',
          sortOrder: 1500,
          moduleId: USER_ACCOUNT_MODULE_ID,
          icon: 'settings',
          text: 'user-account.drawer.settings',
          to: { name: 'AccountSettings' },
        },
      ]);

      registerMenuEntries(MENU_ACCOUNT_SETTINGS, [
        /*{
          id: 'account-general-settings',
          sortOrder: 1000,
          moduleId: USER_ACCOUNT_MODULE_ID,
          text: 'user-account.settings.general',
          to: { name: 'GeneralAccountSettings' },
        },*/
        {
          id: 'account-i18n-settings',
          sortOrder: 2000,
          moduleId: USER_ACCOUNT_MODULE_ID,
          text: 'user-account.settings.i18n',
          to: { name: 'LanguageAndRegionSettings' },
        },
      ]);
    },
  } as IModule;
};
