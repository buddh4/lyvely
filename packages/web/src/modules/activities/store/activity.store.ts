import { defineStore, storeToRefs } from 'pinia';
import { Status, useStatus } from '@/store';
import {
  ActivityDataPointStore,
  ActivityFilter,
  ActivityModel,
  ActivityType,
  CalendarIntervalEnum,
  HabitModel,
  LoadedTimingIdStore,
  NumberDataPointModel,
  TaskModel,
  toTimingId,
} from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar/stores/calendar-plan.store';
import activityRepository from '@/modules/activities/repositories/activity.repository';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';
import { ref, toRefs, watch } from 'vue';
import { localStorageManager } from '@/util';

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
  const status = useStatus();
  const activeView = ref<string>(latestActivityView.getValue() || 'Habits');
  const profileStore = useProfileStore();
  const calendarPlanStore = useCalendarPlanStore();
  const cache = ref(new ActivityDataPointStore());
  const tidCache = ref(new LoadedTimingIdStore());
  const filter = ref(new ActivityFilter({ tagProvider: () => profileStore.profile?.tags || [] }));
  const { profile } = toRefs(profileStore);
  const hasMore = ref<{ [key in CalendarIntervalEnum]: boolean }>({
    [CalendarIntervalEnum.Daily]: false,
    [CalendarIntervalEnum.Weekly]: false,
    [CalendarIntervalEnum.Monthly]: false,
    [CalendarIntervalEnum.Quarterly]: false,
    [CalendarIntervalEnum.Yearly]: false,
    [CalendarIntervalEnum.Unscheduled]: false,
  });

  const { date } = storeToRefs(calendarPlanStore);
  watch(date, () => loadActivities());

  function getActivities(type: string, interval: CalendarIntervalEnum, showAll = false) {
    filter.value.setOption('type', type);
    hasMore.value[interval] = false;
    const tid = toTimingId(date.value, interval);
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

  watch(profile, async (newProfile, oldProfile) => {
    if (newProfile?.id !== oldProfile?.id) {
      status.resetStatus();
      cache.value = new ActivityDataPointStore();
      tidCache.value = new LoadedTimingIdStore();
      // TODO: we should find a better way for managing the type filter here...
      const type = filter.value.option('type');
      filter.value.reset();
      filter.value.setOption('type', type);
      await loadActivities();
    }
  });

  function setActiveView(view: 'Habits' | 'Tasks') {
    activeView.value = view;
    latestActivityView.setValue(view);
  }

  async function loadActivities() {
    if (!profile.value) {
      status.setStatus(Status.ERROR);
      DialogExceptionHandler('No profile selected.', this)();
    }

    const intervalFilter = tidCache.value.getDataPointIntervalFilter(calendarPlanStore.date);

    if (intervalFilter === false) {
      status.setStatus(Status.SUCCESS);
      return;
    }

    // TODO: Check if date already loaded + implement interval level query
    // Only show loader if we need to load the current date
    //if(!calendarPlanStore.getDataPointIntervalFilter(date)) {
    status.setStatus(Status.LOADING);
    //}

    try {
      const {
        data: { habits, tasks, dataPoints },
      } = await activityRepository.getByRange(intervalFilter);
      // TODO: use service layer
      cache.value.setModels(tasks.map((task) => new TaskModel(task)));
      cache.value.setModels(habits.map((habit) => new HabitModel(habit)));
      cache.value.setDataPoints(dataPoints.map((dataPoint) => new NumberDataPointModel(dataPoint)));
      //calendarPlanStore.addLoadedTimingIds(getTimingIdsByRange(datesToBeLoaded));
      status.setStatus(Status.SUCCESS);
    } catch (e) {
      DialogExceptionHandler('An unknown error occurred while loading activities.', this)(e);
    }
  }

  function selectTag(tagId: string) {
    filter.value.setOption('tagId', tagId);
  }

  function isHasMore(interval: CalendarIntervalEnum) {
    return hasMore.value[interval];
  }

  async function move(moveEvent: IMoveActivityEvent, from?: ActivityModel[], to?: ActivityModel[]) {
    if (!from || !to) {
      console.assert(!!from && !!to, 'Unknown interval set on move event');
      return;
    }

    try {
      const activity = cache.value.getModel(moveEvent.cid);
      const attachTo = moveEvent.newIndex > 0 ? to[moveEvent.newIndex - 1] : undefined;

      if (moveEvent.fromInterval !== moveEvent.toInterval) {
        activity.timeSeriesConfig.interval = moveEvent.toInterval;
      }

      const { data } = await activityRepository.sort(
        activity.id,
        moveEvent.toInterval,
        attachTo?.id,
      );

      data.forEach((update) => {
        const entry = cache.value.getModel(update.id);
        if (entry) {
          entry.meta.sortOrder = update.sortOrder;
        }
      });
    } catch (e) {
      // Todo: handle error...
    }
  }

  return {
    cache,
    isHasMore,
    getActivities,
    loadActivities,
    hasMore,
    setActiveView,
    activeView,
    selectTag,
    move,
    filter,
    status,
  };
});
