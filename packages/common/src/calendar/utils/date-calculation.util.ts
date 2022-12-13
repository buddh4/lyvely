import { CalendarDate, dateTime } from '../interfaces';
import { CalendarTimeInterval } from '@/calendar';

export function subtractByInterval(
  date: CalendarDate,
  interval: CalendarTimeInterval,
  count: number,
  utc = true,
): Date {
  switch (interval) {
    case CalendarTimeInterval.Unscheduled:
      return dateTime(date, utc).toDate();
    case CalendarTimeInterval.Yearly:
      return subtractYear(date, count, utc);
    case CalendarTimeInterval.Quarterly:
      return subtractQuarter(date, count, utc);
    case CalendarTimeInterval.Monthly:
      return subtractMonth(date, count, utc);
    case CalendarTimeInterval.Weekly:
      return subtractWeek(date, count, utc);
    case CalendarTimeInterval.Daily:
      return subtractDays(date, count, utc);
    case CalendarTimeInterval.Hourly:
      return subtractHours(date, count, utc);
    case CalendarTimeInterval.Minutely:
      return subtractMinutes(date, count, utc);
    case CalendarTimeInterval.Secondly:
      return subtractSeconds(date, count, utc);
    case CalendarTimeInterval.Millisecondly:
      return subtractMilliSeconds(date, count, utc);
  }
}

export function addByInterval(
  date: CalendarDate,
  interval: CalendarTimeInterval,
  count: number,
  utc = true,
): Date {
  switch (interval) {
    case CalendarTimeInterval.Unscheduled:
      return dateTime(date, utc).toDate();
    case CalendarTimeInterval.Yearly:
      return addYear(date, count, utc);
    case CalendarTimeInterval.Quarterly:
      return addQuarter(date, count, utc);
    case CalendarTimeInterval.Monthly:
      return addMonth(date, count, utc);
    case CalendarTimeInterval.Weekly:
      return addWeek(date, count, utc);
    case CalendarTimeInterval.Daily:
      return addDays(date, count, utc);
    case CalendarTimeInterval.Hourly:
      return addHours(date, count, utc);
    case CalendarTimeInterval.Minutely:
      return addMinutes(date, count, utc);
    case CalendarTimeInterval.Secondly:
      return addSeconds(date, count, utc);
    case CalendarTimeInterval.Millisecondly:
      return addMilliSeconds(date, count, utc);
  }
}

export function subtractMilliSeconds(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).subtract(count, 'milliseconds').toDate();
}

export function addMilliSeconds(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).add(count, 'milliseconds').toDate();
}

export function subtractSeconds(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).subtract(count, 'seconds').toDate();
}

export function addSeconds(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).add(count, 'seconds').toDate();
}

export function subtractMinutes(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).subtract(count, 'minutes').toDate();
}

export function addMinutes(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).add(count, 'minutes').toDate();
}

export function subtractHours(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).subtract(count, 'hours').toDate();
}

export function addHours(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).add(count, 'hours').toDate();
}

export function subtractDays(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).subtract(count, 'days').toDate();
}

export function addDays(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).add(count, 'days').toDate();
}

export function addWeek(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).add(count, 'week').toDate();
}

export function subtractWeek(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).subtract(count, 'week').toDate();
}

export function addMonth(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).add(count, 'month').toDate();
}

export function subtractMonth(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).subtract(count, 'month').toDate();
}

export function addQuarter(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).add(count, 'quarter').toDate();
}

export function subtractQuarter(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).subtract(count, 'quarter').toDate();
}

export function addYear(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).add(count, 'year').toDate();
}

export function subtractYear(date: CalendarDate, count: number, utc = true): Date {
  return dateTime(date, utc).subtract(count, 'year').toDate();
}

export function isSameDay(date1: CalendarDate, date2: CalendarDate) {
  const d1 = dateTime(date1);
  const d2 = dateTime(date2);
  return d1.year() === d2.year() && d1.month() === d2.month() && d1.date() === d2.date();
}
