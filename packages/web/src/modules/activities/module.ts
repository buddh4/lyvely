import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { registerContentType } from '@/modules/content-stream/components/content-stream-entry.registry';
import { ActivityType, HabitModel, TaskModel } from '@lyvely/common';
import TaskStreamEntry from '@/modules/activities/components/TaskStreamEntry.vue';
import HabitStreamEntry from '@/modules/activities/components/HabitStreamEntry.vue';
import HabitDetails from '@/modules/activities/components/HabitDetails.vue';
import TaskDetails from '@/modules/activities/components/TaskDetails.vue';
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
        streamEntryComponent: TaskStreamEntry,
        detailsComponent: TaskDetails,
      });
      registerContentType({
        type: ActivityType.Habit,
        name: translation('activities.habits.name'),
        icon: 'activity',
        feature: 'activities.habits',
        modelClass: HabitModel,
        streamEntryComponent: HabitStreamEntry,
        detailsComponent: HabitDetails,
      });
    },
  } as IModule;
};
