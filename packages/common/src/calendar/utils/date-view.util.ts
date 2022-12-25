import { Days, Months, CalendarDate, dateTime, CalendarDateTime } from '../interfaces';

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

export function formatDate(date: CalendarDateTime, format = 'YYYY-MM-DD') {
  return dateTime(date).format(format);
}

export function formatDateWithTime(date: CalendarDateTime, format = 'YYYY.MM.DD, HH:mm') {
  return dateTime(date).format(format);
}

export function getRelativeTime(
  timeInMs: number,
  locale: string,
  style: Intl.RelativeTimeFormatStyle = 'long',
) {
  const rtf1 = new Intl.RelativeTimeFormat(locale, { style: style });

  const timeInSec = Math.floor(timeInMs / 1000);
  const sign = timeInSec > 0 ? 1 : -1;
  const timeInSecAbs = Math.abs(Math.floor(timeInMs / 1000));

  if (timeInSecAbs < 60) {
    // Less than minute
    return rtf1.format(timeInSec, 'second');
  } else if (timeInSecAbs < 3_600 /* 60 * 60 */) {
    // Less than hour
    return rtf1.format(sign * Math.floor(timeInSecAbs / 60), 'minute');
  } else if (timeInSecAbs < 86_400 /* 60 * 60 * 24 */) {
    // Less than a day
    return rtf1.format(sign * Math.floor(timeInSecAbs / 3_600), 'hour');
  } else if (timeInSecAbs < 604_800 /* 60 * 60 * 24 * 7 */) {
    // Less than a week
    return rtf1.format(sign * Math.floor(timeInSecAbs / 86_400), 'day');
  } else if (timeInSecAbs < 2_592_000 /* 60 * 60 * 24 * 30 */) {
    // Less than a month
    return rtf1.format(sign * Math.floor(timeInSecAbs / 604_800), 'week');
  } else if (timeInSecAbs < 31_536_000 /* 60 * 60 * 24 * 365 */) {
    // Less than a year
    return rtf1.format(sign * Math.floor(timeInSecAbs / 2_592_000), 'month');
  } else {
    // More than a year
    return rtf1.format(sign * Math.floor(timeInSecAbs / 31_536_000), 'year');
  }
}

export function msToTime(ms: number) {
  return secondsToTime(Math.trunc(ms / 1000));
}

export function timeToMs({ hours, minutes, seconds }) {
  return seconds * 1000 + minutes * 1000 * 60 + hours * 1000 * 60 * 60;
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

export function padTime(num) {
  const s = '0' + num;
  return s.substring(s.length - 2);
}

export function formatTime({ hours, minutes, seconds }) {
  return padTime(hours) + ':' + padTime(minutes) + ':' + padTime(seconds);
}
