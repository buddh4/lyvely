import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import {
  ActivityDataPointStore,
  ActivityFilter,
  IActivity,
  LoadedTimingIdStore,
  CalendarIntervalEnum,
  ActivityType
} from '@lyvely/common';
import { useProfileStore } from '@/modules/profile/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import activityRepository from '@/modules/activity/repositories/activity.repository';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';
import { ref, watch,toRefs } from 'vue';
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
  const profileStore = useProfileStore();
  const calendarPlanStore = useCalendarPlanStore();
  const cache = ref(new ActivityDataPointStore());
  const tidCache = ref(new LoadedTimingIdStore());
  const filter = ref(new ActivityFilter({ tagProvider: () => profileStore.profile?.tags || [] }));

  const { profile } = toRefs(profileStore);

  function getActivities(type: ActivityType, interval: CalendarIntervalEnum) {
    filter.value.setOption('type', type);
    return cache.value.getModelsByIntervalFilter(interval, filter.value);
  }

  watch(profile, async () => {
    cache.value = new ActivityDataPointStore();
    tidCache.value = new LoadedTimingIdStore();
    filter.value = new ActivityFilter({ tagProvider: () => profileStore.profile?.tags || [] });
    await loadActivities();
  });

  async function loadActivities() {
    if(!profile) {
      status.setStatus(Status.ERROR);
      DialogExceptionHandler('No profile selected.', this)();
    }

    const intervalFilter = tidCache.value.getDataPointIntervalFilter(calendarPlanStore.date);

    if(intervalFilter === false) {
      status.setStatus(Status.SUCCESS);
      return;
    }

    // TODO: Check if date already loaded + implement interval level query
    // Only show loader if we need to load the current date
    //if(!calendarPlanStore.getDataPointIntervalFilter(date)) {
      status.setStatus(Status.LOADING);
    //}

    try {
      const { data: { habits, tasks, dataPoints } } = await activityRepository.getByRange(intervalFilter);
      tasks.forEach(task => taskPlanStore.addTask(task));
      habits.forEach(habit => habitPlanStore.addHabit(habit));
      dataPoints.forEach(dataPoint => habitPlanStore.addDataPoint(dataPoint));
      //calendarPlanStore.addLoadedTimingIds(getTimingIdsByRange(datesToBeLoaded));
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
      const activity = cache.value.getModel(moveEvent.cid);
      const attachTo = (moveEvent.newIndex > 0) ? to[moveEvent.newIndex - 1] : undefined;

      if(moveEvent.fromInterval !== moveEvent.toInterval) {
        activity.dataPointConfig.interval = moveEvent.toInterval;
      }

      const { data } = await activityRepository.sort(activity.id, moveEvent.toInterval, attachTo?.id);

      data.forEach(update => {
        const entry = cache.value.getModel(update.id);
        if(entry) {
          entry.sortOrder = update.sortOrder;
        }
      });
    } catch(e) {
      // Todo: handle error...
    }
  }


  return { cache, getActivities, loadActivities, archiveActivity, unarchiveActivity, move, filter,  ...status };
});
