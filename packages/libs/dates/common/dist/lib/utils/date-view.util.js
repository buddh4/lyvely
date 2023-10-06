import { Days, Months, dateTime } from '../interfaces';
export function getMonthNameByIndex(id, short = false) {
    return short ? Months[id] : Months[id].substring(0, 3);
}
export function getLocalizedDays(format = 'long') {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(Date.UTC(2022, 0, i + 3));
        days.push(date.toLocaleDateString(undefined, { weekday: format }));
    }
    return days;
}
export function getLocalizedMonths(format = 'long') {
    const months = [];
    for (let i = 0; i < 12; i++) {
        const date = new Date(Date.UTC(2022, i, 1));
        months.push(date.toLocaleDateString(undefined, { month: format }));
    }
    return months;
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
export function getDayNameByIndex(id) {
    return Days[id];
}
export function getDayNames() {
    return [
        getDayNameByIndex(0),
        getDayNameByIndex(1),
        getDayNameByIndex(2),
        getDayNameByIndex(3),
        getDayNameByIndex(4),
        getDayNameByIndex(5),
        getDayNameByIndex(6),
    ];
}
export function formatDate(date, format = 'YYYY-MM-DD') {
    return dateTime(date).format(format);
}
export function formatDateWithTime(date, format = 'YYYY.MM.DD, HH:mm') {
    return dateTime(date).format(format);
}
export function getRelativeTime(timeInMs, locale, style = 'long') {
    const rtf1 = new Intl.RelativeTimeFormat(locale, { style: style });
    const timeInSec = Math.floor(timeInMs / 1000);
    const sign = timeInSec > 0 ? 1 : -1;
    const timeInSecAbs = Math.abs(Math.floor(timeInMs / 1000));
    if (timeInSecAbs < 60) {
        return rtf1.format(timeInSec, 'second');
    }
    else if (timeInSecAbs < 3600) {
        return rtf1.format(sign * Math.floor(timeInSecAbs / 60), 'minute');
    }
    else if (timeInSecAbs < 86400) {
        return rtf1.format(sign * Math.floor(timeInSecAbs / 3600), 'hour');
    }
    else if (timeInSecAbs < 604800) {
        return rtf1.format(sign * Math.floor(timeInSecAbs / 86400), 'day');
    }
    else if (timeInSecAbs < 2592000) {
        return rtf1.format(sign * Math.floor(timeInSecAbs / 604800), 'week');
    }
    else if (timeInSecAbs < 31536000) {
        return rtf1.format(sign * Math.floor(timeInSecAbs / 2592000), 'month');
    }
    else {
        return rtf1.format(sign * Math.floor(timeInSecAbs / 31536000), 'year');
    }
}
export function msToTime(ms) {
    return secondsToTime(Math.trunc(ms / 1000));
}
export function timeToMs({ hours, minutes, seconds }) {
    return seconds * 1000 + minutes * 1000 * 60 + hours * 1000 * 60 * 60;
}
export function secondsToTime(seconds) {
    const hours = Math.trunc(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.trunc(seconds / 60);
    seconds = seconds % 60;
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
    let result = padTime(minutes) + ':' + padTime(seconds);
    const paddedHours = padTime(hours);
    result = paddedHours === '00' ? result : paddedHours + ':' + result;
    return result;
}
//# sourceMappingURL=date-view.util.js.map