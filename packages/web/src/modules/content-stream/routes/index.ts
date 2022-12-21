import { translation } from '@/i18n';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';

export default [
  {
    path: profileRoute('/stream'),
    name: 'Stream',
    meta: {
      layout: 'profile_xl',
      layoutProps: { padding: 'p-0.5 pb-5 pt-1 md:px-6 md:pb-6' },
      title: translation('stream.title'),
    },
    component: () => import('../views/ContentStreamView.vue'),
  },
];
