import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { registerContentType } from '@/modules/content-stream/components/content-stream-entry.registry';
import {
  ActivityType,
  CreateHabitModel,
  CreateTaskModel,
  HabitModel,
  TaskModel,
} from '@lyvely/common';
import { translation } from '@/i18n';

export default () => {
  return {
    getId: () => 'activities',
    init: () => {
      registerContentType({
        type: ActivityType.Task,
        modelClass: TaskModel,
        name: translation('activities.tasks.name'),
        icon: 'task',
        feature: 'activities.tasks',
        interfaces: {
          create: {
            mode: 'modal',
            modelClass: CreateTaskModel,
            component: () => import('../tasks/components/modals/EditTaskModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('../tasks/components/modals/EditTaskModal.vue'),
          },
          stream: {
            details: () => import('../tasks/components/stream/TaskDetails.vue'),
            entry: () => import('../tasks/components/stream/TaskStreamEntry.vue'),
          },
        },
      });
      registerContentType({
        type: ActivityType.Habit,
        name: translation('activities.habits.name'),
        icon: 'activity',
        feature: 'activities.habits',
        modelClass: HabitModel,
        interfaces: {
          create: {
            mode: 'modal',
            modelClass: CreateHabitModel,
            component: () => import('../habits/components/modals/EditHabitModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('../habits/components/modals/EditHabitModal.vue'),
          },
          stream: {
            details: () => import('../habits/components/stream/HabitDetails.vue'),
            entry: () => import('../habits/components/stream/HabitStreamEntry.vue'),
          },
        },
      });
    },
  } as IModule;
};
