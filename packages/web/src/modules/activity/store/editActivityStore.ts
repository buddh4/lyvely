import { defineStore } from 'pinia';
import { ActivityType, getCreateModelByActivityType, EditHabitDto,
  EditTaskDto, getEditModelByActivity, IActivity,
  CalendarIntervalEnum   , EditHabitResponseDto, EditTaskResponseDto, isTask } from '@lyvely/common';
import habitsRepository from '@/modules/activity/repositories/habits.repository';
import tasksRepository from '@/modules/activity/repositories/tasks.repository';
import { useTaskPlanStore } from "@/modules/activity/store/taskPlanStore";
import { useHabitPlanStore } from "@/modules/activity/store/habitPlanStore";
import { computed } from 'vue';
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import useEditModelStore from "@/modules/common/stores/editModelStore";

type EditModel = EditHabitDto|EditTaskDto;
type EditResponseModel = EditTaskResponseDto|EditHabitResponseDto;

export const useActivityEditStore = defineStore('activityEdit', () => {
  const state = useEditModelStore<EditModel, EditResponseModel>({
    repository: (editModel: EditModel) => {
      return editModel instanceof EditTaskDto ? tasksRepository : habitsRepository;
    },
    onSubmitSuccess: (response?: EditResponseModel) => {
      if(response) {
        useProfileStore().updateTags(response.tags);
        if(isTask(response.model)) {
          useTaskPlanStore().addTask(response.model);
        } else {
          useHabitPlanStore().addHabit(response.model);
        }
      }

    },
  })

  const modalTitle = computed(() => {
    const type = ((state.model.value instanceof EditTaskDto) ? ActivityType.Task : ActivityType.Habit).toLowerCase();
    return (state.isCreate.value) ? `activities.${type}s.create.title` : `activities.${type}s.edit.title`
  });

  function setEditActivity(activity: IActivity) {
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
