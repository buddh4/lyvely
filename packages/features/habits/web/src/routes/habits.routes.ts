import { t, profileRoute } from '@lyvely/web';
import { LAYOUT_ACTIVITIES, useActivityStore } from '@lyvely/activities-web';
import { RouteRecordRaw } from 'vue-router';

export const habitRoutes = [
  {
    name: 'Habits',
    path: profileRoute('/activities/habits'),
    meta: {
      i18n: { module: ['activities', 'habits'] },
      layout: LAYOUT_ACTIVITIES,
      title: () => t('habits.title'),
    },
    component: () => import('../views/HabitsView.vue'),
    beforeEnter: [() => useActivityStore().setActiveView('Habits')],
  },
] as RouteRecordRaw[];
