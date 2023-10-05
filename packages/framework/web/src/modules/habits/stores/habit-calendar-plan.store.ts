import { defineStore } from 'pinia';
import { HabitModel, TimerUpdateModel, HabitFilter } from '@lyvely/habits-interface';
import { TimeSeriesStore } from '@lyvely/time-series-interface';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar-plan';
import { useHabitsService } from '@/modules/habits/services/habits.service';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { useTimeSeriesCalendarPlan } from '@/modules/time-series';

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
