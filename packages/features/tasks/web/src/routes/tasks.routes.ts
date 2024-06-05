import {
  LAYOUT_PROFILE,
  profilePath,
  profilePathRoute,
  useProfileFeatureStore,
  useProfileStore,
} from '@lyvely/web';
import { RouteRecordRaw } from 'vue-router';
import { ActivityTasksFeature, TasksFeature } from '@lyvely/tasks-interface';

export const tasksRoutes: RouteRecordRaw[] = [
  {
    path: profilePath('/tasks'),
    name: 'Tasks',
    beforeEnter: [
      (to, from, next) => {
        if (useProfileFeatureStore().isFeatureEnabled(ActivityTasksFeature.id)) {
          next(profilePathRoute(useProfileStore().profile!.handle, '/activities/tasks'));
        }
        next();
      },
    ],
    component: () => import('../views/TasksView.vue'),
    meta: {
      i18n: { load: ['calendar-plan'] },
      layout: LAYOUT_PROFILE,
      feature: TasksFeature.id,
    },
  },
];
