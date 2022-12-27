import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import {
  registerContentDetailsComponent,
  registerContentStreamEntryComponent,
} from '@/modules/content-stream/components/content-stream-entry.registry';
import { ActivityType } from '@lyvely/common';
import TaskStreamEntry from '@/modules/activities/components/TaskStreamEntry.vue';
import HabitStreamEntry from '@/modules/activities/components/HabitStreamEntry.vue';
import HabitDetails from '@/modules/activities/components/HabitDetails.vue';
import TaskDetails from '@/modules/activities/components/TaskDetails.vue';

export default () => {
  return {
    getId: () => 'activities',
    init: () => {
      registerContentStreamEntryComponent(ActivityType.Task, TaskStreamEntry);
      registerContentStreamEntryComponent(ActivityType.Habit, HabitStreamEntry);
      registerContentDetailsComponent(ActivityType.Habit, HabitDetails);
      registerContentDetailsComponent(ActivityType.Task, TaskDetails);
    },
  } as IModule;
};
