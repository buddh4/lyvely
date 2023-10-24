import { ifNotAuthenticated } from '@/auth';
import { translation } from '@/i18n';
import { PATH_REGISTER, PATH_VERIFY_EMAIL } from '../user-registration.constants';
import { LAYOUT_INTRO } from '@/ui';

export const userRegistrationRoutes = [
  {
    path: PATH_REGISTER,
    name: 'Register',
    meta: {
      isPublic: true,
      profileView: false,
      layout: LAYOUT_INTRO,
      title: translation('user_registration.title'),
    },
    component: () => import('../views/UserRegistrationView.vue'),
    beforeEnter: [ifNotAuthenticated],
  },
  {
    path: PATH_VERIFY_EMAIL,
    name: 'VerifyEmail',

    meta: {
      isPublic: true,
      profileView: false,
      layout: LAYOUT_INTRO,
      title: translation('user_registration.verify_email.title'),
    },
    component: () => import('../views/VerifyEmailView.vue'),
    beforeEnter: [ifNotAuthenticated],
  },
];
