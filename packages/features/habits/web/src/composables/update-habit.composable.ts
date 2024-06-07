import { computed } from 'vue';
import { useHabitCalendarPlanStore } from '@/stores';
import { TimerModel } from '@lyvely/web';
import { HabitModel } from '@lyvely/habits-interface';
import { useCalendarPlanStore } from '@lyvely/calendar-plan-web';

export const useUpdateHabit = (model: HabitModel) => {
  const habitStore = useHabitCalendarPlanStore();
  const { getDataPoint, updateDataPoint } = habitStore;
  const dataPoint = computed(() => getDataPoint(model));

  const selection = computed({
    get: () => dataPoint.value!.value,
    set: (selection: number) => {
      const oldValue = dataPoint.value!.value;
      // Visually update due to debounce delay
      dataPoint.value!.value = selection;
      updateDataPoint(dataPoint.value!, selection, oldValue);
    },
  });

  const timer = computed(() => {
    if (typeof dataPoint.value!.value === 'number') return new TimerModel();
    if ('timer' in dataPoint.value!.value) return dataPoint.value!.value.timer as TimerModel;
    return new TimerModel();
  });

  const isTimerStartable = computed(() => useCalendarPlanStore().isPresentInterval(model.interval));

  async function startTimer() {
    if (!timer.value) return;
    if (!timer.value.isStarted()) {
      await useHabitCalendarPlanStore().startTimer(model);
    }
  }

  async function stopTimer() {
    if (!timer.value) return;
    if (timer.value.isStarted()) {
      await useHabitCalendarPlanStore().stopTimer(model);
    }
  }

  return {
    selection,
    dataPoint,
    isTimerStartable,
    startTimer,
    stopTimer,
    timer,
  };
};
