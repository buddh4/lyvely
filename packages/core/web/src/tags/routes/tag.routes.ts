import { translation } from '@/i18n';
import { profilePath } from '@/profiles';
import { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: profilePath('/tags'),
    name: 'Tags',
    meta: {
      layout: 'profile',
      title: translation('tags.title'),
    },
    component: () => import('../views/ProfileTagsView.vue'),
  },
] as Array<RouteRecordRaw>;
