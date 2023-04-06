import { translate } from '@/i18n';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { useActivityStore } from '@/modules/activities/store/activity.store';

export default [
  {
    name: 'Activities',
    path: profileRoute('/activities'),
    component: () => import('../views/ActivityLayout.vue'),
    meta: {
      i18n: { module: 'activities' },
      layout: 'profile',
    },
    children: [
      {
        name: 'Habits',
        path: '',
        meta: {
          i18n: { module: 'habits' },
          layout: 'profile',
          title: () => translate('habits.title'),
        },
        component: () => import('../../habits/calendar-plan/components/HabitCalendarPlan.vue'),
        beforeEnter: [() => useActivityStore().setActiveView('Habits')],
      },
      {
        name: 'Tasks',
        path: 'tasks',
        meta: {
          i18n: { module: 'tasks' },
          layout: 'profile',
          title: () => translate('tasks.title'),
        },
        component: () => import('../../tasks/components/calendar-plan/TaskCalendarPlan.vue'),
        beforeEnter: [() => useActivityStore().setActiveView('Tasks')],
      },
    ],
  },
];
