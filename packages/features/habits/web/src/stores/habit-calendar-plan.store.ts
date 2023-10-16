import { defineStore } from 'pinia';
import { HabitModel, HabitFilter } from '@lyvely/habits-interface';
import { TimerUpdateModel } from '@lyvely/timers-interface';
import { TimeSeriesStore, useTimeSeriesCalendarPlan } from '@lyvely/time-series-web';
import { useProfileStore, useGlobalDialogStore } from '@lyvely/web';
import { useCalendarPlanStore } from '@lyvely/calendar-plan-web';
import { useHabitsService } from '@/services';

export const useHabitCalendarPlanStore = defineStore('habitCalendarPlan', () => {
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const habitsService = useHabitsService();
  const dialog = useGlobalDialogStore();

  const habitPlan = useTimeSeriesCalendarPlan<HabitModel, HabitFilter>({
    filter: new HabitFilter(),
    cache: new TimeSeriesStore<HabitModel>(),
    contentTypes: [HabitModel.contentType],
    service: useHabitsService(),
  });

  const { cache } = habitPlan;

  async function startTimer(habit: HabitModel) {
    try {
      const updatedDataPoint = await habitsService.startTimer(
        habit.id,
        new TimerUpdateModel(calendarPlanStore.date),
      );
      cache.value.setDataPoint(updatedDataPoint);
    } catch (e) {
      dialog.showUnknownError();
    }
  }

  async function stopTimer(habit: HabitModel) {
    try {
      const result = await habitsService.stopTimer(
        habit.id,
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
    startTimer,
    stopTimer,
  };
});
