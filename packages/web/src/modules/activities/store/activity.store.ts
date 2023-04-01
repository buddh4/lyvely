import { defineStore, storeToRefs } from 'pinia';
import {
  ActivityDataPointStore,
  ActivityFilter,
  ActivityModel,
  ActivityType,
  CalendarIntervalEnum,
  TaskModel,
  toTimingId,
} from '@lyvely/common';
import { ref } from 'vue';
import { localStorageManager } from '@/util';
import { useCalendarPlan } from '@/modules/calendar-plan';
import { useActivitiesService } from '@/modules/activities/services/activities.service';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

export interface IMoveActivityEvent {
  cid: string;
  newIndex: number;
  oldIndex: number;
  fromInterval: CalendarIntervalEnum;
  toInterval: CalendarIntervalEnum;
}

const MAX_DONE_TASKS = 2;
const DEFAULT_ACTIVITY_VIEW = 'latest_activity_view';
export const latestActivityView = localStorageManager.getStoredValue(DEFAULT_ACTIVITY_VIEW);

export const useActivityStore = defineStore('activities', () => {
  const { locale } = storeToRefs(useProfileStore());
  const activeView = ref<string>(latestActivityView.getValue() || 'Habits');
  const calendarPlan = useCalendarPlan<ActivityModel, ActivityFilter>({
    filter: new ActivityFilter(),
    cache: new ActivityDataPointStore(),
    service: useActivitiesService(),
  });

  const { filter, cache, date } = calendarPlan;

  const hasMore = ref<{ [key in CalendarIntervalEnum]: boolean }>({
    [CalendarIntervalEnum.Daily]: false,
    [CalendarIntervalEnum.Weekly]: false,
    [CalendarIntervalEnum.Monthly]: false,
    [CalendarIntervalEnum.Quarterly]: false,
    [CalendarIntervalEnum.Yearly]: false,
    [CalendarIntervalEnum.Unscheduled]: false,
  });

  function getActivities(type: string, interval: CalendarIntervalEnum, showAll = false) {
    filter.value.setOption('type', type);
    hasMore.value[interval] = false;
    const tid = toTimingId(date.value, interval, locale.value);
    const activities = cache.value.getModelsByIntervalFilter(
      interval,
      filter.value as ActivityFilter,
      tid,
    );

    if (type !== ActivityType.Task) return activities;

    const tasks = [] as ActivityModel[];
    let doneCount = 0;
    activities.forEach((task) => {
      if (!(<TaskModel>task).done || doneCount++ < MAX_DONE_TASKS) {
        tasks.push(task);
      }
    });

    hasMore.value[interval] = doneCount > MAX_DONE_TASKS;

    return showAll ? activities : tasks;
  }

  function setActiveView(view: 'Habits' | 'Tasks') {
    activeView.value = view;
    latestActivityView.setValue(view);
  }

  function isHasMore(interval: CalendarIntervalEnum) {
    return hasMore.value[interval];
  }

  return {
    ...calendarPlan,
    isHasMore,
    getActivities,
    hasMore,
    setActiveView,
    activeView,
  };
});
