import { defineStore } from 'pinia';
import { TaskModel, CalendarIntervalEnum, ActivityFilter } from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import { IMoveActivityEvent, useActivityStore } from '@/modules/activities/store/activity.store';
import { useTasksService } from '@/modules/activities/services/tasks.service';

export const useTaskPlanStore = defineStore('taskPlan', () => {
  const activityStore = useActivityStore();
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const tasksService = useTasksService();

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
      profileStore.updateScore(result.score);
    } catch (e) {
      // Todo: handle error...
    }
  }

  async function setTaskUndone(task: TaskModel) {
    try {
      const result = await tasksService.setUndone(task.id, calendarPlanStore.date);
      task.done = undefined;
      profileStore.updateScore(result.score);
    } catch (e) {
      // Todo: handle error...
    }
  }

  async function startTimer(task: TaskModel) {
    task.timer = await tasksService.startTimer(task.id);
    // Todo: handle error...
  }

  async function stopTimer(task: TaskModel) {
    task.timer = await tasksService.stopTimer(task.id);
    // Todo: handle error...
  }

  async function updateTimer(task: TaskModel, value: number) {
    task.timer = await tasksService.updateTimer(task.id, value);
    // Todo: handle error...
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
