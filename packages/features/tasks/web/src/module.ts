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
} from '@lyvely/tasks-interface';
import { calendarPlanModule } from '@lyvely/calendar-plan-web';
import { tasksRoutes } from '@/routes';

export default () => {
  return {
    id: TASKS_MODULE_ID,
    dependencies: [calendarPlanModule()],
    routes: tasksRoutes,
    features: [TasksFeature, ActivityTasksFeature],
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    init: () => {
      const { isFeatureEnabled } = useProfileFeatureStore();
      registerMenuEntry(MENU_PROFILE_DRAWER, () => ({
        id: 'profile-tasks',
        moduleId: TASKS_MODULE_ID,
        text: 'tasks.title',
        features: TasksFeature.id,
        sortOrder: 1502,
        icon: 'task',
        iconBindings: { class: 'w-6' },
        condition: !isFeatureEnabled(ActivityTasksFeature.id),
        to: { name: 'Tasks' },
      }));

      registerMenuEntry(MENU_PROFILE_MOBILE_FOOTER, () => ({
        id: 'profile-tasks-footer',
        moduleId: TASKS_MODULE_ID,
        text: 'tasks.title',
        features: TasksFeature.id,
        sortOrder: 1502,
        icon: 'task',
        iconBindings: { class: 'w-6' },
        condition: !isFeatureEnabled(ActivityTasksFeature.id),
        to: { name: 'Tasks' },
      }));

      registerContentType({
        type: TaskModel.contentType,
        moduleId: TASKS_MODULE_ID,
        name: 'tasks.title',
        icon: 'task',
        feature: TasksFeature.id,
        modelClass: TaskModel,
        interfaces: {
          create: {
            mode: 'modal',
            modelClass: CreateTaskModel,
            component: () => import('./components/modals/EditTaskModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('./components/modals/EditTaskModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/TaskDetails.vue'),
            entry: () => import('./components/content-stream/TaskStreamEntry.vue'),
          },
        },
      });
    },
  } as IModule;
};
