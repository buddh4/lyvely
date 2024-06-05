import {
  LAYOUT_PROFILE,
  profilePath,
  profilePathRoute,
  useProfileFeatureStore,
  useProfileStore,
} from '@lyvely/web';
import { RouteRecordRaw } from 'vue-router';
import { ActivityTasksFeature, TasksFeature } from '@lyvely/tasks-interface';
import { ROUTE_TASKS_HOME_NAME } from '@/tasks.constants';

export const tasksRoutes: RouteRecordRaw[] = [
  {
    path: profilePath('/tasks'),
    name: ROUTE_TASKS_HOME_NAME,
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
