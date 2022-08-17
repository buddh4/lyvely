import { defineStore } from 'pinia';
import {
  ITask,
  TaskDto,
  getCalendarPlanOptions,
  CalendarIntervalEnum} from '@lyvely/common';
import { useProfileStore } from '@/modules/user/store/profile.store';
import { useTimingStore } from '@/modules/timing/store';
import tasksRepository from '@/modules/activity/repositories/tasks.repository';
import { MoveActivityEvent, useActivityStore } from "@/modules/activity/store/activityStore";
import { ComputedRef, computed } from "vue";

export const useTaskPlanStore = defineStore('taskPlan', () => {

  const activityStore = useActivityStore();
  const timingStore = useTimingStore();
  const profileStore = useProfileStore();

  async function move(moveEvent: MoveActivityEvent) {
    await activityStore.move(
      moveEvent,
      getTasksByCalendarInterval(moveEvent.fromInterval),
        getTasksByCalendarInterval(moveEvent.toInterval)
    );
  }

  function getTasksByCalendarInterval(interval: CalendarIntervalEnum) {
    return activityStore.cache.getTasksByCalendarInterval(interval, timingStore.getTimingId(interval), activityStore.filter);
  }

  function addTask(task: ITask) {
    activityStore.cache.addModel(new TaskDto(task))
  }

  async function setTaskDone(task: ITask) {
    try {
      const { data } = await tasksRepository.setDone(task, timingStore.date);
      task.done = data.done;
      profileStore.updateScore(data.score);
    } catch(e) {
      // Todo: handle error...
    }
  }

  async function setTaskUndone(task: ITask) {
    try {
      const { data } = await tasksRepository.setUndone(task, timingStore.date);
      task.done = undefined;
      profileStore.updateScore(data.score);
    } catch(e) {
      // Todo: handle error...
    }
  }

  async function setTaskSelection(task: ITask, val: boolean) {
    return val ? setTaskDone(task) : setTaskUndone(task);
  }

  return { addTask, setTaskSelection, move, getTasksByCalendarInterval };
});
