import { translation } from '@/i18n';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';

export default [
  {
    path: profileRoute('/stream'),
    name: 'Stream',
    meta: {
      layout: 'profile-xl',
      title: translation('stream.title'),
    },
    component: () => import('../views/ContentStreamView.vue'),
  },
];
