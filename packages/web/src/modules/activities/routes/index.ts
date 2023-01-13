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
          i18n: { module: 'activities' },
          layout: 'profile',
          title: () => translate('activities.habits.title'),
        },
        component: () => import('../views/HabitPlanView.vue'),
        beforeEnter: [() => useActivityStore().setActiveView('Habits')],
      },
      {
        name: 'Tasks',
        path: 'tasks',
        meta: {
          i18n: { module: 'activities' },
          layout: 'profile',
          title: () => translate('activities.tasks.title'),
        },
        component: () => import('../views/TaskPlanView.vue'),
        beforeEnter: [() => useActivityStore().setActiveView('Tasks')],
      },
    ],
  },
];
