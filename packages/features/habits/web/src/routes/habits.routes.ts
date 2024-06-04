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

export const habitRoutes = [
  {
    name: 'Habits',
    path: profilePath('/habits'),
    beforeEnter: [
      (to, from, next) => {
        if (useProfileFeatureStore().isFeatureEnabled(ActivityHabitsFeature.id)) {
          next(profilePathRoute('/activities/habits', useProfileStore().profile!.handle));
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
