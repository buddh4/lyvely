import {
  LAYOUT_PROFILE,
  profilePath,
  profilePathRoute,
  useProfileFeatureStore,
  useProfileStore,
} from '@lyvely/web';
import { RouteRecordRaw } from 'vue-router';
import { ActivityTasksFeature } from '@lyvely/tasks-interface';

export const tasksRoutes: RouteRecordRaw[] = [
  {
    path: profilePath('/tasks'),
    name: 'Tasks',
    beforeEnter: [
      (to, from, next) => {
        if (useProfileFeatureStore().isFeatureEnabled(ActivityTasksFeature.id)) {
          next(profilePathRoute('/activities/tasks', useProfileStore().profile!.handle));
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
