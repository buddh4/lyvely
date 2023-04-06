import { defineStore, storeToRefs } from 'pinia';
import {
  toTimingId,
  CalendarPlan,
  CalendarInterval,
  isToday as isTodayUtil,
  isInFuture as isInFutureUtil,
} from '@lyvely/common';
import { ref, computed } from 'vue';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

export const useCalendarPlanStore = defineStore('timing', () => {
  const date = ref(new Date());
  const dragActive = ref(false);
  const { locale } = storeToRefs(useProfileStore());

  function getTimingId(interval: CalendarInterval) {
    return toTimingId(date.value, interval, locale.value);
  }

  function switchToToday() {
    date.value = new Date();
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

  const isInFuture = computed(() => isInFutureUtil(date.value));
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
