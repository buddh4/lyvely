import { CalendarPlan, isToday as isTodayUtil } from '@lyvely/calendar-plan-interface';
import { CalendarInterval } from '@lyvely/dates';
import { translate } from '@/i18n';
import { getDefaultLocale } from '@/util';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { computed, toRefs } from 'vue';
import { useCalendarPlanStore } from '@/modules/calendar-plan';

export function useCalendarPlanPlanNavigation(interval: CalendarInterval) {
  const calendarPlanStore = useCalendarPlanStore();
  const { date, isToday } = toRefs(calendarPlanStore);
  const calendarPlan = CalendarPlan.getInstance(interval);
  const { locale: userLocale } = useAuthStore();
  const { locale: profileLocale } = useProfileStore();
  const { switchToToday, getNextDate, getPreviousDate } = calendarPlanStore;

  const isDaily = interval === CalendarInterval.Daily;
  const isWeekly = interval === CalendarInterval.Weekly;
  const isUnscheduled = interval === CalendarInterval.Unscheduled;

  function getAccessibleTitle(d: Date) {
    let title = calendarPlan.getAccessibleTitle(
      d,
      (isWeekly ? profileLocale : userLocale) || getDefaultLocale(),
    );

    if (isDaily && isTodayUtil(d)) {
      title = translate('calendar-plan.today') + ' ' + title;
    }

    return title;
  }

  const title = computed(() =>
    calendarPlan.getTitle(
      date.value,
      (isWeekly ? profileLocale : userLocale) || getDefaultLocale(),
    ),
  );

  const accessibleTitle = computed(() => getAccessibleTitle(date.value));
  const showTodayIcon = computed(() => isDaily && !isToday.value);
  const rightCaret = computed(() => (isUnscheduled ? false : '▸'));
  const leftCaret = computed(() => (isUnscheduled ? false : '◂'));
  const nextTitle = computed(() => getAccessibleTitle(getNextDate(calendarPlan)));
  const prevTitle = computed(() => getAccessibleTitle(getPreviousDate(calendarPlan)));
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
