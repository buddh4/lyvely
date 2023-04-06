import { defineStore, storeToRefs } from 'pinia';
import {
  toTimingId,
  formatDate,
  NumberDataPointModel,
  CalendarInterval,
  HabitModel,
  TimerUpdateModel,
  TimeSeriesStore,
  HabitFilter,
} from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar-plan';
import { useHabitsService } from '@/modules/habits/services/habits.service';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { useContentStore } from '@/modules/content/stores/content.store';
import { isDefined } from 'class-validator';
import { useTimeSeriesCalendarPlan } from '@/modules/time-series';

export const useHabitCalendarPlanStore = defineStore('habitCalendarPlan', () => {
  const { locale } = storeToRefs(useProfileStore());
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const habitsService = useHabitsService();
  const dialog = useGlobalDialogStore();
  const contentStore = useContentStore();

  const habitPlan = useTimeSeriesCalendarPlan<HabitModel, HabitFilter>({
    filter: new HabitFilter(),
    cache: new TimeSeriesStore<HabitModel>(),
    service: useHabitsService(),
  });

  const { filter, cache, date } = habitPlan;

  contentStore.onContentCreated(HabitModel.contentType, addHabit);
  contentStore.onContentUpdated(HabitModel.contentType, addHabit);

  function getHabits(interval: CalendarInterval) {
    return cache.value.getModelsByIntervalFilter(
      interval,
      filter.value as HabitFilter,
      toTimingId(date.value, interval, locale.value),
    );
  }

  function addHabit(habit: HabitModel) {
    cache.value.setModel(new HabitModel(habit));
  }

  function getDataPoint(model: HabitModel) {
    const timingId = toTimingId(calendarPlanStore.date, model.timeSeriesConfig.interval);
    return cache.value.getDataPoint(model, timingId, true);
  }

  async function updateDataPoint(log: NumberDataPointModel, value: number, oldValue?: number) {
    try {
      log.value = value;
      const result = await habitsService.updateDataPoint(log.cid, {
        date: formatDate(calendarPlanStore.date),
        value: value,
      });

      cache.value.setDataPoint(result.dataPoint);
      profileStore.updateScore(result.score);
    } catch (e) {
      if (isDefined(oldValue)) {
        log.value = oldValue!;
      }
      dialog.showUnknownError();
    }
  }

  async function startTimer(activity: HabitModel) {
    try {
      const updatedDataPoint = await habitsService.startTimer(
        activity.id,
        new TimerUpdateModel(calendarPlanStore.date),
      );
      cache.value.setDataPoint(updatedDataPoint);
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
      cache.value.setDataPoint(result.dataPoint);
      profileStore.updateScore(result.score);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  return {
    ...habitPlan,
    getHabits,
    addHabit,
    updateDataPoint,
    getDataPoint,
    startTimer,
    stopTimer,
  };
});
