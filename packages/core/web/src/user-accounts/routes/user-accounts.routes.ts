import { translation } from '@/i18n';
import { USER_ACCOUNTS_MODULE_ID } from '@lyvely/core-interface';

export const userAccountsRoutes = [
  {
    name: 'MyAccount',
    path: '/account',
    component: () => import('../layouts/MyAccountLayout.vue'),
    meta: {
      layout: 'profile',
    },
    children: [
      {
        name: 'MyAccountInfo',
        path: '',
        meta: {
          i18n: {
            load: [{ module: USER_ACCOUNTS_MODULE_ID, section: 'my-account' }, 'otp'],
          },
          title: translation('user-accounts.my-account.title'),
        },
        component: () => import('../views/MyAccountInfoView.vue'),
      },
    ],
  },
  {
    name: 'AccountSettings',
    path: '/account-settings',
    component: () => import('../layouts/AccountSettingsLayout.vue'),
    meta: {
      layout: 'profile',
    },
    children: [
      {
        name: 'LanguageAndRegionSettings',
        path: '/account-settings/language',
        meta: {
          i18n: {
            load: [{ module: USER_ACCOUNTS_MODULE_ID, section: 'i18n' }],
          },
          title: translation('user-accounts.settings.i18n'),
        },
        component: () => import('../views/LanguageAndRegionSettings.vue'),
      },
    ],
  },
];
