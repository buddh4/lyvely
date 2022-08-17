import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import {
  ActivityDataPointStore,
  ActivityFilter,
  ActivityFilterOptions,
  IActivity,
  LoadedTimingIdStore,
  CalendarIntervalEnum
} from '@lyvely/common';
import { useProfileStore } from '@/modules/user/store/profile.store';
import { useTimingStore } from '@/modules/timing/store';
import activityRepository from '@/modules/activity/repositories/activity.repository';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';
import { reactive } from 'vue';
import { useHabitPlanStore } from "@/modules/activity/store/habitPlanStore";
import { useTaskPlanStore } from "@/modules/activity/store/taskPlanStore";

export interface MoveActivityEvent {
  cid: string;
  newIndex: number;
  oldIndex: number;
  fromInterval: CalendarIntervalEnum,
  toInterval: CalendarIntervalEnum
}

export const useActivityStore = defineStore('activity', () => {
  const status = useStatus();
  const habitPlanStore = useHabitPlanStore();
  const taskPlanStore = useTaskPlanStore();
  const timingStore = useTimingStore();
  const cache = reactive(new ActivityDataPointStore());
  const tidCache = reactive(new LoadedTimingIdStore());
  const filter = reactive(new ActivityFilter());

  async function loadActivities() {
    const { profile } = useProfileStore();

    if(!profile) {
      status.setStatus(Status.ERROR);
      DialogExceptionHandler('No profile selected.', this)();
    }

    const intervalFilter = tidCache.getDataPointIntervalFilter(timingStore.date);

    if(intervalFilter === false) {
      status.setStatus(Status.SUCCESS);
      return;
    }

    // TODO: Check if date already loaded + implement interval level query
    // Only show loader if we need to load the current date
    //if(!timingStore.getDataPointIntervalFilter(date)) {
      status.setStatus(Status.LOADING);
    //}

    try {
      const { data: { habits, tasks, dataPoints } } = await activityRepository.getByRange(intervalFilter);
      tasks.forEach(task => taskPlanStore.addTask(task));
      habits.forEach(habit => habitPlanStore.addHabit(habit));
      dataPoints.forEach(dataPoint => habitPlanStore.addDataPoint(dataPoint));
      //timingStore.addLoadedTimingIds(getTimingIdsByRange(datesToBeLoaded));
      status.setStatus(Status.SUCCESS);
    } catch(e) {
      DialogExceptionHandler('An unknown error occurred while loading activities.', this)(e);
    }
  }

  async function archiveActivity(activity: IActivity) {
    await activityRepository.archive(activity.id);
    activity.archived = true;
  }

  async function unarchiveActivity(activity: IActivity) {
    await activityRepository.unarchive(activity.id);
    activity.archived = false;
  }

  async function move(moveEvent: MoveActivityEvent, from?: IActivity[], to?: IActivity[]) {
    if(!from || !to) {
      console.assert(!!from && !!to, 'Unknown interval set on move event');
      return;
    }

    try {
      const activity = cache.getModel(moveEvent.cid);
      const attachTo = (moveEvent.newIndex > 0) ? to[moveEvent.newIndex - 1] : undefined;

      if(moveEvent.fromInterval !== moveEvent.toInterval) {
        activity.dataPointConfig.interval = moveEvent.toInterval;
      }

      const { data } = await activityRepository.sort(activity.id, moveEvent.toInterval, attachTo?.id);

      data.forEach(update => {
        const entry = cache.getModel(update.id);
        if(entry) {
          entry.sortOrder = update.sortOrder;
        }
      });
    } catch(e) {
      // Todo: handle error...
    }
  }

  function updateFilter(update: ActivityFilterOptions) {
    filter.update(update);
  }


  return { cache, loadActivities, archiveActivity, unarchiveActivity, move, updateFilter, filter,  ...status };
});
