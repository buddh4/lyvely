import { translation } from '@/i18n';
import { profileRoute, loadProfile } from '@/profiles';
import { RouteRecordRaw } from 'vue-router';

export const FeatureRoutes = [
  {
    path: profileRoute('/settings/features'),
    name: 'ProfileFeatureSettings',
    meta: {
      layout: 'profile',
      title: translation('features.settings.title'),
    },
    component: () => import('../views/ProfileFeatureSettings.vue'),
    beforeEnter: [loadProfile],
  },
] as Array<RouteRecordRaw>;
