import { CalendarPlan } from '@lyvely/calendar-plan-interface';
import { CalendarInterval, isToday as isTodayUtil } from '@lyvely/dates';
import { useProfileStore, useI18nStore, getFallbackLocale, t } from '@lyvely/web';
import { computed, toRefs } from 'vue';
import { useCalendarPlanStore } from '../stores';

export function useCalendarPlanPlanNavigation(interval: CalendarInterval) {
  const profileStore = useProfileStore();
  const calendarPlanStore = useCalendarPlanStore();
  const { date, isToday } = toRefs(calendarPlanStore);
  const calendarPlan = CalendarPlan.getInstance(interval);
  const { locale } = useI18nStore();
  const { switchToToday, getNextDate, getPreviousDate } = calendarPlanStore;

  const isDaily = interval === CalendarInterval.Daily;
  const isWeekly = interval === CalendarInterval.Weekly;
  const isUnscheduled = interval === CalendarInterval.Unscheduled;

  function getAccessibleTitle(d: Date) {
    // For weekly
    const localeValue = (isWeekly ? profileStore.locale : locale) || getFallbackLocale();
    let title = t(
      calendarPlan.getAccessibleTitle(d, localeValue, profileStore.getSetting('calendar'))
    );

    if (isDaily && isTodayUtil(d)) {
      title = t('calendar-plan.today') + ' ' + title;
    }

    return title;
  }

  const title = computed(() =>
    t(calendarPlan.getTitle(date.value, locale, profileStore.getSetting('calendar')))
  );

  const accessibleTitle = computed(() => t(getAccessibleTitle(date.value)));
  const showTodayIcon = computed(() => isDaily && !isToday.value);
  const rightCaret = computed(() => (isUnscheduled ? false : '▸'));
  const leftCaret = computed(() => (isUnscheduled ? false : '◂'));
  const nextTitle = computed(() => t(getAccessibleTitle(getNextDate(calendarPlan))));
  const prevTitle = computed(() => t(getAccessibleTitle(getPreviousDate(calendarPlan))));
  const label = CalendarPlan.getInstance(interval).getLabel().toLocaleLowerCase();

  function incrementTiming() {
    calendarPlanStore.incrementTiming(interval);
  }

  function decrementTiming() {
    calendarPlanStore.decrementTiming(interval);
  }

  return {
    accessibleTitle,
    switchToToday,
    showTodayIcon,
    rightCaret,
    leftCaret,
    nextTitle,
    prevTitle,
    incrementTiming,
    decrementTiming,
    label,
    title,
    date,
  };
}
