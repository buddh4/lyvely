import { LAYOUT_PROFILE, profileRoute, useProfileFeatureStore, useProfileStore } from '@lyvely/web';
import { RouteRecordRaw } from 'vue-router';
import { ActivityTasksFeature } from '@lyvely/tasks-interface';

export const tasksRoutes: RouteRecordRaw[] = [
  {
    path: profileRoute('/tasks'),
    name: 'Tasks',
    beforeEnter: [
      (to, from, next) => {
        if (useProfileFeatureStore().isFeatureEnabled(ActivityTasksFeature.id).value) {
          next(profileRoute('/activities/tasks', useProfileStore().profile!.id));
        }
        next();
      },
    ],
    component: () => import('../views/TasksView.vue'),
    meta: {
      layout: LAYOUT_PROFILE,
    },
  },
];