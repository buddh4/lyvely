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

export function msToTime(ms: number) {
  return secondsToTime(Math.trunc(ms / 1000));
}

export function secondsToTime(seconds: number) {
  const hours = Math.trunc(seconds / 3600); // 3,600 seconds per hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  const minutes = Math.trunc(seconds / 60); // 60 seconds per minute
  seconds = seconds % 60; // Keep only seconds not extracted to minutes
  return {
    hours,
    minutes,
    seconds,
  };
}

function pad(num) {
  const s = '0' + num;
  return s.substring(s.length - 2);
}

export function formatTime({ hours, minutes, seconds }) {
  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}
