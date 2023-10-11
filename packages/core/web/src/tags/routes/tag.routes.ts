import { translation } from '@/i18n';
import { profileRoute } from '@/profiles/routes/profile-route.util';
import { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: profileRoute('/tags'),
    name: 'Tags',
    meta: {
      layout: 'profile',
      title: translation('tags.title'),
    },
    component: () => import('../views/ProfileTagsView.vue'),
  },
] as Array<RouteRecordRaw>;
