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
          title: translation('user-accounts.myAccountInfo.title'),
        },
        component: () => import('../views/MyAccountInfoView.vue'),
      },
    ],
  },
];
