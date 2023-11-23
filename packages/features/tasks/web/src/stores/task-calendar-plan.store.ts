import { defineStore, storeToRefs } from 'pinia';
import {
  TaskModel,
  TaskFilter,
  TaskCalendarPlanStore,
  useTasksClient,
} from '@lyvely/tasks-interface';
import { CalendarInterval, toTimingId } from '@lyvely/dates';
import { useProfileStore, useGlobalDialogStore } from '@lyvely/web';
import { useCalendarPlan, useCalendarPlanStore } from '@lyvely/calendar-plan-web';
import { ref } from 'vue';

const MAX_DONE_TASKS = 2;

export const useTaskCalendarPlanStore = defineStore('taskCalendarPlan', () => {
  const { locale } = storeToRefs(useProfileStore());
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const client = useTasksClient();
  const dialog = useGlobalDialogStore();

  const taskPlan = useCalendarPlan<TaskModel, TaskFilter>({
    filter: new TaskFilter(),
    cache: new TaskCalendarPlanStore(),
    contentTypes: [TaskModel.contentType],
    client: useTasksClient(),
  });

  const { filter, cache, date } = taskPlan;

  const hasMore = ref<{ [key in CalendarInterval]: boolean }>({
    [CalendarInterval.Daily]: false,
    [CalendarInterval.Weekly]: false,
    [CalendarInterval.Monthly]: false,
    [CalendarInterval.Quarterly]: false,
    [CalendarInterval.Yearly]: false,
    [CalendarInterval.Unscheduled]: false,
  });

  function getTasks(interval: CalendarInterval, showAll = false) {
    hasMore.value[interval] = false;
    const allTasks = cache.value.getModelsByIntervalFilter(
      interval,
      filter.value as TaskFilter,
      toTimingId(date.value, interval, locale.value, profileStore.getSetting('calendar')),
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

  function isHasMore(interval: CalendarInterval) {
    return hasMore.value[interval];
  }

  async function setTaskDone(task: TaskModel) {
    try {
      const result = await client.setDone(task.id, calendarPlanStore.date);
      task.done = result.done;
      task.meta.updatedAt = new Date();
      profileStore.updateScore(result.score);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function setTaskUndone(task: TaskModel) {
    try {
      const result = await client.setUndone(task.id, calendarPlanStore.date);
      task.done = undefined;
      task.meta.updatedAt = new Date();
      profileStore.updateScore(result.score);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function startTimer(task: TaskModel) {
    try {
      task.timer = await client.startTimer(task.id);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function stopTimer(task: TaskModel) {
    try {
      task.timer = await client.stopTimer(task.id);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function updateTimer(task: TaskModel, value: number) {
    try {
      task.timer = await client.updateTimer(task.id, value);
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
    setTaskSelection,
    startTimer,
    stopTimer,
    updateTimer,
  };
});
