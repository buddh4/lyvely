import {
  t,
  profilePath,
  profilePathRoute,
  LAYOUT_PROFILE,
  useProfileFeatureStore,
  useProfileStore,
} from '@lyvely/web';
import type { RouteRecordRaw } from 'vue-router';
import { ActivityHabitsFeature, HabitsFeature } from '@lyvely/habits-interface';
import { ROUTES_HABITS_HOME_NAME } from '@/habits.constants';

export const habitRoutes = [
  {
    name: ROUTES_HABITS_HOME_NAME,
    path: profilePath('/habits'),
    beforeEnter: [
      (to, from, next) => {
        if (useProfileFeatureStore().isFeatureEnabled(ActivityHabitsFeature.id)) {
          next(profilePathRoute(useProfileStore().profile!.handle, '/activities/habits'));
        }
        next();
      },
    ],
    meta: {
      i18n: { load: ['habits', 'calendar-plan'] },
      layout: LAYOUT_PROFILE,
      feature: HabitsFeature.id,
      title: () => t('habits.title'),
    },
    component: () => import('../views/HabitsView.vue'),
  },
] as RouteRecordRaw[];
