import { IDateTime } from './date-time.interface';
import { CalendarDate, CalendarDateTime } from './calendar.interface';

export type DateTimeFactory = (
  date?: CalendarDate,
  utc?: boolean,
  locale?: string,
  timezone?: string,
) => IDateTime;

let dateTimeFactory: DateTimeFactory;

export function setDateTimeFactory(factory: DateTimeFactory) {
  dateTimeFactory = factory;
}

export function dateTime(
  date?: CalendarDateTime,
  utc = false,
  locale?: string,
  timezone?: string,
): IDateTime {
  if (!dateTimeFactory) {
    throw new Error('No dateTimeFactory set');
  }

  if (implementsIDateTime(date)) return date;

  if (typeof date === 'string' && /^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(date)) {
    date = getFullDayDate(date);
  }

  return dateTimeFactory(date, utc, locale, timezone);
}

/**
 * Returns an utc date instance without time. When given a string this function cuts
 * @param date
 */
export function getFullDayDate(date: CalendarDate): Date {
  if (typeof date === 'string') {
    const dateNoTime = date.split('T')[0];
    if (/^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(dateNoTime)) {
      const splitDate = dateNoTime.split('-');
      date = new Date(
        Date.UTC(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2])),
      );
    } else {
      date = new Date(date);
    }
  } else if (date instanceof Date) {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  }

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date;
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
