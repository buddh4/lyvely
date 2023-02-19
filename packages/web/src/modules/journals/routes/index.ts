import { translation } from '@/i18n';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';

export default [
  {
    path: profileRoute('/journals'),
    name: 'Journals',
    meta: {
      layout: 'profile',
      title: translation('journals.title'),
    },
    component: () => import('../views/Journals.vue'),
  },
];
