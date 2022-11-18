import { defineStore } from 'pinia';
import {
  ActivityType,
  getCreateModelByActivityType,
  UpdateTaskDto,
  CreateHabitDto,
  getEditModelByActivity,
  ActivityModel,
  CalendarIntervalEnum,
  UpdateHabitResponseDto,
  UpdateTaskResponseDto,
  isTask,
  CreateTaskDto,
} from '@lyvely/common';
import { useTaskPlanStore } from '@/modules/activities/store/task-plan.store';
import { useHabitPlanStore } from '@/modules/activities/store/habit-plan.store';
import { computed } from 'vue';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useUpdateModelStore } from '@/modules/common';
import { findFocusable } from '@/modules/ui/utils';
import { useHabitsService } from '@/modules/activities/services/habits.service';
import { useTasksService } from '@/modules/activities/services/tasks.service';

type EditModel = CreateTaskDto & CreateHabitDto;
type UpdateActivityResponse = UpdateTaskResponseDto | UpdateHabitResponseDto;

export const useUpdateActivityStore = defineStore('update-activity', () => {
  const habitsService = useHabitsService();
  const tasksService = useTasksService();

  const state = useUpdateModelStore<EditModel, UpdateActivityResponse>({
    service: (editModel: CreateTaskDto | CreateHabitDto) =>
      editModel instanceof UpdateTaskDto ? tasksService : habitsService,
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
            document.querySelector<HTMLElement>(`.calendar-plan-items [data-cid="${response.model.id}"]`),
          )?.focus();
        });
      }
    },
  });

  const modalTitle = computed(() => {
    const type = (state.model.value instanceof UpdateTaskDto ? ActivityType.Task : ActivityType.Habit).toLowerCase();
    return state.isCreate.value ? `activities.${type}s.create.title` : `activities.${type}s.edit.title`;
  });

  function setEditActivity(activity: ActivityModel) {
    const model = getEditModelByActivity(activity);
    model.tagNames = useProfileStore()
      .getTags()
      .filter((tag) => activity.tagIds.includes(tag.id))
      .map((tag) => tag.name);
    state.setEditModel(activity.id, model as EditModel);
  }

  function setCreateActivity(type: ActivityType, interval = CalendarIntervalEnum.Daily) {
    const model = getCreateModelByActivityType(type);
    model.interval = interval;
    state.setCreateModel(model as EditModel);
  }

  return {
    modalTitle,
    setEditActivity,
    setCreateActivity,
    ...state,
  };
});
