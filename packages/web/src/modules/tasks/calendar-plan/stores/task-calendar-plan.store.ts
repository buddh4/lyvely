import { defineStore, storeToRefs } from 'pinia';
import {
  TaskModel,
  CalendarIntervalEnum,
  TaskFilter,
  TimeSeriesDataPointStore,
  toTimingId,
} from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlan, useCalendarPlanStore } from '@/modules/calendar-plan';
import { useTasksService } from '@/modules/tasks/common/services/tasks.service';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { useContentStore } from '@/modules/content/stores/content.store';
import { ref } from 'vue';

const MAX_DONE_TASKS = 2;

export const useTaskCalendarPlanStore = defineStore('taskCalendarPlan', () => {
  const { locale } = storeToRefs(useProfileStore());
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const tasksService = useTasksService();
  const dialog = useGlobalDialogStore();
  const contentStore = useContentStore();

  const taskPlan = useCalendarPlan<TaskModel, TaskFilter>({
    filter: new TaskFilter(),
    cache: new TimeSeriesDataPointStore<TaskModel>(),
    service: useTasksService(),
  });

  const { filter, cache, date } = taskPlan;

  const hasMore = ref<{ [key in CalendarIntervalEnum]: boolean }>({
    [CalendarIntervalEnum.Daily]: false,
    [CalendarIntervalEnum.Weekly]: false,
    [CalendarIntervalEnum.Monthly]: false,
    [CalendarIntervalEnum.Quarterly]: false,
    [CalendarIntervalEnum.Yearly]: false,
    [CalendarIntervalEnum.Unscheduled]: false,
  });

  contentStore.onContentCreated(TaskModel.contentType, addTask);
  contentStore.onContentUpdated(TaskModel.contentType, addTask);

  function getTasks(interval: CalendarIntervalEnum, showAll = false) {
    hasMore.value[interval] = false;
    const allTasks = cache.value.getModelsByIntervalFilter(
      interval,
      filter.value as TaskFilter,
      toTimingId(date.value, interval, locale.value),
    );

    const tasks: TaskModel[] = [];
    let doneCount = 0;
    allTasks.forEach((task) => {
      if (!task.done || doneCount++ < MAX_DONE_TASKS) {
        tasks.push(task);
      }
    });

    hasMore.value[interval] = doneCount > MAX_DONE_TASKS;

    return showAll ? allTasks : tasks;
  }

  function isHasMore(interval: CalendarIntervalEnum) {
    return hasMore.value[interval];
  }

  function addTask(task: TaskModel) {
    cache.value.setModel(new TaskModel(task));
  }

  async function setTaskDone(task: TaskModel) {
    try {
      const result = await tasksService.setDone(task.id, calendarPlanStore.date);
      task.done = result.done;
      task.meta.updatedAt = new Date();
      profileStore.updateScore(result.score);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function setTaskUndone(task: TaskModel) {
    try {
      const result = await tasksService.setUndone(task.id, calendarPlanStore.date);
      task.done = undefined;
      task.meta.updatedAt = new Date();
      profileStore.updateScore(result.score);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function startTimer(task: TaskModel) {
    try {
      task.timer = await tasksService.startTimer(task.id);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function stopTimer(task: TaskModel) {
    try {
      task.timer = await tasksService.stopTimer(task.id);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function updateTimer(task: TaskModel, value: number) {
    try {
      task.timer = await tasksService.updateTimer(task.id, value);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function setTaskSelection(task: TaskModel, val: boolean) {
    return val ? setTaskDone(task) : setTaskUndone(task);
  }

  return {
    ...taskPlan,
    getTasks,
    isHasMore,
    addTask,
    setTaskSelection,
    startTimer,
    stopTimer,
    updateTimer,
  };
});