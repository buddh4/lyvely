import { CalendarInterval } from '../models';
import { dateTime, CalendarDateTime, WeekStrategy } from '../interfaces';

export function toTimingId(
  cd: CalendarDateTime,
  level = CalendarInterval.Daily,
  locale = 'en',
  weekStrategy: WeekStrategy = 'locale',
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
  weekStrategy: WeekStrategy = 'locale',
) {
  const date = dateTime(cd, false, locale);
  let weekYear, weekOfYear, firstDayOfWeek;

  if (weekStrategy === 'locale') {
    weekYear = date.weekYear();
    weekOfYear = date.week();
    firstDayOfWeek = date.weekday(0);
  } else if (weekStrategy === 'iso') {
    weekYear = date.isoWeekYear();
    weekOfYear = date.isoWeek();
    firstDayOfWeek = date.isoWeekday(1); // Monday
  }

  let month = firstDayOfWeek!.month() + 1;
  let quarter = firstDayOfWeek!.quarter();

  if (date.year() < weekYear! || firstDayOfWeek!.year() < weekYear!) {
    month = 1;
    quarter = 1;
  } else if (date.year() > weekYear!) {
    month = 12;
    quarter = 4;
  }

  return `Y:${weekYear};Q:${quarter};M:${pad(month)};W:${pad(weekOfYear!)}`;
}

function pad(num: number): string {
  const s = '0' + num;
  return s.substring(s.length - 2);
}

export function getTimingIds(
  d: CalendarDateTime,
  locale: string,
  level = CalendarInterval.Unscheduled,
  weekStrategy: WeekStrategy = 'locale',
) {
  const dayId = toTimingId(d, CalendarInterval.Daily, locale);
  const weekId = toWeekTimingId(d, locale, weekStrategy);
  const monthId = dayId.substring(0, dayId.lastIndexOf(';'));
  const quarterId = monthId.substring(0, monthId.lastIndexOf(';'));
  const yearId = quarterId.substring(0, quarterId.lastIndexOf(';'));
  const result = ['U', yearId, quarterId, monthId, weekId, dayId];
  return level > 0 ? result.splice(0, level) : result;
}
