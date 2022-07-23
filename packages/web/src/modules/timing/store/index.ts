import { defineStore } from 'pinia';
import { toTimingId, CalendarPlan, CalendarIntervalEnum } from 'lyvely-common';

export const useTimingStore = defineStore('timing', {
  state: () => ({
    currentDate: new Date(),
    dragActive: false
  }),
  getters: {
    date: (state) => <Date> state.currentDate
  },
  actions: {
    getTimingId(plan: CalendarIntervalEnum) {
      return toTimingId(this.date, plan);
    },
    setDragActive(drag: boolean) {
      this.dragActive = drag;
    },
    setCurrentDate(date: Date) {
      this.currentDate = date;
    },
    decrementTiming(plan: CalendarIntervalEnum) {
      const calendarPlan = CalendarPlan.getInstance(plan);
      // not sure why we need to cast here...
      this.setCurrentDate(calendarPlan.decrement(<Date> this.date));
    },
    isInFurure(): boolean {
      return this.date > new Date();
    },
    incrementTiming(plan: CalendarIntervalEnum) {
      const calendarPlan = CalendarPlan.getInstance(plan);
      // not sure why we need to cast here...
      this.currentDate = calendarPlan.increment(<Date> this.date);
    }
  }
});
