import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { registerContentType } from '@/modules/content-stream/components/content-stream-entry.registry';
import { ActivityType, HabitModel, TaskModel } from '@lyvely/common';
import TaskStreamEntry from '@/modules/activities/components/TaskStreamEntry.vue';
import HabitStreamEntry from '@/modules/activities/components/HabitStreamEntry.vue';
import HabitDetails from '@/modules/activities/components/HabitDetails.vue';
import TaskDetails from '@/modules/activities/components/TaskDetails.vue';

export default () => {
  return {
    getId: () => 'activities',
    init: () => {
      registerContentType({
        type: ActivityType.Task,
        modelClass: TaskModel,
        streamEntryComponent: TaskStreamEntry,
        detailsComponent: TaskDetails,
      });
      registerContentType({
        type: ActivityType.Habit,
        modelClass: HabitModel,
        streamEntryComponent: HabitStreamEntry,
        detailsComponent: HabitDetails,
      });
    },
  } as IModule;
};
