import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import {
  CalendarIntervalEnum,
  ActivityDataPointStore,
  toTimingId,
  getTimingIdsByRange,
  formatDate,
  ActivityFilter,
  LoadedTimingIdStore,
  ITask,
  HabitDto, IActivity,
  IHabit, isTask,
  TaskDto, ITimeSeriesNumberDataPoint,
  NumberDataPointDto
, ActivityFilterOptions } from '@lyvely/common';
import { useProfileStore } from '@/modules/user/store/profile.store';
import { useTimingStore } from '@/modules/timing/store';
import activityRepository from '@/modules/activity/repositories/activity.repository';
import habitsRepository from '@/modules/activity/repositories/habits.repository';
import tasksRepository from '@/modules/activity/repositories/tasks.repository';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';

export interface MoveActivityEvent {
  id: string;
  newIndex: number;
  oldIndex: number;
}

export const useActivityStore = defineStore('activity', {
  state: () => ({
    status: Status.INIT,
    cache: new ActivityDataPointStore(),
    timingStore: new LoadedTimingIdStore(),
    filter: new ActivityFilter(),
  }),
  getters: {
    habits: (state) => (interval: CalendarIntervalEnum) => state.cache.getHabitsByCalendarPlan(interval, state.filter),
    tasks: (state) => (interval: CalendarIntervalEnum) => state.cache.getTasksByCalendarPlan(interval, useTimingStore().getTimingId(interval), state.filter),
  },
  actions: {
    getHabitDataPoint(habit: IHabit, timingId?: string) {
      timingId = timingId || useTimingStore().getTimingId(habit.dataPointConfig.interval);
      return this.cache.getDataPoint(habit, timingId, true);
    },
    async loadActivities() {
      const { profile } = useProfileStore();

      if(!profile) return;

      const { date } = useTimingStore();

      const datesToBeLoaded = this.timingStore.getDataPointIntervalFilter(date);

      if(!datesToBeLoaded) {
        this.setStatus(Status.SUCCESS);
        return;
      }

      // Only show loader if we need to load the current date
      if(!this.timingStore.getDataPointIntervalFilter(date, profile.locale, 1)) {
        this.setStatus(Status.LOADING);
      }

      try {
        const { data: {habits, tasks, dataPoints} } = await activityRepository.getByRange(datesToBeLoaded);
        habits.forEach(habit => this.addHabit(habit));
        tasks.forEach(task => this.addTask(task));
        dataPoints.forEach(dataPoint => this.addDataPoint(dataPoint));
        this.timingStore.addLoadedTimingIds(getTimingIdsByRange(datesToBeLoaded));
        this.setStatus(Status.SUCCESS);
      } catch(e) {
        DialogExceptionHandler('An unknown error occurred while loading activities.', this)(e);
      }
    },
    async updateLog(log: ITimeSeriesNumberDataPoint, value: number) {
      const { date } = useTimingStore();
      const profileStore = useProfileStore();
      try {
        const { data } = await habitsRepository.updateLog(log.cid, {
          date: formatDate(date),
          value: value
        });

        log.value = data.units;
        // TODO: assure setting score for the right profile
        profileStore.updateScore(data.score);
      } catch (e) {
        //TODO: reset units + handle error
      }
    },
    addTask(task: ITask) {
      this.cache.addModel(new TaskDto(task))
    },
    addHabit(habit: IHabit) {
      this.cache.addModel(new HabitDto(habit))
    },
    addDataPoint(log: ITimeSeriesNumberDataPoint) {
      this.cache.addDataPoint(new NumberDataPointDto(log))
    },
    async archiveActivity(activity: IActivity) {
      await activityRepository.archive(activity.id);
      activity.archived = true;
    },
    async unarchiveActivity(activity: IActivity) {
      await activityRepository.unarchive(activity.id);
      activity.archived = false;
    },
    getDataPoint(activity: IActivity) {
      const { date } = useTimingStore();
      const timingId = toTimingId(date, activity.dataPointConfig.interval);

      let dataPoint = this.cache.getDataPoint(activity, timingId);

      if(!dataPoint) {
        // We assume the log should have already been loaded for the given timingId
        dataPoint = new NumberDataPointDto({ cid: activity.id, tid: timingId });
        this.cache.addDataPoint(dataPoint);
      }

      return dataPoint;
    },
    async setTaskDone(task: ITask) {
      const { date } = useTimingStore();
      const profileStore = useProfileStore();
      try {
        const { data } = await tasksRepository.setDone(task, date);
        task.done = data.done;
        profileStore.updateScore(data.score);
      } catch(e) {
        // Todo: handle error...
      }
    },
    async setTaskUndone(task: ITask) {
      const { date } = useTimingStore();
      const profileStore = useProfileStore();
      try {
        const { data } = await tasksRepository.setUndone(task, date);
        task.done = undefined;
        profileStore.updateScore(data.score);
      } catch(e) {
        // Todo: handle error...
      }
    },
    async move(moveEvent: MoveActivityEvent) {
      try {
        await activityRepository.sort(moveEvent);
        const activity = this.cache.getModel(moveEvent.id);
        const activities = (isTask(activity)
          ? this.tasks(activity.dataPointConfig.interval)
          : this.habits(activity.dataPointConfig.interval)
        ).filter((search: IActivity) => search.id !== activity.id);
        activities.splice(moveEvent.newIndex, 0, activity);
        activities.forEach((current: IActivity, index: number) => {
          current.sortOrder = index;
        });
      } catch(e) {
        // Todo: handle error...
      }
    },
    updateFilter(update: ActivityFilterOptions) {
      this.filter.update(update);
    },
    closeModals() {
      this.isEditEntry = false;
      this.isCreateEntry = false;
    },
    ...useStatus()
  }
});
