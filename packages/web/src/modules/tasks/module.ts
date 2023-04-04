import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { registerContentType } from '@/modules/content-stream/components/content-stream-entry.registry';
import { CreateTaskModel, TaskModel } from '@lyvely/common';
import { translation } from '@/i18n';

export default () => {
  return {
    getId: () => 'tasks',
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
            component: () => import('./common/components/modals/EditTaskModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('./common/components/modals/EditTaskModal.vue'),
          },
          stream: {
            details: () => import('./stream/components/TaskDetails.vue'),
            entry: () => import('./stream/components/TaskStreamEntry.vue'),
          },
        },
      });
    },
  } as IModule;
};
