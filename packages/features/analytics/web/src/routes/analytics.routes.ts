import { t, profilePath, LAYOUT_PROFILE_FULL } from '@lyvely/web';
import type { RouteRecordRaw } from 'vue-router';

export const analyticsRoutes = [
  {
    name: 'Analytics',
    path: profilePath('/analytics'),
    meta: {
      i18n: { load: ['analytics'] },
      layout: LAYOUT_PROFILE_FULL,
      title: () => t('analytics.title'),
    },
    component: () => import('../views/AnalyticsView.vue'),
  },
] as RouteRecordRaw[];
