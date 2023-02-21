import { defineStore } from 'pinia';
import {
  toTimingId,
  formatDate,
  NumberDataPointModel,
  CalendarIntervalEnum,
  HabitModel,
  ActivityType,
  TimerUpdateModel,
} from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar/stores/calendar-plan.store';
import { IMoveActivityEvent, useActivityStore } from '@/modules/activities/store/activity.store';
import { useHabitsService } from '@/modules/activities/services/habits.service';
import { eventBus } from '@/modules/core/events/global.emitter';
import { useLiveStore } from '@/modules/live/stores/live.store';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { useContentStore } from '@/modules/content/stores/content.store';

export const useHabitPlanStore = defineStore('habitPlan', () => {
  const activityStore = useActivityStore();
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const liveStore = useLiveStore();
  const habitsService = useHabitsService();
  const dialog = useGlobalDialogStore();
  const contentStore = useContentStore();

  contentStore.onContentCreated(ActivityType.Habit, addHabit);
  contentStore.onContentUpdated(ActivityType.Habit, addHabit);

  // TODO: handle live event

  async function move(moveEvent: IMoveActivityEvent) {
    await activityStore.move(
      moveEvent,
      _getHabitsByCalendarInterval(moveEvent.fromInterval),
      _getHabitsByCalendarInterval(moveEvent.toInterval),
    );
  }

  function _getHabitsByCalendarInterval(interval: CalendarIntervalEnum) {
    return activityStore.getActivities(ActivityType.Habit, interval);
  }

  function addHabit(habit: HabitModel) {
    activityStore.cache.setModel(new HabitModel(habit));
  }

  function addHabits(habits: HabitModel[]) {
    activityStore.cache.setModels(habits.map((habit) => new HabitModel(habit)));
  }

  function addDataPoint(dataPoint: NumberDataPointModel) {
    activityStore.cache.setDataPoint(new NumberDataPointModel(dataPoint));
  }

  function addDataPoints(dataPoint: NumberDataPointModel[]) {
    activityStore.cache.setDataPoints(
      dataPoint.map((dataPoint) => new NumberDataPointModel(dataPoint)),
    );
  }

  function getDataPoint(activity: HabitModel) {
    const timingId = toTimingId(calendarPlanStore.date, activity.timeSeriesConfig.interval);
    return activityStore.cache.getDataPoint(activity, timingId, true);
  }

  async function updateDataPoint(log: NumberDataPointModel, value: number) {
    const oldValue = log.value;

    try {
      log.value = value;
      const result = await habitsService.updateDataPoint(log.cid, {
        date: formatDate(calendarPlanStore.date),
        value: value,
      });

      activityStore.cache.setDataPoint(result.dataPoint);
      profileStore.updateScore(result.score);
    } catch (e) {
      log.value = oldValue;
      dialog.showUnknownError();
    }
  }

  async function startTimer(activity: HabitModel) {
    try {
      const updatedDataPoint = await habitsService.startTimer(
        activity.id,
        new TimerUpdateModel(calendarPlanStore.date),
      );
      activityStore.cache.setDataPoint(updatedDataPoint);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function stopTimer(activity: HabitModel) {
    try {
      const result = await habitsService.stopTimer(
        activity.id,
        new TimerUpdateModel(calendarPlanStore.date),
      );
      activityStore.cache.setDataPoint(result.dataPoint);
      profileStore.updateScore(result.score);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  return {
    addHabit,
    addHabits,
    addDataPoint,
    addDataPoints,
    move,
    getDataPoint,
    updateDataPoint,
    startTimer,
    stopTimer,
  };
});
