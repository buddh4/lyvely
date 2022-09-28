import { defineStore } from "pinia";
import {
  toTimingId,
  CalendarPlan,
  CalendarIntervalEnum,
  isToday as isTodayUtil,
  isInFuture as isInFutureUtil,
} from "@lyvely/common";
import { ref, computed } from "vue";

export const useCalendarPlanStore = defineStore("timing", () => {
  const date = ref(new Date());
  const dragActive = ref(false);

  function getTimingId(interval: CalendarIntervalEnum) {
    return toTimingId(date.value, interval);
  }

  function switchToToday() {
    date.value = new Date();
    console.log("switchToToday", date.value);
  }

  function _setCurrentDate(d: Date) {
    console.log("_setCurrentDate", date.value);
    date.value = d;
  }

  function decrementTiming(plan: CalendarIntervalEnum | CalendarPlan) {
    _setCurrentDate(getPreviousDate(plan));
  }

  function incrementTiming(plan: CalendarIntervalEnum | CalendarPlan) {
    _setCurrentDate(getNextDate(plan));
  }

  function getCalendarPlan(plan: CalendarIntervalEnum | CalendarPlan) {
    return plan instanceof CalendarPlan ? plan : CalendarPlan.getInstance(plan);
  }

  function getNextDate(plan: CalendarIntervalEnum | CalendarPlan) {
    return getCalendarPlan(plan).increment(date.value);
  }

  function getPreviousDate(plan: CalendarIntervalEnum | CalendarPlan) {
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
  };
});
