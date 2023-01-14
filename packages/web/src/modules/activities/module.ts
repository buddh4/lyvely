import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { registerContentType } from '@/modules/content-stream/components/content-stream-entry.registry';
import { ActivityType, HabitModel, TaskModel } from '@lyvely/common';
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
        stream: {
          details: () => import('./components/stream/TaskDetails.vue'),
          streamEntry: () => import('./components/stream/TaskStreamEntry.vue'),
        },
      });
      registerContentType({
        type: ActivityType.Habit,
        name: translation('activities.habits.name'),
        icon: 'activity',
        feature: 'activities.habits',
        modelClass: HabitModel,
        stream: {
          details: () => import('./components/stream/HabitDetails.vue'),
          streamEntry: () => import('./components/stream/HabitStreamEntry.vue'),
        },
      });
    },
  } as IModule;
};
