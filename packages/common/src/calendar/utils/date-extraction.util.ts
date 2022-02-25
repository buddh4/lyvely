import { Months, WeekOfYear, CalendarDate, dateTime, getFullDayDate } from '../interfaces';

export function getYearAndWeekOfYear(date: CalendarDate, locale: string): WeekOfYear {
  date = getFullDayDate(date);
  let year = date.getUTCFullYear();
  const weekOfYear = getWeekOfYear(date, locale);
  const month = date.getUTCMonth();

  if (month === Months.January && weekOfYear > 1) {
    year--;
  }

  if (month === Months.December && weekOfYear === 1) {
    year++;
  }

  return { year: year, weekOfYear: weekOfYear };
}

export function getSecondsSinceStartOfDay(d: CalendarDate): number {
  const date = d instanceof Date ? d : dateTime(d).toDate();
  return date.getSeconds() + (60 * (date.getMinutes() + (60 * date.getHours())));
}

export function getWeekOfYear(date: CalendarDate, locale: string): number {
  return dateTime(date, false, locale).week();
}

export function getIsoWeekOfYear(date: CalendarDate): number {
  return dateTime(date).isoWeek();
}

export function getQuarter(date: CalendarDate): number {
  return dateTime(date).quarter();
}

export function isCurrentYear(date: CalendarDate): boolean {
  return dateTime(date).year() === dateTime().year();
}

export function isToday(someDate: Date) {
  const today = new Date();
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear();
}