import { CalendarDate, dateTime } from '../interfaces';

export function subtractMilliSeconds(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).subtract(count, 'milliseconds').toDate();
}

export function addMilliSeconds(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).add(count, 'milliseconds').toDate();
}

export function subtractSeconds(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).subtract(count, 'seconds').toDate();
}

export function addSeconds(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).add(count, 'seconds').toDate();
}

export function subtractMinutes(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).subtract(count, 'minutes').toDate();
}

export function addMinutes(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).add(count, 'minutes').toDate();
}

export function subtractDays(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).subtract(count, 'days').toDate();
}

export function addDays(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).add(count, 'days').toDate();
}

export function addWeek(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).add(count, 'week').toDate();
}

export function subtractWeek(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).subtract(count, 'week').toDate();
}

export function addMonth(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).add(count, 'month').toDate();
}

export function subtractMonth(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).subtract(count, 'month').toDate();
}

export function addQuarter(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).add(count, 'quarter').toDate();
}

export function subtractQuarter(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).subtract(count, 'quarter').toDate();
}

export function addYear(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).add(count, 'year').toDate();
}

export function subtractYear(date: CalendarDate, count: number, fullDay = true): Date {
  return dateTime(date, fullDay).subtract(count, 'year').toDate();
}