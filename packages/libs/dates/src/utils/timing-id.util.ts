import { CalendarInterval } from '../models';
import { dateTime, CalendarDateTime, ICalendarPreferences, IDateTime } from '../interfaces';

export function toTimingId(
  cd: CalendarDateTime,
  level = CalendarInterval.Daily,
  locale = 'en',
  preferences?: ICalendarPreferences,
) {
  if (level <= CalendarInterval.Unscheduled) return 'U';
  if (level === CalendarInterval.Weekly) return toWeekTimingId(cd, locale, preferences);

  const dt = dateTime(cd, locale);
  const d = dt.toDate();
  let result = `Y:${d.getFullYear()}`;

  if (level <= CalendarInterval.Yearly) return result;

  result += `;Q:${dt.quarter()}`;

  if (level <= CalendarInterval.Quarterly) return result;

  result += `;M:${pad(d.getMonth() + 1)}`;

  if (level <= CalendarInterval.Monthly) return result;

  return result + `;D:${pad(d.getDate())}`;
}

export function toWeekTimingId(
  cd: CalendarDateTime,
  locale: string,
  preferences?: ICalendarPreferences,
): string {
  const date = dateTime(cd, locale, preferences);
  let weekYear: number,
    weekOfYear: number,
    month: number,
    quarter: number,
    firstDayOfWeek: IDateTime;

  // Use ISO week date calculations if yearStart === 0
  if (preferences?.yearStart === 0) {
    weekYear = date.isoWeekYear();
    weekOfYear = date.isoWeek();
    // Monday
    firstDayOfWeek = date.isoWeekday(1);
  } else {
    weekYear = date.weekYear();
    weekOfYear = date.week();
    // Locale aware first day of week
    firstDayOfWeek = date.weekday(0);
  }

  // Consider edge cases
  if (weekOfYear === 1) {
    month = 1;
    quarter = 1;
  } else if (weekYear !== date.year()) {
    month = 12;
    quarter = 4;
  } else {
    month = firstDayOfWeek.month() + 1;
    quarter = firstDayOfWeek.quarter();
  }

  return `Y:${weekYear};Q:${quarter};M:${pad(month)};W:${pad(weekOfYear)}`;
}

// Helper function to ensure numbers are zero-padded to two digits
function pad(number: number): string {
  return number.toString().padStart(2, '0');
}

export function getTimingIds(
  d: CalendarDateTime,
  locale: string,
  level = CalendarInterval.Unscheduled,
  preferences?: ICalendarPreferences,
) {
  const dayId = toTimingId(d, CalendarInterval.Daily, locale);
  const weekId = toWeekTimingId(d, locale, preferences);
  const monthId = dayId.substring(0, dayId.lastIndexOf(';'));
  const quarterId = monthId.substring(0, monthId.lastIndexOf(';'));
  const yearId = quarterId.substring(0, quarterId.lastIndexOf(';'));
  const result = ['U', yearId, quarterId, monthId, weekId, dayId];
  return level > 0 ? result.splice(0, level) : result;
}
