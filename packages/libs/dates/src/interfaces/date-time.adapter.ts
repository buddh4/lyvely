import { IDateTime } from './date-time.interface';
import { CalendarDate, CalendarDateTime, ICalendarPreferences } from './calendar.interface';

export type DateTimeFactory = (
  date?: CalendarDate,
  locale?: string,
  preferences?: ICalendarPreferences
) => IDateTime;

let dateTimeFactory: DateTimeFactory;

export function setDateTimeFactory(factory: DateTimeFactory) {
  dateTimeFactory = factory;
}

export function dateTime(
  date?: CalendarDateTime,
  locale?: string,
  preferences?: ICalendarPreferences
): IDateTime {
  if (!dateTimeFactory) {
    throw new Error('No dateTimeFactory set');
  }

  if (implementsIDateTime(date)) return date;

  if (typeof date === 'string' && /^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(date)) {
    date = getFullDayDate(date);
  }

  return dateTimeFactory(date, locale, preferences);
}

/**
 * Returns a date instance without time information in the local timezone.
 * @param date
 */
export function getFullDayDate(date: CalendarDate): Date {
  if (typeof date === 'string') {
    const dateNoTime = date.split('T')[0];
    if (/^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(dateNoTime)) {
      const splitDate = dateNoTime.split('-');
      date = new Date(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2]));
    } else {
      date = new Date(date);
    }
  } else if (date instanceof Date) {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

/**
 * Returns a date instance without time in utc timezone.
 * @param cd - The calendar date.
 */
export function getFullDayUTCDate(cd: CalendarDate): Date {
  const date = getFullDayDate(cd);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
}

/**
 * Retrieves the start of the day in the specified time zone.
 *
 * @exmaple
 *
 * getFullDayTZDate('2024-05-03', 'Europe/Berlin');
 * // Will result in 2024-05-02T22:00:00.000Z
 *
 * getFullDayTZDate('2024-05-03', 'America/Los_Angeles');
 * // Will result in 2024-05-03T07:00:00.000Z
 *
 * @param {CalendarDate} cd - The calendar date.
 * @param {string} tz - The time zone.
 * @returns {Date} - The full day date in the specified time zone.
 */
export function getFullDayTZDate(cd: CalendarDate, tz: string): Date {
  return dateTime(getFullDayDate(cd)).toTZ(tz).toDate();
}

/**
 * Retrieves the end of the day in the specified time zone, which is one second before the next day starts.
 *
 * @exmaple
 *
 * getEndOfDayTZDate('2024-05-03', 'Europe/Berlin');
 * // Will result in 2024-05-03T21:59:59.000Z
 *
 * getEndOfDayTZDate('2024-05-03', 'America/Los_Angeles');
 * // Will result in 2024-05-04T06:59:59.000Z
 *
 * @param {CalendarDate} cd - The calendar date.
 * @param {string} tz - The time zone.
 * @returns {Date} - The full day date in the specified time zone.
 */
export function getEndOfDayTZDate(cd: CalendarDate, tz: string): Date {
  return dateTime(getFullDayDate(cd)).toTZ(tz).add(1, 'day').subtract(1, 'second').toDate();
}

/**
 * Type guard for checking if the given object implements IDateTime
 * @param obj true if obj implements IDateTime otherwise false.
 */
export function implementsIDateTime(obj: any): obj is IDateTime {
  return obj && (<IDateTime>obj).isDateTime === true;
}

/**
 * Transforms the given CalendarDateTime to a JavaScript Date object.
 * @param date
 */
export function toDate(date: CalendarDateTime): Date {
  return dateTime(date).toDate();
}
