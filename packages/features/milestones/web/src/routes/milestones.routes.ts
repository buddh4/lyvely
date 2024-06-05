import {
  t,
  profilePathRoute,
  profilePath,
  LAYOUT_PROFILE,
  useProfileFeatureStore,
  useProfileStore,
} from '@lyvely/web';
import { RouteRecordRaw } from 'vue-router';
import { ActivityMilestonesFeature, MilestonesFeature } from '@lyvely/milestones-interface';
import { ROUTE_MILESTONES_HOME_NAME } from '@/milestones.constants';

export const milestoneRoutes = [
  {
    name: ROUTE_MILESTONES_HOME_NAME,
    path: profilePath('/milestones'),
    beforeEnter: [
      (to, from, next) => {
        if (useProfileFeatureStore().isFeatureEnabled(ActivityMilestonesFeature.id)) {
          next(profilePathRoute(useProfileStore().profile!.handle, '/activities/milestones'));
        }
        next();
      },
    ],
    meta: {
      i18n: { load: ['milestones', 'calendar-plan'] },
      feature: MilestonesFeature.id,
      layout: LAYOUT_PROFILE,
      title: () => t('milestones.title'),
    },
    component: () => import('../views/MilestonesView.vue'),
  },
] as RouteRecordRaw[];
