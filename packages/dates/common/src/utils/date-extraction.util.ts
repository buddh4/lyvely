import { CalendarDate, dateTime } from '../interfaces';

export function getSecondsSinceStartOfDay(d: CalendarDate): number {
  const date = d instanceof Date ? d : dateTime(d).toDate();
  return date.getSeconds() + 60 * (date.getMinutes() + 60 * date.getHours());
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

export function isToday(cDate: CalendarDate) {
  const today = new Date();
  const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
}

export function isThisYear(cDate: CalendarDate) {
  const today = new Date();
  const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
  return date.getFullYear() == today.getFullYear();
}

export function isThisMonth(cDate: CalendarDate) {
  const today = new Date();
  const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
  return date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear();
}

export function isInFuture(cDate: CalendarDate, ignoreTime = false) {
  const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
  const now = new Date();

  if (ignoreTime) {
    return (
      new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) >
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
    );
  }

  return date > new Date();
}
