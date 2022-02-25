import { Days, Months, CalendarDate, dateTime  } from '../interfaces';

export function getMonthNameByIndex(id: number, short: boolean = false) {
  return short ? Months[id] : Months[id].substr(0, 3);
}

export function getMonthNames(short: boolean = false) {
  return [
    getMonthNameByIndex(0),
    getMonthNameByIndex(1),
    getMonthNameByIndex(2),
    getMonthNameByIndex(3),
    getMonthNameByIndex(4),
    getMonthNameByIndex(5),
    getMonthNameByIndex(6),
    getMonthNameByIndex(7),
    getMonthNameByIndex(8),
    getMonthNameByIndex(9),
    getMonthNameByIndex(10),
    getMonthNameByIndex(11)
  ]
}

export function getDayNameByIndex(id: number) {
  return Days[id];
}

export function formatDate(date: CalendarDate, format: string = 'YYYY-MM-DD') {
  return dateTime(date).format(format);
}