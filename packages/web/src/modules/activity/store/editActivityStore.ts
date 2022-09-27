import { defineStore } from 'pinia';
import { ActivityType, getCreateModelByActivityType, UpdateHabitDto,
  UpdateTaskDto, getEditModelByActivity, ActivityModel,
  CalendarIntervalEnum, UpdateHabitResponseDto, EditTaskResponseDto, isTask } from '@lyvely/common';
import habitsRepository from '@server/modules/activity/repositories/habits.repository';
import tasksRepository from '@server/modules/activity/repositories/tasks.repository';
import { useTaskPlanStore } from "@server/modules/activity/store/taskPlanStore";
import { useHabitPlanStore } from "@server/modules/activity/store/habitPlanStore";
import { computed } from 'vue';
import { useProfileStore } from "@server/modules/profile/stores/profile.store";
import useEditModelStore from "@server/modules/common/stores/editModelStore";
import { findFocusable } from "@server/modules/ui/utils";

type EditModel = UpdateHabitDto|UpdateTaskDto;
type EditResponseModel = EditTaskResponseDto|UpdateHabitResponseDto;

export const useActivityEditStore = defineStore('activityEdit', () => {
  const state = useEditModelStore<EditModel, EditResponseModel>({
    repository: (editModel: EditModel) => editModel instanceof UpdateTaskDto ? tasksRepository : habitsRepository,
    onSubmitSuccess: (response?: EditResponseModel) => {
      if(response) {
        useProfileStore().updateTags(response.tags);
        if(isTask(response.model)) {
          useTaskPlanStore().addTask(response.model);
        } else {
          useHabitPlanStore().addHabit(response.model);
        }

        setTimeout(() => {
          // TODO: move to view...
          findFocusable(document.querySelector<HTMLElement>(`.calendar-plan-items [data-cid="${response.model.id}"]`))?.focus()
        })
      }
    },
  })

  const modalTitle = computed(() => {
    const type = ((state.model.value instanceof UpdateTaskDto) ? ActivityType.Task : ActivityType.Habit).toLowerCase();
    return (state.isCreate.value) ? `activities.${type}s.create.title` : `activities.${type}s.edit.title`
  });

  function setEditActivity(activity: ActivityModel) {
    const model = getEditModelByActivity(activity);
    model.tagNames = useProfileStore().getTags().filter(tag => activity.tagIds.includes(tag.id)).map(tag => tag.name);
    state.setEditModel(activity.id, model);
  }

  function setCreateActivity(type: ActivityType, interval = CalendarIntervalEnum.Daily) {
    const model = getCreateModelByActivityType(type);
    model.interval = interval;
    state.setCreateModel(model);
  }

  return {
    modalTitle,
    setEditActivity,
    setCreateActivity,
    ...state
  }
});
