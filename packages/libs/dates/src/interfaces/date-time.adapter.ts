import { IDateTime } from './date-time.interface';
import { CalendarDate, CalendarDateTime, ICalendarPreferences } from './calendar.interface';

export type DateTimeFactory = (
  date?: CalendarDate,
  locale?: string,
  preferences?: ICalendarPreferences,
) => IDateTime;

let dateTimeFactory: DateTimeFactory;

export function setDateTimeFactory(factory: DateTimeFactory) {
  dateTimeFactory = factory;
}

export function dateTime(
  date?: CalendarDateTime,
  locale?: string,
  preferences?: ICalendarPreferences,
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
 * Returns a date instance without time.
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
 * Returns a date instance without time.
 * @param date
 */
export function getFullDayUTCDate(cd: CalendarDate): Date {
  const date = getFullDayDate(cd);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
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
export function toDate(date: CalendarDateTime) {
  return dateTime(date).toDate();
}
