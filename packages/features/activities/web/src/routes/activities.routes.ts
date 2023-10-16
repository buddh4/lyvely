import { t, profileRoute } from '@lyvely/web';
import { useActivityStore } from '@/store';
import { RouteRecordRaw } from 'vue-router';

export default [];
/*
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
        component: () =>
          new Promise((resolve, reject) => {

              .catch(reject);
          }),
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
        beforeEnter: [() => useActivityStore().setActiveView('Milestones')],
      },
    ],
  },
] as RouteRecordRaw[];
*/
