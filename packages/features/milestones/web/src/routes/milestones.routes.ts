import {
  t,
  profileRoute,
  profilePath,
  LAYOUT_PROFILE,
  useProfileFeatureStore,
  useProfileStore,
} from '@lyvely/web';
import { RouteRecordRaw } from 'vue-router';
import { ActivityMilestonesFeature } from '@lyvely/milestones-interface';

export const milestoneRoutes = [
  {
    name: 'Milestones',
    path: profilePath('/milestones'),
    beforeEnter: [
      (to, from, next) => {
        if (useProfileFeatureStore().isFeatureEnabled(ActivityMilestonesFeature.id).value) {
          next(profileRoute('/activities/milestones', useProfileStore().profile!.handle));
        }
        next();
      },
    ],
    meta: {
      i18n: { load: ['milestones'] },
      layout: LAYOUT_PROFILE,
      title: () => t('milestones.title'),
    },
    component: () => import('../views/MilestonesView.vue'),
  },
] as RouteRecordRaw[];
