import { translate } from '@lyvely/i18n';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { useActivityStore } from '@/modules/activities/store/activity.store';

export default [
  {
    name: 'Activities',
    path: profileRoute('/activities'),
    component: () => import('../views/ActivityLayout.vue'),
    meta: {
      layout: 'profile',
    },
    children: [
      {
        name: 'Habits',
        path: '',
        meta: {
          i18n: { module: ['activities', 'habits'] },
          layout: 'profile',
          title: () => translate('habits.title'),
        },
        component: () => import('../../habits/components//calendar-plan/HabitCalendarPlan.vue'),
        beforeEnter: [() => useActivityStore().setActiveView('Habits')],
      },
      {
        name: 'Tasks',
        path: 'tasks',
        meta: {
          i18n: { module: ['activities', 'habits'] },
          layout: 'profile',
          title: () => translate('tasks.title'),
        },
        component: () => import('../../tasks/components/calendar-plan/TaskCalendarPlan.vue'),
        beforeEnter: [() => useActivityStore().setActiveView('Tasks')],
      },
      {
        name: 'Milestones',
        path: 'milestones',
        meta: {
          i18n: { module: ['activities', 'milestones'] },
          layout: 'profile',
          title: () => translate('milestones.title'),
        },
        component: () =>
          import('../../milestones/components/calendar-plan/MilestoneCalendarPlan.vue'),
        beforeEnter: [() => useActivityStore().setActiveView('Milestones')],
      },
    ],
  },
];
