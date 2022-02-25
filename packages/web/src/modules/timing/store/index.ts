import { defineStore } from 'pinia';
import { buildTimingId, TimeableCalendarPlan, CalendarPlanEnum } from 'lyvely-common';
import { useProfileStore } from '@/modules/user/store/profile.store';

export const useTimingStore = defineStore('timing', {
  state: () => ({
    currentDate: new Date(),
    dragActive: false
  }),
  getters: {
    date: (state) => <Date> state.currentDate
  },
  actions: {
    getTimingId(plan: CalendarPlanEnum) {
      const { locale } = useProfileStore();
      return buildTimingId(plan, this.date, locale);
    },
    setDragActive(drag: boolean) {
      this.dragActive = drag;
    },
    setCurrentDate(date: Date) {
      this.currentDate = date;
    },
    decrementTiming(plan: CalendarPlanEnum) {
      const calendarPlan = TimeableCalendarPlan.getInstance(plan);
      // not sure why we need to cast here...
      this.setCurrentDate(calendarPlan.decrement(<Date> this.date));
    },
    isInFurure(): boolean {
      return this.date > new Date();
    },
    incrementTiming(plan: CalendarPlanEnum) {
      const calendarPlan = TimeableCalendarPlan.getInstance(plan);
      // not sure why we need to cast here...
      this.currentDate = calendarPlan.increment(<Date> this.date);
    }
  }
});
