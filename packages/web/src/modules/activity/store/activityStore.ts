import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import {
  CalendarPlanEnum,
  TimeableStore,
  toTimingId,
  getTimingIdsByRange,
  formatDate
  ActivityFilter,
  ActivityLogStore,
  ITask,
  ActivityLogDto,
  HabitDto, IActivity,
  IActivityLog,
  IHabit, isTask,
  TaskDto
} from 'lyvely-common';
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
    cache: new ActivityLogStore(),
    timingStore: new TimeableStore(),
    filter: new ActivityFilter(),
  }),
  getters: {
    habits: (state) => (plan: CalendarPlanEnum) => state.cache.getHabitsByCalendarPlan(plan, state.filter),
    tasks: (state) => (plan: CalendarPlanEnum) => state.cache.getTasksByCalendarPlan(plan, useTimingStore().getTimingId(plan), state.filter),
  },
  actions: {
    getLog(activity: IActivity, timingId?: string) {
      timingId = timingId || useTimingStore().getTimingId(activity.plan);
      return this.cache.getLog(activity, timingId, true);
    },
    async loadActivities() {
      const { profile } = useProfileStore();

      if(!profile) return;

      const { date } = useTimingStore();

      const datesToBeLoaded = this.timingStore.getCalendarFilter(date, profile.locale);

      if(!datesToBeLoaded) {
        this.setStatus(Status.SUCCESS);
        return;
      }

      // Only show loader if we need to load the current date
      if(!this.timingStore.getCalendarFilter(date, profile.locale, 1)) {
        this.setStatus(Status.LOADING);
      }

      try {
        const { data: {habits, tasks, logs} } = await activityRepository.getByRange(datesToBeLoaded);
        habits.forEach(habit => this.addHabit(habit));
        tasks.forEach(task => this.addTask(task));
        logs.forEach(log => this.addLog(log));
        this.timingStore.addLoadedTimingIds(getTimingIdsByRange(datesToBeLoaded, profile.locale));
        this.setStatus(Status.SUCCESS);
      } catch(e) {
        DialogExceptionHandler('An unknown error occurred while loading activities.', this)(e);
      }
    },
    async updateLog(log: IActivityLog, value: number) {
      const { date } = useTimingStore();
      const profileStore = useProfileStore();
      try {
        const { data } = await habitsRepository.updateLog(log.contentId, {
          date: formatDate(date),
          value: value
        });
        log.value = data.value;
        log.score = data.value;
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
    addLog(log: IActivityLog) {
      this.cache.addLog(new ActivityLogDto(log))
    },
    async archiveActivity(activity: IActivity) {
      await activityRepository.archive(activity.id);
      activity.archived = true;
    },
    async unarchiveActivity(activity: IActivity) {
      await activityRepository.unarchive(activity.id);
      activity.archived = false;
    },
    async getActivityLog(activity: IActivity) {
      const { date } = useTimingStore();
      const timingId = toTimingId(date, activity.plan);

      let log = this.cache.getLog(activity, timingId);

      if(!log) {
        // We assume the log should have already been loaded for the given timingId
        log = ActivityLogDto.createFor(activity, timingId);
        this.cache.addLog(log);
      }

      return log;
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
          ? this.tasks(activity.plan)
          : this.habits(activity.plan)
        ).filter((search: IActivity) => search.id !== activity.id);
        activities.splice(moveEvent.newIndex, 0, activity);
        activities.forEach((current: IActivity, index: number) => {
          current.sortOrder = index;
        });
      } catch(e) {
        // Todo: handle error...
      }
    },
    updateFilter(update: ActivityFilter) {
      this.filter.update(update);
    },
    closeModals() {
      this.isEditEntry = false;
      this.isCreateEntry = false;
    },
    ...useStatus()
  }
});
