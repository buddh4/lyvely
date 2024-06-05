import { t, profilePath, LAYOUT_PROFILE_FULL } from '@lyvely/web';
import type { RouteRecordRaw } from 'vue-router';
import { AnalyticsFeature } from '@lyvely/analytics-interface';
import { ROUTE_ANALYTICS_HOME_NAME } from '@/analytics.constants';

export const analyticsRoutes = [
  {
    name: ROUTE_ANALYTICS_HOME_NAME,
    path: profilePath('/analytics'),
    meta: {
      i18n: { load: ['analytics'] },
      layout: LAYOUT_PROFILE_FULL,
      feature: AnalyticsFeature.id,
      title: () => t('analytics.title'),
    },
    component: () => import('../views/AnalyticsView.vue'),
  },
] as RouteRecordRaw[];
