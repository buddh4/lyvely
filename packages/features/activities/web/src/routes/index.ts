import { t, profileRoute } from '@lyvely/web';
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
          title: () => t('habits.title'),
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
          title: () => t('tasks.title'),
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
          title: () => t('milestones.title'),
        },
        component: () =>
          import('../../milestones/components/calendar-plan/MilestoneCalendarPlan.vue'),
        beforeEnter: [() => useActivityStore().setActiveView('Milestones')],
      },
    ],
  },
];
