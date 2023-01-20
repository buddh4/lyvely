import { defineStore } from 'pinia';
import { TaskModel, CalendarIntervalEnum, ActivityFilter, ActivityType } from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import { IMoveActivityEvent, useActivityStore } from '@/modules/activities/store/activity.store';
import { useTasksService } from '@/modules/activities/services/tasks.service';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { useContentStore } from '@/modules/content/stores/content.store';

export const useTaskPlanStore = defineStore('taskPlan', () => {
  const activityStore = useActivityStore();
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const tasksService = useTasksService();
  const dialog = useGlobalDialogStore();
  const contentStore = useContentStore();

  contentStore.onContentCreated(ActivityType.Task, addTask);
  contentStore.onContentUpdated(ActivityType.Task, addTask);

  async function move(moveEvent: IMoveActivityEvent) {
    await activityStore.move(
      moveEvent,
      getTasksByCalendarInterval(moveEvent.fromInterval),
      getTasksByCalendarInterval(moveEvent.toInterval),
    );
  }

  function getTasksByCalendarInterval(interval: CalendarIntervalEnum) {
    return activityStore.cache.getTasksByCalendarInterval(
      interval,
      activityStore.filter as ActivityFilter,
      calendarPlanStore.getTimingId(interval),
    );
  }

  function addTask(task: TaskModel) {
    activityStore.cache.setModel(new TaskModel(task));
  }

  function addTasks(tasks: TaskModel[]) {
    activityStore.cache.setModels(tasks.map((task) => new TaskModel(task)));
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
    addTask,
    addTasks,
    setTaskSelection,
    move,
    startTimer,
    stopTimer,
    updateTimer,
  };
});
