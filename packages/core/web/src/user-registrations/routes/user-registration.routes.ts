import { ifNotAuthenticated } from '@/auth';
import { translation } from '@/i18n';
import { PATH_SIGN_UP, PATH_VERIFY_EMAIL } from '../user-registration.constants';
import { LAYOUT_INTRO } from '@/ui';

export const userRegistrationRoutes = [
  {
    path: PATH_SIGN_UP,
    name: 'Register',
    meta: {
      isPublic: true,
      profileView: false,
      layout: LAYOUT_INTRO,
      title: translation('user-registrations.title'),
      i18n: { load: ['user-registrations'] },
    },
    component: () => import('../views/SignUpView.vue'),
    beforeEnter: [ifNotAuthenticated],
  },
  {
    path: PATH_VERIFY_EMAIL,
    name: 'VerifyEmail',

    meta: {
      isPublic: true,
      profileView: false,
      layout: LAYOUT_INTRO,
      title: translation('user-registrations.verify_email.title'),
      i18n: { load: ['user-registrations', 'otp'] },
    },
    component: () => import('../views/VerifyEmailView.vue'),
    beforeEnter: [ifNotAuthenticated],
  },
];
