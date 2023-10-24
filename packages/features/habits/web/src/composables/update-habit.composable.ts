import { computed } from 'vue';
import { useHabitCalendarPlanStore } from '@/stores';
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

  const timer = computed(() => dataPoint.value!.value.timer);

  const isTimerStartable = computed(() => useCalendarPlanStore().isPresentInterval(model.interval));

  return {
    selection,
    dataPoint,
    isTimerStartable,
    startTimer,
    stopTimer,
    timer,
  };
};
