import { IModule, translation, registerContentType } from '@lyvely/web';
import { CreateTaskModel, TaskModel } from '@lyvely/tasks-interface';
import { timeSeriesModule } from '@lyvely/time-series-web';

export default () => {
  return {
    getId: () => 'tasks',
    dependencies: [timeSeriesModule()],
    init: () => {
      registerContentType({
        type: TaskModel.contentType,
        name: translation('tasks.name'),
        icon: 'task',
        feature: 'tasks',
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
