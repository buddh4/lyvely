import { CalendarDateTime, dateTime } from '../interfaces';
import { CalendarInterval } from './calendar-interval.enum';
import { CalendarPlan } from '@/calendar-plan';

/* export const REGEX_TID =
  /^Y:\d{4};Q:[0-4];M:(?:[1-9]|1[0-2]);W:(?:[1-9]|[1-4]\d|5[0-3]);D:(?:[1-9]|[1-2]\d|3[0-1])$/; */

export enum WeekStrategy {
  ISO,
  LOCALE,
}

export function toTimingId(
  cd: CalendarDateTime,
  level = CalendarInterval.Daily,
  locale = 'de',
  weekStrategy = WeekStrategy.LOCALE,
) {
  // TODO: dayJs locale support
  locale = locale.split('-')[0];
  if (level <= CalendarInterval.Unscheduled) return 'U';
  if (level === CalendarInterval.Weekly) return toWeekTimingId(cd, locale, weekStrategy);

  const dt = dateTime(cd, false, locale);
  const d = dt.toDate();
  let result = `Y:${d.getUTCFullYear()}`;

  if (level <= CalendarInterval.Yearly) return result;

  result += `;Q:${dt.quarter()}`;

  if (level <= CalendarInterval.Quarterly) return result;

  result += `;M:${pad(d.getUTCMonth() + 1)}`;

  if (level <= CalendarInterval.Monthly) return result;

  return result + `;D:${pad(d.getDate())}`;
}

export function toWeekTimingId(
  cd: CalendarDateTime,
  locale: string,
  weekStrategy = WeekStrategy.LOCALE,
) {
  const date = dateTime(cd, false, locale);
  let weekYear, weekOfYear, firstDayOfWeek;

  if (weekStrategy === WeekStrategy.LOCALE) {
    weekYear = date.weekYear();
    weekOfYear = date.week();
    firstDayOfWeek = date.weekday(0);
  } else if (weekStrategy === WeekStrategy.ISO) {
    weekYear = date.isoWeekYear();
    weekOfYear = date.isoWeek();
    firstDayOfWeek = date.isoWeekday(1); // Monday
  }

  let month = firstDayOfWeek.month() + 1;
  let quarter = firstDayOfWeek.quarter();

  if (date.year() < weekYear || firstDayOfWeek.year() < weekYear) {
    month = 1;
    quarter = 1;
  } else if (date.year() > weekYear) {
    month = 12;
    quarter = 4;
  }

  return `Y:${weekYear};Q:${quarter};M:${pad(month)};W:${pad(weekOfYear)}`;
}

function pad(num) {
  const s = '0' + num;
  return s.substring(s.length - 2);
}

export function getTimingIds(
  d: CalendarDateTime,
  locale: string,
  level = CalendarInterval.Unscheduled,
  weekStrategy = WeekStrategy.LOCALE,
) {
  const dayId = toTimingId(d, CalendarInterval.Daily, locale);
  const weekId = toWeekTimingId(d, locale, weekStrategy);
  const monthId = dayId.substring(0, dayId.lastIndexOf(';'));
  const quarterId = monthId.substring(0, monthId.lastIndexOf(';'));
  const yearId = quarterId.substring(0, quarterId.lastIndexOf(';'));
  const result = ['U', yearId, quarterId, monthId, weekId, dayId];
  return level > 0 ? result.splice(0, level) : result;
}

export function getTidWindow(
  interval: CalendarInterval,
  locale: string,
  windowSize?: number,
  weekStrategy = WeekStrategy.LOCALE,
) {
  const calendarPlan = CalendarPlan.getInstance(interval);
  windowSize ||= calendarPlan.getDefaultWindowSize();
  const now = new Date();
  const tids = [];
  for (let i = windowSize - 1; i >= 0; i--) {
    tids.push(toTimingId(calendarPlan.decrement(now, i), interval, locale, weekStrategy));
  }
  return tids;
}
