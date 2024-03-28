import { CalendarDate, dateTime } from '../interfaces';
import { CalendarTimeInterval } from '../models/calendar-interval.enum';

export function subtractByInterval(
  date: CalendarDate,
  interval: CalendarTimeInterval,
  count: number,
): Date {
  switch (interval) {
    case CalendarTimeInterval.Unscheduled:
      return dateTime(date).toDate();
    case CalendarTimeInterval.Yearly:
      return subtractYears(date, count);
    case CalendarTimeInterval.Quarterly:
      return subtractQuarters(date, count);
    case CalendarTimeInterval.Monthly:
      return subtractMonths(date, count);
    case CalendarTimeInterval.Weekly:
      return subtractWeeks(date, count);
    case CalendarTimeInterval.Daily:
      return subtractDays(date, count);
    case CalendarTimeInterval.Hourly:
      return subtractHours(date, count);
    case CalendarTimeInterval.Minutely:
      return subtractMinutes(date, count);
    case CalendarTimeInterval.Secondly:
      return subtractSeconds(date, count);
    case CalendarTimeInterval.Millisecondly:
      return subtractMilliSeconds(date, count);
  }
}

export function addByInterval(
  date: CalendarDate,
  interval: CalendarTimeInterval,
  count: number,
): Date {
  switch (interval) {
    case CalendarTimeInterval.Unscheduled:
      return dateTime(date).toDate();
    case CalendarTimeInterval.Yearly:
      return addYear(date, count);
    case CalendarTimeInterval.Quarterly:
      return addQuarter(date, count);
    case CalendarTimeInterval.Monthly:
      return addMonth(date, count);
    case CalendarTimeInterval.Weekly:
      return addWeek(date, count);
    case CalendarTimeInterval.Daily:
      return addDays(date, count);
    case CalendarTimeInterval.Hourly:
      return addHours(date, count);
    case CalendarTimeInterval.Minutely:
      return addMinutes(date, count);
    case CalendarTimeInterval.Secondly:
      return addSeconds(date, count);
    case CalendarTimeInterval.Millisecondly:
      return addMilliSeconds(date, count);
  }
}

export function subtractMilliSeconds(date: CalendarDate, count: number): Date {
  return dateTime(date).subtract(count, 'milliseconds').toDate();
}

export function addMilliSeconds(date: CalendarDate, count: number): Date {
  return dateTime(date).add(count, 'milliseconds').toDate();
}

export function subtractSeconds(date: CalendarDate, count: number): Date {
  return dateTime(date).subtract(count, 'seconds').toDate();
}

export function addSeconds(date: CalendarDate, count: number): Date {
  return dateTime(date).add(count, 'seconds').toDate();
}

export function subtractMinutes(date: CalendarDate, count: number): Date {
  return dateTime(date).subtract(count, 'minutes').toDate();
}

export function addMinutes(date: CalendarDate, count: number): Date {
  return dateTime(date).add(count, 'minutes').toDate();
}

export function subtractHours(date: CalendarDate, count: number): Date {
  return dateTime(date).subtract(count, 'hours').toDate();
}

export function addHours(date: CalendarDate, count: number): Date {
  return dateTime(date).add(count, 'hours').toDate();
}

export function subtractDays(date: CalendarDate, count: number): Date {
  return dateTime(date).subtract(count, 'days').toDate();
}

export function addDays(date: CalendarDate, count: number): Date {
  return dateTime(date).add(count, 'days').toDate();
}

export function addWeek(date: CalendarDate, count: number): Date {
  return dateTime(date).add(count, 'week').toDate();
}

export function subtractWeeks(date: CalendarDate, count: number): Date {
  return dateTime(date).subtract(count, 'week').toDate();
}

export function addMonth(date: CalendarDate, count: number): Date {
  return dateTime(date).add(count, 'month').toDate();
}

export function subtractMonths(date: CalendarDate, count: number): Date {
  return dateTime(date).subtract(count, 'month').toDate();
}

export function addQuarter(date: CalendarDate, count: number): Date {
  return dateTime(date).add(count, 'quarter').toDate();
}

export function subtractQuarters(date: CalendarDate, count: number): Date {
  return dateTime(date).subtract(count, 'quarter').toDate();
}

export function addYear(date: CalendarDate, count: number): Date {
  return dateTime(date).add(count, 'year').toDate();
}

export function subtractYears(date: CalendarDate, count: number): Date {
  return dateTime(date).subtract(count, 'year').toDate();
}

export function isSameDay(date1: CalendarDate, date2: CalendarDate) {
  const d1 = dateTime(date1);
  const d2 = dateTime(date2);
  return d1.year() === d2.year() && d1.month() === d2.month() && d1.date() === d2.date();
}

export function getLastDayOfYear(year: number): Date {
  return new Date(year + 1, 0, 0);
}
