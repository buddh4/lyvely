import { CalendarInterval } from '../models';
import {
  dateTime,
  CalendarDateTime,
  ICalendarPreferences,
  IDateTime,
  ITiming,
} from '../interfaces';

/**
 * Converts a CalendarDateTime object into a timing-id string.
 *
 * A tid can have the following format:
 *
 * - Daily: 'Y:2023;Q:01;M:02;D:01'
 * - Weekly: 'Y:2023;Q:01;M:01;W:01'
 * - Monthly: 'Y:2023;Q:01;M:01'
 * - Quarterly: 'Y:2023;Q:01'
 * - Yearly: 'Y:2023'
 * - Unscheduled: 'U'
 *
 * Note: The week number is exclusively included in the weekly tid. This is due to the possibility of a week
 * overlapping into a different year, quarter, or month. For instance, the last week of a year may extend into the new
 * year.
 *
 * @param {CalendarDateTime} cd - The CalendarDateTime object to convert.
 * @param {number} [level=1] - The level of detail for the timing identifier.
 * @param {string} [locale='en'] - The locale to use for formatting the date.
 * @param {ICalendarPreferences} [preferences] - Additional preferences for formatting the date.
 * @returns {string} - The timing identifier string.
 */
export function toTimingId(
  cd: CalendarDateTime,
  level = CalendarInterval.Daily,
  locale = 'en',
  preferences?: ICalendarPreferences
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

/**
 * Converts a CalendarDateTime object to a weekly timing-id string.
 *
 * @param {CalendarDateTime} cd - The CalendarDateTime object to convert.
 * @param {string} locale - The locale to use for the conversion.
 * @param {ICalendarPreferences} [preferences] - The optional calendar preferences object.
 *
 * @return {string} The WeekTimingId string representation of the given CalendarDateTime.
 */
export function toWeekTimingId(
  cd: CalendarDateTime,
  locale: string,
  preferences?: ICalendarPreferences
): string {
  const date = dateTime(cd, locale, preferences);
  let weekYear: number, month: number, quarter: number, firstDayOfWeek: IDateTime;
  const weekOfYear = getWeekOfYear(date, locale, preferences);

  // Use ISO week date calculations if yearStart === 0
  if (preferences?.yearStart === 0) {
    weekYear = date.isoWeekYear();
    firstDayOfWeek = date.isoWeekday(preferences.weekStart ?? 1); // default Monday
  } else {
    weekYear = date.weekYear();
    firstDayOfWeek = date.weekday(0); // Locale aware first day of week
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

/**
 * Calculates the week of the year for the given date and preferences.
 *
 * @param {CalendarDateTime} cd - The calendar date and time.
 * @param {string} locale - The locale used for formatting the date.
 * @param {ICalendarPreferences} [preferences] - The calendar preferences.
 *
 * @returns {number} The week of the year.
 */
export function getWeekOfYear(
  cd: CalendarDateTime,
  locale: string,
  preferences?: ICalendarPreferences
) {
  const date = dateTime(cd, locale, preferences);
  return preferences?.yearStart === 0 ? date.isoWeek() : date.week();
}

/**
 * Parses a timing ID string into an object of timing values.
 *
 * @param {string} tid - The timing ID string to parse.
 *
 * @returns {ITiming} - An object representing the parsed timing values.
 */
export function parseTimingId(tid: string): ITiming {
  return tid.split(';').reduce(
    (timing, part) => {
      const tidKey = part[0];
      const value = +part.substring(2, part.length);
      switch (tidKey.toUpperCase()) {
        case 'Y':
          timing.year = value;
          break;
        case 'Q':
          timing.quarter = value;
          break;
        case 'M':
          timing.month = value;
          break;
        case 'W':
          timing.week = value;
          break;
        case 'D':
          timing.day = value;
          break;
      }
      return timing;
    },
    { tid } as ITiming
  );
}

/**
 * Creates all possible timing-ids for a given date and level, based on the specified parameters.
 *
 * If the selected level is 'Unscheduled' (default), all possible 'tids' will be returned. On the contrary,
 * if a different level is chosen, 'tids' associated with non-included levels will be excluded.
 *
 * @param {CalendarDateTime} d - The date for which to retrieve timing ids.
 * @param {string} locale - The locale to use for formatting the timing ids.
 * @param {ICalendarPreferences} [preferences] - The calendar preferences to use for formatting the timing ids.
 * @param {CalendarInterval} [level=CalendarInterval.Unscheduled] - The level of timing ids to retrieve.
 * @returns {string[]} - An array of timing ids for the given date.
 */
export function getTimingIds(
  d: CalendarDateTime,
  locale: string,
  preferences?: ICalendarPreferences,
  level = CalendarInterval.Unscheduled
) {
  const dayId = toTimingId(d, CalendarInterval.Daily, locale);
  const weekId = toWeekTimingId(d, locale, preferences);
  const monthId = dayId.substring(0, dayId.lastIndexOf(';'));
  const quarterId = monthId.substring(0, monthId.lastIndexOf(';'));
  const yearId = quarterId.substring(0, quarterId.lastIndexOf(';'));
  const result = ['U', yearId, quarterId, monthId, weekId, dayId];
  return level > 0 ? result.splice(level, result.length) : result;
}
