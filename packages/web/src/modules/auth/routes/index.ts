import { ifNotAuthenticated } from '../guards';
import { translate } from '@lyvely/i18n';
import { RouteLocation } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { PATH_RESET_PASSWORD, PATH_LOGIN, PATH_LOGOUT } from './paths';
import { useResetPasswordStore } from '@/modules/auth/store/reset-password.store';

export default [
  {
    path: PATH_LOGIN,
    name: 'Login',
    meta: {
      title: () => translate('auth.login.title'),
    },
    component: () => import('../views/LoginView.vue'),
    beforeEnter: [ifNotAuthenticated],
  },
  {
    path: PATH_RESET_PASSWORD,
    name: 'ResetPassword',
    meta: {
      title: () => translate('auth.reset_password.title'),
      isPublic: true,
    },
    component: () => import('../views/ResetPasswordView.vue'),
    beforeEnter: [
      ifNotAuthenticated,
      (route: RouteLocation) => {
        const token = route.query.t || '';
        useResetPasswordStore().setToken(token as string);
      },
    ],
  },
  {
    path: PATH_LOGOUT,
    name: 'Logout',
    beforeEnter: [() => useAuthStore().logout()],
  },
];
