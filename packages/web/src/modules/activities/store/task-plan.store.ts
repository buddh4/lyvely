import { defineStore } from 'pinia';
import { TaskModel, CalendarIntervalEnum, ActivityFilter } from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import tasksRepository from '@/modules/activities/repositories/tasks.repository';
import { IMoveActivityEvent, useActivityStore } from '@/modules/activities/store/activity.store';

export const useTaskPlanStore = defineStore('taskPlan', () => {
  const activityStore = useActivityStore();
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();

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
      calendarPlanStore.getTimingId(interval),
      activityStore.filter as ActivityFilter,
    );
  }

  function addTask(task: TaskModel) {
    activityStore.cache.setModel(new TaskModel(task));
  }

  async function setTaskDone(task: TaskModel) {
    try {
      const { data } = await tasksRepository.setDone(task, calendarPlanStore.date);
      task.done = data.done;
      profileStore.updateScore(data.score);
    } catch (e) {
      // Todo: handle error...
    }
  }

  async function setTaskUndone(task: TaskModel) {
    try {
      const { data } = await tasksRepository.setUndone(task, calendarPlanStore.date);
      task.done = undefined;
      profileStore.updateScore(data.score);
    } catch (e) {
      // Todo: handle error...
    }
  }

  async function setTaskSelection(task: TaskModel, val: boolean) {
    return val ? setTaskDone(task) : setTaskUndone(task);
  }

  return { addTask, setTaskSelection, move, getTasksByCalendarInterval };
});
