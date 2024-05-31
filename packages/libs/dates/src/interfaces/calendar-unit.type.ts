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
