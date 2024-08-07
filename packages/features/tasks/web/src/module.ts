import {
  IModule,
  registerContentType,
  MENU_PROFILE_DRAWER,
  useProfileFeatureStore,
  MENU_PROFILE_MOBILE_FOOTER,
} from '@lyvely/web';
import { registerMenuEntry } from '@lyvely/ui';
import {
  ActivityTasksFeature,
  CreateTaskModel,
  TaskModel,
  TASKS_MODULE_ID,
  TasksFeature,
  TaskPermissions,
} from '@lyvely/tasks-interface';
import { calendarPlanModule } from '@lyvely/calendar-plan-web';
import { tasksRoutes } from '@/routes';
import { ROUTE_TASKS_HOME_NAME } from '@/tasks.constants';

export default () => {
  return {
    id: TASKS_MODULE_ID,
    dependencies: [calendarPlanModule()],
    routes: tasksRoutes,
    permissions: TaskPermissions,
    icon: 'task',
    features: [TasksFeature, ActivityTasksFeature],
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    init: () => {
      registerMenuEntry(MENU_PROFILE_DRAWER, () => ({
        id: 'profile-tasks',
        moduleId: TASKS_MODULE_ID,
        text: 'tasks.title',
        feature: TasksFeature.id,
        sortOrder: 1520,
        icon: 'task',
        iconBindings: { class: 'w-6' },
        condition: !useProfileFeatureStore().isFeatureEnabled(ActivityTasksFeature.id),
        to: { name: 'Tasks' },
      }));

      registerMenuEntry(MENU_PROFILE_MOBILE_FOOTER, () => ({
        id: 'profile-tasks-footer',
        moduleId: TASKS_MODULE_ID,
        text: 'tasks.title',
        feature: TasksFeature.id,
        sortOrder: 1520,
        icon: 'task',
        iconBindings: { class: 'w-6' },
        condition: !useProfileFeatureStore().isFeatureEnabled(ActivityTasksFeature.id),
        to: { name: 'Tasks' },
      }));

      registerContentType({
        type: TaskModel.contentType,
        moduleId: TASKS_MODULE_ID,
        name: 'tasks.title',
        route: ROUTE_TASKS_HOME_NAME,
        feature: TasksFeature.id,
        modelClass: TaskModel,
        interfaces: {
          upsert: {
            createModel: CreateTaskModel,
            component: () => import('./components/modals/UpsertTaskModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/TaskDetails.vue'),
          },
        },
      });
    },
  } as IModule;
};
