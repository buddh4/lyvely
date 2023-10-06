import { defineStore, storeToRefs } from 'pinia';
import {
  toTimingId,
  isToday as isTodayUtil,
  everyFullMinute,
  CalendarInterval,
} from '@lyvely/dates';
import { CalendarPlan } from '@lyvely/calendar-plan-interface';
import { ref, computed } from 'vue';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

export const useCalendarPlanStore = defineStore('timing', () => {
  const now = ref(new Date());
  const date = ref(now.value);

  const dragActive = ref(false);
  const { locale } = storeToRefs(useProfileStore());

  everyFullMinute(() => (now.value = new Date()));

  function getTimingId(interval: CalendarInterval) {
    return toTimingId(date.value, interval, locale.value);
  }

  function switchToToday() {
    date.value = now.value;
  }

  function isPresentInterval(interval: CalendarInterval) {
    return toTimingId(new Date(), interval) === toTimingId(date.value, interval, locale.value);
  }

  function _setCurrentDate(d: Date) {
    date.value = d;
  }

  function decrementTiming(plan: CalendarInterval | CalendarPlan) {
    _setCurrentDate(getPreviousDate(plan));
  }

  function incrementTiming(plan: CalendarInterval | CalendarPlan) {
    _setCurrentDate(getNextDate(plan));
  }

  function getCalendarPlan(plan: CalendarInterval | CalendarPlan) {
    return plan instanceof CalendarPlan ? plan : CalendarPlan.getInstance(plan);
  }

  function getNextDate(plan: CalendarInterval | CalendarPlan) {
    return getCalendarPlan(plan).increment(date.value);
  }

  function getPreviousDate(plan: CalendarInterval | CalendarPlan) {
    return getCalendarPlan(plan).decrement(date.value);
  }

  const isInFuture = computed(() => date.value > now.value);
  const isToday = computed(() => isTodayUtil(date.value));

  return {
    date,
    dragActive,
    getTimingId,
    switchToToday,
    decrementTiming,
    incrementTiming,
    getNextDate,
    getPreviousDate,
    isInFuture,
    isToday,
    isPresentInterval,
  };
});
