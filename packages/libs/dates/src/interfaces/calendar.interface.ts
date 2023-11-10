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

type CalendarUnitTypeShort = 'd' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms';
type CalendarUnitTypeLong =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';
type CalendarUnitTypeLongPlural =
  | 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'quarters'
  | 'years';
export type CalendarUnitType =
  | CalendarUnitTypeLong
  | CalendarUnitTypeLongPlural
  | CalendarUnitTypeShort;
