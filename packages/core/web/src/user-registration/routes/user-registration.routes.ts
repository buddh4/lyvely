import { ifNotAuthenticated } from '@/auth';
import { translation } from '@/i18n';
import { PATH_SIGN_UP, PATH_VERIFY_EMAIL } from '../user-registration.constants';
import { LAYOUT_INTRO } from '@/ui';
import { ProfileVisibilityLevel } from '@lyvely/interface';

export const userRegistrationRoutes = [
  {
    path: PATH_SIGN_UP,
    name: 'Register',
    meta: {
      isPublic: true,
      layout: LAYOUT_INTRO,
      title: translation('user-registration.title'),
      i18n: { load: ['user-registration'] },
    },
    component: () => import('../views/SignUpView.vue'),
    beforeEnter: [ifNotAuthenticated],
  },
  {
    path: PATH_VERIFY_EMAIL,
    name: 'VerifyEmail',

    meta: {
      visibility: ProfileVisibilityLevel.Visitor,
      isPublic: true,
      profileView: false,
      layout: LAYOUT_INTRO,
      title: translation('user-registration.verify_email.title'),
      i18n: { load: ['user-registration', 'otp'] },
    },
    component: () => import('../views/VerifyEmailView.vue'),
    beforeEnter: [ifNotAuthenticated],
  },
];
