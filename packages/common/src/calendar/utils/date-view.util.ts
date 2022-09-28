import { Days, Months, CalendarDate, dateTime } from '../interfaces';

export function getMonthNameByIndex(id: number, short = false) {
  return short ? Months[id] : Months[id].substring(0, 3);
}

export function getMonthNames() {
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
    getMonthNameByIndex(11),
  ];
}

export function getDayNameByIndex(id: number) {
  return Days[id];
}

export function formatDate(date: CalendarDate, format = 'YYYY-MM-DD') {
  return dateTime(date).format(format);
}
