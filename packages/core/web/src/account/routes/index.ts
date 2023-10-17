import { translation } from '@/i18n';

export default [
  {
    name: 'MyAccount',
    path: '/account',
    component: () => import('../views/my-account/MyAccountView.vue'),
    meta: {
      layout: 'profile',
    },
    children: [
      {
        name: 'MyAccountInfo',
        path: '',
        meta: {
          title: translation('account.myAccountInfo.title'),
          profileView: false,
        },
        component: () => import('../views/my-account/MyAccountInfoView.vue'),
      },
    ],
  },
];
