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
import {
  dragEventToMoveEvent,
  IMoveEntryEvent,
  useCalendarPlanStore,
} from '@/modules/calendar-plan';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { useHabitsService } from '@/modules/activities/services/habits.service';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { useContentStore } from '@/modules/content/stores/content.store';
import { IDragEvent } from '@/modules/common';

export const useHabitPlanStore = defineStore('habitPlan', () => {
  const activityStore = useActivityStore();
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const habitsService = useHabitsService();
  const dialog = useGlobalDialogStore();
  const contentStore = useContentStore();

  contentStore.onContentCreated(ActivityType.Habit, addHabit);
  contentStore.onContentUpdated(ActivityType.Habit, addHabit);

  // TODO: handle live event

  async function move(evt: IDragEvent | IMoveEntryEvent) {
    const moveEvent = dragEventToMoveEvent(evt);
    await activityStore.move(
      moveEvent,
      getHabitsByCalendarInterval(moveEvent.fromInterval),
      getHabitsByCalendarInterval(moveEvent.toInterval),
    );
  }

  function getHabitsByCalendarInterval(interval: CalendarIntervalEnum) {
    return activityStore.getActivities(ActivityType.Habit, interval);
  }

  function addHabit(habit: HabitModel) {
    activityStore.cache.setModel(new HabitModel(habit));
  }

  function getDataPoint(model: HabitModel) {
    const timingId = toTimingId(calendarPlanStore.date, model.timeSeriesConfig.interval);
    return activityStore.cache.getDataPoint(model, timingId, true);
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
    move,
    updateDataPoint,
    getDataPoint,
    startTimer,
    stopTimer,
  };
});
