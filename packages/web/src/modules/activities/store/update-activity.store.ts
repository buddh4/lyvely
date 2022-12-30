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
  const habitsService = useHabitsService();
  const tasksService = useTasksService();

  const state = useUpdateModelStore<UpdateActivityResponse, CreateModel, UpdateModel>({
    service: <any>(
      ((editModel: CreateModel) =>
        editModel instanceof CreateTaskModel ? tasksService : habitsService)
    ),
    onSubmitSuccess(response?: UpdateActivityResponse) {
      if (response) {
        useProfileStore().updateTags(response.tags);
        if (isTask(response.model)) {
          useTaskPlanStore().addTask(response.model);
        } else {
          useHabitPlanStore().addHabit(response.model);
        }

        setTimeout(() => {
          // TODO: move to view...
          findFocusable(
            document.querySelector<HTMLElement>(
              `.calendar-plan-items [data-cid="${response.model.id}"]`,
            ),
          )?.focus();
        });
      }
    },
  });

  function setEditActivity(activity: ActivityModel) {
    const model = activity.getEditDto();
    model.tagNames = useProfileStore()
      .getTags()
      .filter((tag) => activity.tagIds.includes(tag.id))
      .map((tag) => tag.name);
    state.setEditModel(activity.id, model as CreateModel);
  }

  function setCreateActivity(type: ActivityType, interval = CalendarIntervalEnum.Daily) {
    const model = getCreateModelByActivityType(type);
    model.interval = interval;
    state.setCreateModel(model as CreateModel);
  }

  return {
    setEditActivity,
    setCreateActivity,
    ...state,
  };
});
