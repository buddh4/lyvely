import { defineStore } from 'pinia';
import { TaskModel, CalendarIntervalEnum, ActivityType } from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import {
  dragEventToMoveEvent,
  IMoveEntryEvent,
  useCalendarPlanStore,
} from '@/modules/calendar-plan';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { useTasksService } from '@/modules/tasks/services/tasks.service';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { useContentStore } from '@/modules/content/stores/content.store';
import { IDragEvent } from '@/modules/common';

export const useTaskPlanStore = defineStore('taskPlan', () => {
  const activityStore = useActivityStore();
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const tasksService = useTasksService();
  const dialog = useGlobalDialogStore();
  const contentStore = useContentStore();

  contentStore.onContentCreated(ActivityType.Task, addTask);
  contentStore.onContentUpdated(ActivityType.Task, addTask);

  // TODO: handle live event

  async function move(evt: IDragEvent | IMoveEntryEvent) {
    const moveEvent = dragEventToMoveEvent(evt);
    await activityStore.move(
      moveEvent,
      getTasksByCalendarInterval(moveEvent.fromInterval),
      getTasksByCalendarInterval(moveEvent.toInterval),
    );
  }

  function getTasksByCalendarInterval(interval: CalendarIntervalEnum) {
    return activityStore.getActivities(ActivityType.Task, interval);
  }

  function addTask(task: TaskModel) {
    activityStore.cache.setModel(new TaskModel(task));
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
    setTaskSelection,
    move,
    startTimer,
    stopTimer,
    updateTimer,
  };
});
