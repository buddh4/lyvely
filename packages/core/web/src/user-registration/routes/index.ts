import { ifNotAuthenticated } from '@/auth';
import { translation } from '@/i18n';
import { PATH_REGISTER, PATH_VERIFY_EMAIL } from './paths';

export default [
  {
    path: PATH_REGISTER,
    name: 'Register',
    component: () => import('../views/UserRegistrationView.vue'),
    meta: {
      isPublic: true,
      title: translation('user_registration.title'),
    },
    beforeEnter: [ifNotAuthenticated],
  },
  {
    path: PATH_VERIFY_EMAIL,
    name: 'VerifyEmail',
    component: () => import('../views/VerifyEmailView.vue'),
    meta: {
      isPublic: true,
      title: translation('user_registration.verify_email.title'),
    },
    beforeEnter: [ifNotAuthenticated],
  },
];
