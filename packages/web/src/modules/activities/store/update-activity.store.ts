import { defineStore } from 'pinia';
import {
  ActivityType,
  getCreateModelByActivityType,
  UpdateTaskModel,
  CreateHabitModel,
  ActivityModel,
  CalendarIntervalEnum,
  UpdateHabitResponse,
  UpdateTaskResponse,
  isTask,
  CreateTaskModel,
  UpdateHabitModel,
} from '@lyvely/common';
import { useTaskPlanStore } from '@/modules/activities/store/task-plan.store';
import { useHabitPlanStore } from '@/modules/activities/store/habit-plan.store';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useUpdateModelStore } from '@/modules/common';
import { findFocusable } from '@/modules/ui/utils';
import { useHabitsService } from '@/modules/activities/services/habits.service';
import { useTasksService } from '@/modules/activities/services/tasks.service';

type CreateModel = CreateTaskModel | CreateHabitModel;
type UpdateModel = UpdateTaskModel | UpdateHabitModel;
type UpdateActivityResponse = UpdateTaskResponse & UpdateHabitResponse;

export const useUpdateActivityStore = defineStore('update-activity', () => {
  return {
    setEditActivity,
    setCreateActivity,
    ...state,
  };
});
