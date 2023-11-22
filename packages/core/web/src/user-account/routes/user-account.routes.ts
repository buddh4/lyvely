import { translation } from '@/i18n';
import { USER_ACCOUNT_MODULE_ID } from '@lyvely/interface';

export const userAccountRoutes = [
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
            load: [{ module: USER_ACCOUNT_MODULE_ID, section: 'my-account' }, 'otp'],
          },
          title: translation('user-account.my-account.title'),
        },
        component: () => import('../views/MyAccountInfoView.vue'),
      },
    ],
  },
  {
    name: 'AccountSettings',
    path: '/account-settings',
    redirect: { name: 'GeneralAccountSettings' },
    component: () => import('../layouts/AccountSettingsLayout.vue'),
    meta: {
      layout: 'profile',
    },
    children: [
      {
        name: 'GeneralAccountSettings',
        path: 'general',
        meta: {
          i18n: {
            load: [{ module: USER_ACCOUNT_MODULE_ID, section: 'i18n' }],
          },
          title: translation('user-account.settings.i18n'),
        },
        component: () => import('../views/GeneralSettings.vue'),
      },
      {
        name: 'LanguageAndRegionSettings',
        path: 'language',
        meta: {
          i18n: {
            load: [{ module: USER_ACCOUNT_MODULE_ID, section: 'i18n' }],
          },
          title: translation('user-account.settings.i18n'),
        },
        component: () => import('../views/LanguageAndRegionSettings.vue'),
      },
    ],
  },
];
