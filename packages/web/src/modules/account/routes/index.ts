import { translation } from '@/i18n';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';

export default [
  {
    name: 'MyAccount',
    path: profileRoute('/account'),
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
        },
        component: () => import('../views/my-account/MyAccountInfoView.vue'),
      },
    ],
  },
];
