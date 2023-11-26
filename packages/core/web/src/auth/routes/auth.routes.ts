import { ifNotAuthenticated } from '../guards';
import { translate } from '@/i18n';
import { RouteLocation, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/auth/store/auth.store';
import { PATH_RESET_PASSWORD, PATH_LOGIN, PATH_LOGOUT } from '../auth.constants';
import { useResetPasswordStore } from '@/auth/store/reset-password.store';
import { LAYOUT_INTRO } from '@/ui';
import { profilePath } from '@/profiles';

export default [
  {
    path: '/',
    name: 'Root',
    redirect: profilePath(),
    beforeEnter: [
      (to, from, next) => {
        if (!useAuthStore().isAuthenticated) {
          next({ name: 'Login' });
        } else {
          next();
        }
      },
    ],
  },
  {
    path: PATH_LOGIN,
    name: 'Login',
    meta: {
      title: () => translate('auth.login.title'),
      profileView: false,
      layout: LAYOUT_INTRO,
      i18n: { load: [{ module: 'auth', section: 'login' }] },
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
      profileView: false,
      layout: LAYOUT_INTRO,
      i18n: { load: [{ module: 'auth', section: 'reset-password' }] },
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
    profileView: false,
    beforeEnter: [async () => await useAuthStore().logout()],
  },
] as Array<RouteRecordRaw>;
