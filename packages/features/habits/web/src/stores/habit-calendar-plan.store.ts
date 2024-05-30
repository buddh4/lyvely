import { defineStore } from 'pinia';
import {
  HabitModel,
  HabitFilter,
  useHabitsClient,
  UpdateHabitDataPointResponse,
} from '@lyvely/habits-interface';
import { TimerUpdateModel } from '@lyvely/timers-interface';
import {
  IUpdateDataPointResponse,
  TimeSeriesStore,
  useTimeSeriesCalendarPlan,
} from '@lyvely/time-series-web';
import { useProfileStore, useGlobalDialogStore } from '@lyvely/web';
import { useCalendarPlanStore } from '@lyvely/calendar-plan-web';
import { hasOwnNonNullableProperty } from '@lyvely/common';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'mitt';

export const useHabitCalendarPlanStore = defineStore('habitCalendarPlan', () => {
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const habitsClient = useHabitsClient();
  const dialog = useGlobalDialogStore();

  const habitPlan = useTimeSeriesCalendarPlan<HabitModel, HabitFilter>({
    filter: new HabitFilter(),
    cache: new TimeSeriesStore<HabitModel>(),
    contentTypes: [HabitModel.contentType],
    client: habitsClient,
    onDataPointUpdated: (result: IUpdateDataPointResponse) => {
      if (hasOwnNonNullableProperty<UpdateHabitDataPointResponse>(result, 'score')) {
        profileStore.updateScore(result.score);
      }
    },
  });

  const { cache } = habitPlan;

  async function startTimer(habit: HabitModel) {
    try {
      const updatedDataPoint = await habitsClient.startTimer(
        habit.id,
        new TimerUpdateModel(calendarPlanStore.date)
      );
      cache.value.setDataPoint(updatedDataPoint);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function stopTimer(habit: HabitModel) {
    try {
      const result = await habitsClient.stopTimer(
        habit.id,
        new TimerUpdateModel(calendarPlanStore.date)
      );
      cache.value.setDataPoint(result.dataPoint);
      profileStore.updateScore(result.score);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  return {
    ...habitPlan,
    startTimer,
    stopTimer,
  };
});
