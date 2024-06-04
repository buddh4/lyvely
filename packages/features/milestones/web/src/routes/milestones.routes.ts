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

export const milestoneRoutes = [
  {
    name: 'Milestones',
    path: profilePath('/milestones'),
    beforeEnter: [
      (to, from, next) => {
        if (useProfileFeatureStore().isFeatureEnabled(ActivityMilestonesFeature.id)) {
          next(profilePathRoute('/activities/milestones', useProfileStore().profile!.handle));
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
