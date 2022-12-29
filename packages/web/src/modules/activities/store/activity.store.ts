import { defineStore, storeToRefs } from 'pinia';
import { Status, useStatus } from '@/store';
import {
  ActivityDataPointStore,
  ActivityFilter,
  ActivityModel,
  ActivityType,
  CalendarIntervalEnum,
  LoadedTimingIdStore,
  TaskModel,
  toTimingId,
} from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import activityRepository from '@/modules/activities/repositories/activity.repository';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';
import { ref, toRefs, watch } from 'vue';
import { useHabitPlanStore } from '@/modules/activities/store/habit-plan.store';
import { useTaskPlanStore } from '@/modules/activities/store/task-plan.store';

export interface IMoveActivityEvent {
  cid: string;
  newIndex: number;
  oldIndex: number;
  fromInterval: CalendarIntervalEnum;
  toInterval: CalendarIntervalEnum;
}

const MAX_DONE_TASKS = 2;

export const useActivityStore = defineStore('activities', () => {
  const status = useStatus();
  const habitPlanStore = useHabitPlanStore();
  const taskPlanStore = useTaskPlanStore();
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
  watch(date, () => useActivityStore().loadActivities());

  function getActivities(type: ActivityType, interval: CalendarIntervalEnum, showAll = false) {
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
      taskPlanStore.addTasks(tasks);
      habitPlanStore.addHabits(habits);
      habitPlanStore.addDataPoints(dataPoints);
      //calendarPlanStore.addLoadedTimingIds(getTimingIdsByRange(datesToBeLoaded));
      status.setStatus(Status.SUCCESS);
    } catch (e) {
      DialogExceptionHandler('An unknown error occurred while loading activities.', this)(e);
    }
  }

  async function toggleArchiveActivity(activity: ActivityModel) {
    return activity.meta.isArchived ? unarchiveActivity(activity) : archiveActivity(activity);
  }

  async function archiveActivity(activity: ActivityModel) {
    await activityRepository.archive(activity.id);
    activity.meta.isArchived = true;
  }

  async function unarchiveActivity(activity: ActivityModel) {
    await activityRepository.unarchive(activity.id);
    activity.meta.isArchived = false;
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
    archiveActivity,
    unarchiveActivity,
    toggleArchiveActivity,
    selectTag,
    move,
    filter,
    status,
  };
});
