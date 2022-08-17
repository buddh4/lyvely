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

  async function move(moveEvent: MoveActivityEvent) {
    try {
      /*await activityRepository.sort(moveEvent);
      const activity = this.cache.getModel(moveEvent.id);
      const activities = (isTask(activity)
          ? this.tasks(activity.dataPointConfig.interval)
          : this.habits(activity.dataPointConfig.interval)
      ).filter((search: IActivity) => search.id !== activity.id);
      activities.splice(moveEvent.newIndex, 0, activity);
      activities.forEach((current: IActivity, index: number) => {
        current.sortOrder = index;
      });*/
    } catch(e) {
      // Todo: handle error...
    }
  }

  function updateFilter(update: ActivityFilterOptions) {
    filter.update(update);
  }


  return { cache, loadActivities, archiveActivity, unarchiveActivity, move, updateFilter, filter,  ...status };
});
