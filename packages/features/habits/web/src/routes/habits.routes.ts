import {
  t,
  profileRoute,
  LAYOUT_PROFILE,
  useProfileFeatureStore,
  useProfileStore,
} from '@lyvely/web';
import { RouteRecordRaw } from 'vue-router';
import { ActivityHabitsFeature } from '@lyvely/habits-interface';

export const habitRoutes = [
  {
    name: 'Habits',
    path: profileRoute('/habits'),
    beforeEnter: [
      (to, from, next) => {
        if (useProfileFeatureStore().isFeatureEnabled(ActivityHabitsFeature.id).value) {
          next(profileRoute('/activities/habits', useProfileStore().profile!.handle));
        }
        next();
      },
    ],
    meta: {
      i18n: { load: ['habits'] },
      layout: LAYOUT_PROFILE,
      title: () => t('habits.title'),
    },
    component: () => import('../views/HabitsView.vue'),
  },
] as RouteRecordRaw[];
