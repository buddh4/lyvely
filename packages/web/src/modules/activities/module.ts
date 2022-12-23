import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { registerContentStreamEntryComponent } from '@/modules/content-stream/components/content-stream-entry.registry';
import { ActivityType } from '@lyvely/common';
import TaskStreamEntry from '@/modules/activities/components/TaskStreamEntry.vue';
import HabitStreamEntry from '@/modules/activities/components/HabitStreamEntry.vue';

export default () => {
  return {
    getId: () => 'activities',
    init: () => {
      registerContentStreamEntryComponent(ActivityType.Task, TaskStreamEntry);
      registerContentStreamEntryComponent(ActivityType.Habit, HabitStreamEntry);
    },
  } as IModule;
};
