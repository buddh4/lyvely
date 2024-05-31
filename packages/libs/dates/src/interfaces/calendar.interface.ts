import { IDateTime } from './date-time.interface';

export const REGEX_DATE_FORMAT = '^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$';

export enum Months {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

export enum Days {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

/**
 * This union type includes commonly supported types for date parameters:
 *
 * - string: will be parsed, for full day dates use 'YYYY-MM-DD', otherwise parsing is delegated to the date-time adapter
 * - number: a unix timestamp
 * - Date: a javascript date object
 */
export type CalendarDate = string | number | Date;

/**
 * This union type extends the CalendarDate by supporting the IDateTime adapter interface.
 */
export type CalendarDateTime = CalendarDate | IDateTime;

/**
 * This interface defines calendar preferences, which can be used to overwrite locale specific behavior.
 */
export interface ICalendarPreferences {
  /**
   * Defines the start of a week. If the value is 1, Monday will be the start of week instead of Sunday
   */
  weekStart?: number;

  /**
   * Defines the start of the year, e.g. 4 means the week that contains Jan 4th is the first week of the year.
   * The value should be between 0 and 7 where 0 means the calculation of the first week is done by ISO standard.
   */
  yearStart?: number;
}
