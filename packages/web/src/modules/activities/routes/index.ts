import { translate } from '@/i18n';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';

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
          title: () => translate('activities.habits.title'),
        },
        component: () => import('../views/HabitPlanView.vue'),
      },
      {
        name: 'Tasks',
        path: 'tasks',
        meta: {
          title: () => translate('activities.tasks.title'),
        },
        component: () => import('../views/TaskPlanView.vue'),
      },
    ],
  },
];
