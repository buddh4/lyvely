'use strict';

var dayjs = require('dayjs');
var weekOfYear = require('dayjs/plugin/weekOfYear');
var weekYear = require('dayjs/plugin/weekYear');
var weekday = require('dayjs/plugin/weekday');
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');
var quarterOfYear = require('dayjs/plugin/quarterOfYear');
var isoWeek = require('dayjs/plugin/isoWeek');
var classValidator = require('class-validator');
require('dayjs/locale/de');
require('dayjs/locale/en');

const REGEX_DATE_FORMAT = '^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$';
exports.Months = void 0;
(function (Months) {
    Months[Months["January"] = 0] = "January";
    Months[Months["February"] = 1] = "February";
    Months[Months["March"] = 2] = "March";
    Months[Months["April"] = 3] = "April";
    Months[Months["May"] = 4] = "May";
    Months[Months["June"] = 5] = "June";
    Months[Months["July"] = 6] = "July";
    Months[Months["August"] = 7] = "August";
    Months[Months["September"] = 8] = "September";
    Months[Months["October"] = 9] = "October";
    Months[Months["November"] = 10] = "November";
    Months[Months["December"] = 11] = "December";
})(exports.Months || (exports.Months = {}));
exports.Days = void 0;
(function (Days) {
    Days[Days["Sunday"] = 0] = "Sunday";
    Days[Days["Monday"] = 1] = "Monday";
    Days[Days["Tuesday"] = 2] = "Tuesday";
    Days[Days["Wednesday"] = 3] = "Wednesday";
    Days[Days["Thursday"] = 4] = "Thursday";
    Days[Days["Friday"] = 5] = "Friday";
    Days[Days["Saturday"] = 6] = "Saturday";
})(exports.Days || (exports.Days = {}));

function implementsIDateTime(obj) {
    return obj && obj.isDateTime === true;
}
function toDate(date) {
    return dateTime(date).toDate();
}
let dateTimeFactory$1;
function setDateTimeFactory(factory) {
    dateTimeFactory$1 = factory;
}
function dateTime(date, utc = false, locale, timezone) {
    if (!dateTimeFactory$1) {
        throw new Error('No dateTimeFactory set');
    }
    if (implementsIDateTime(date))
        return date;
    if (typeof date === 'string' && /^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(date)) {
        date = getFullDayDate(date);
    }
    return dateTimeFactory$1(date, utc, locale, timezone);
}
function getFullDayDate(date) {
    if (typeof date === 'string') {
        const dateNoTime = date.split('T')[0];
        if (/^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(dateNoTime)) {
            const splitDate = dateNoTime.split('-');
            date = new Date(Date.UTC(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2])));
        }
        else {
            date = new Date(date);
        }
    }
    else if (date instanceof Date) {
        date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
}

exports.CalendarInterval = void 0;
(function (CalendarInterval) {
    CalendarInterval[CalendarInterval["Unscheduled"] = 0] = "Unscheduled";
    CalendarInterval[CalendarInterval["Yearly"] = 1] = "Yearly";
    CalendarInterval[CalendarInterval["Quarterly"] = 2] = "Quarterly";
    CalendarInterval[CalendarInterval["Monthly"] = 3] = "Monthly";
    CalendarInterval[CalendarInterval["Weekly"] = 4] = "Weekly";
    CalendarInterval[CalendarInterval["Daily"] = 5] = "Daily";
})(exports.CalendarInterval || (exports.CalendarInterval = {}));
exports.CalendarTimeInterval = void 0;
(function (CalendarTimeInterval) {
    CalendarTimeInterval[CalendarTimeInterval["Unscheduled"] = 0] = "Unscheduled";
    CalendarTimeInterval[CalendarTimeInterval["Yearly"] = 1] = "Yearly";
    CalendarTimeInterval[CalendarTimeInterval["Quarterly"] = 2] = "Quarterly";
    CalendarTimeInterval[CalendarTimeInterval["Monthly"] = 3] = "Monthly";
    CalendarTimeInterval[CalendarTimeInterval["Weekly"] = 4] = "Weekly";
    CalendarTimeInterval[CalendarTimeInterval["Daily"] = 5] = "Daily";
    CalendarTimeInterval[CalendarTimeInterval["Hourly"] = 6] = "Hourly";
    CalendarTimeInterval[CalendarTimeInterval["Minutely"] = 7] = "Minutely";
    CalendarTimeInterval[CalendarTimeInterval["Secondly"] = 8] = "Secondly";
    CalendarTimeInterval[CalendarTimeInterval["Millisecondly"] = 9] = "Millisecondly";
})(exports.CalendarTimeInterval || (exports.CalendarTimeInterval = {}));
function getCalendarIntervalArray() {
    return Object.keys(exports.CalendarInterval)
        .filter((value) => isNaN(Number(value)) === false)
        .map((key) => parseInt(key))
        .reverse();
}

function subtractByInterval(date, interval, count, utc = true) {
    switch (interval) {
        case exports.CalendarTimeInterval.Unscheduled:
            return dateTime(date, utc).toDate();
        case exports.CalendarTimeInterval.Yearly:
            return subtractYear(date, count, utc);
        case exports.CalendarTimeInterval.Quarterly:
            return subtractQuarter(date, count, utc);
        case exports.CalendarTimeInterval.Monthly:
            return subtractMonth(date, count, utc);
        case exports.CalendarTimeInterval.Weekly:
            return subtractWeek(date, count, utc);
        case exports.CalendarTimeInterval.Daily:
            return subtractDays(date, count, utc);
        case exports.CalendarTimeInterval.Hourly:
            return subtractHours(date, count, utc);
        case exports.CalendarTimeInterval.Minutely:
            return subtractMinutes(date, count, utc);
        case exports.CalendarTimeInterval.Secondly:
            return subtractSeconds(date, count, utc);
        case exports.CalendarTimeInterval.Millisecondly:
            return subtractMilliSeconds(date, count, utc);
    }
}
function addByInterval(date, interval, count, utc = true) {
    switch (interval) {
        case exports.CalendarTimeInterval.Unscheduled:
            return dateTime(date, utc).toDate();
        case exports.CalendarTimeInterval.Yearly:
            return addYear(date, count, utc);
        case exports.CalendarTimeInterval.Quarterly:
            return addQuarter(date, count, utc);
        case exports.CalendarTimeInterval.Monthly:
            return addMonth(date, count, utc);
        case exports.CalendarTimeInterval.Weekly:
            return addWeek(date, count, utc);
        case exports.CalendarTimeInterval.Daily:
            return addDays(date, count, utc);
        case exports.CalendarTimeInterval.Hourly:
            return addHours(date, count, utc);
        case exports.CalendarTimeInterval.Minutely:
            return addMinutes(date, count, utc);
        case exports.CalendarTimeInterval.Secondly:
            return addSeconds(date, count, utc);
        case exports.CalendarTimeInterval.Millisecondly:
            return addMilliSeconds(date, count, utc);
    }
}
function subtractMilliSeconds(date, count, utc = true) {
    return dateTime(date, utc).subtract(count, 'milliseconds').toDate();
}
function addMilliSeconds(date, count, utc = true) {
    return dateTime(date, utc).add(count, 'milliseconds').toDate();
}
function subtractSeconds(date, count, utc = true) {
    return dateTime(date, utc).subtract(count, 'seconds').toDate();
}
function addSeconds(date, count, utc = true) {
    return dateTime(date, utc).add(count, 'seconds').toDate();
}
function subtractMinutes(date, count, utc = true) {
    return dateTime(date, utc).subtract(count, 'minutes').toDate();
}
function addMinutes(date, count, utc = true) {
    return dateTime(date, utc).add(count, 'minutes').toDate();
}
function subtractHours(date, count, utc = true) {
    return dateTime(date, utc).subtract(count, 'hours').toDate();
}
function addHours(date, count, utc = true) {
    return dateTime(date, utc).add(count, 'hours').toDate();
}
function subtractDays(date, count, utc = true) {
    return dateTime(date, utc).subtract(count, 'days').toDate();
}
function addDays(date, count, utc = true) {
    return dateTime(date, utc).add(count, 'days').toDate();
}
function addWeek(date, count, utc = true) {
    return dateTime(date, utc).add(count, 'week').toDate();
}
function subtractWeek(date, count, utc = true) {
    return dateTime(date, utc).subtract(count, 'week').toDate();
}
function addMonth(date, count, utc = true) {
    return dateTime(date, utc).add(count, 'month').toDate();
}
function subtractMonth(date, count, utc = true) {
    return dateTime(date, utc).subtract(count, 'month').toDate();
}
function addQuarter(date, count, utc = true) {
    return dateTime(date, utc).add(count, 'quarter').toDate();
}
function subtractQuarter(date, count, utc = true) {
    return dateTime(date, utc).subtract(count, 'quarter').toDate();
}
function addYear(date, count, utc = true) {
    return dateTime(date, utc).add(count, 'year').toDate();
}
function subtractYear(date, count, utc = true) {
    return dateTime(date, utc).subtract(count, 'year').toDate();
}
function isSameDay(date1, date2) {
    const d1 = dateTime(date1);
    const d2 = dateTime(date2);
    return d1.year() === d2.year() && d1.month() === d2.month() && d1.date() === d2.date();
}

class DayIterator {
    constructor(from, to) {
        this.currentDate = getFullDayDate(from);
        this.toDate = getFullDayDate(to);
    }
    [Symbol.iterator]() {
        let currentDate = this.currentDate;
        const toDate = this.toDate;
        return {
            next() {
                if (currentDate <= toDate) {
                    const result = { value: currentDate, done: false };
                    currentDate = addDays(currentDate, 1);
                    return result;
                }
                return { value: null, done: true };
            },
        };
    }
}

class TimingModel {
    constructor(id, interval) {
        this._id = id;
        this.tid = id;
        this.interval = interval;
    }
}

function getSecondsSinceStartOfDay(d) {
    const date = d instanceof Date ? d : dateTime(d).toDate();
    return date.getSeconds() + 60 * (date.getMinutes() + 60 * date.getHours());
}
function getIsoWeekOfYear(date) {
    return dateTime(date).isoWeek();
}
function getQuarter(date) {
    return dateTime(date).quarter();
}
function isCurrentYear(date) {
    return dateTime(date).year() === dateTime().year();
}
function isToday(cDate) {
    const today = new Date();
    const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
    return (date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear());
}
function isThisYear(cDate) {
    const today = new Date();
    const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
    return date.getFullYear() == today.getFullYear();
}
function isThisMonth(cDate) {
    const today = new Date();
    const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
    return date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear();
}
function isInFuture(cDate, ignoreTime = false) {
    const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
    const now = new Date();
    if (ignoreTime) {
        return (new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) >
            new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
    }
    return date > new Date();
}

function getMonthNameByIndex(id, short = false) {
    return short ? exports.Months[id] : exports.Months[id].substring(0, 3);
}
function getLocalizedDays(format = 'long') {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(Date.UTC(2022, 0, i + 3));
        days.push(date.toLocaleDateString(undefined, { weekday: format }));
    }
    return days;
}
function getLocalizedMonths(format = 'long') {
    const months = [];
    for (let i = 0; i < 12; i++) {
        const date = new Date(Date.UTC(2022, i, 1));
        months.push(date.toLocaleDateString(undefined, { month: format }));
    }
    return months;
}
function getMonthNames() {
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
function getDayNameByIndex(id) {
    return exports.Days[id];
}
function getDayNames() {
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
function formatDate(date, format = 'YYYY-MM-DD') {
    return dateTime(date).format(format);
}
function formatDateWithTime(date, format = 'YYYY.MM.DD, HH:mm') {
    return dateTime(date).format(format);
}
function getRelativeTime(timeInMs, locale, style = 'long') {
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
function msToTime(ms) {
    return secondsToTime(Math.trunc(ms / 1000));
}
function timeToMs({ hours, minutes, seconds }) {
    return seconds * 1000 + minutes * 1000 * 60 + hours * 1000 * 60 * 60;
}
function secondsToTime(seconds) {
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
function padTime(num) {
    const s = '0' + num;
    return s.substring(s.length - 2);
}
function formatTime({ hours, minutes, seconds }) {
    let result = padTime(minutes) + ':' + padTime(seconds);
    const paddedHours = padTime(hours);
    result = paddedHours === '00' ? result : paddedHours + ':' + result;
    return result;
}

function everyFullMinute(handler) {
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();
    const startIntervalCallback = function (interval) {
        handler();
        interval.intervalId = setInterval(handler, 60000);
    };
    const interval = {
        intervalId: undefined,
        timeoutId: undefined,
        cancel: function () {
            clearTimeout(this.timeoutId);
            clearInterval(this.intervalId);
        },
    };
    interval.timeoutId = setTimeout(startIntervalCallback, secondsUntilNextMinute * 1000, interval);
    return interval;
}

function toTimingId(cd, level = exports.CalendarInterval.Daily, locale = 'de', weekStrategy = exports.WeekStrategy.LOCALE) {
    locale = locale.split('-')[0];
    if (level <= exports.CalendarInterval.Unscheduled)
        return 'U';
    if (level === exports.CalendarInterval.Weekly)
        return toWeekTimingId(cd, locale, weekStrategy);
    const dt = dateTime(cd, false, locale);
    const d = dt.toDate();
    let result = `Y:${d.getUTCFullYear()}`;
    if (level <= exports.CalendarInterval.Yearly)
        return result;
    result += `;Q:${dt.quarter()}`;
    if (level <= exports.CalendarInterval.Quarterly)
        return result;
    result += `;M:${pad(d.getUTCMonth() + 1)}`;
    if (level <= exports.CalendarInterval.Monthly)
        return result;
    return result + `;D:${pad(d.getDate())}`;
}
exports.WeekStrategy = void 0;
(function (WeekStrategy) {
    WeekStrategy[WeekStrategy["ISO"] = 0] = "ISO";
    WeekStrategy[WeekStrategy["LOCALE"] = 1] = "LOCALE";
})(exports.WeekStrategy || (exports.WeekStrategy = {}));
function toWeekTimingId(cd, locale, weekStrategy = exports.WeekStrategy.LOCALE) {
    const date = dateTime(cd, false, locale);
    let weekYear, weekOfYear, firstDayOfWeek;
    if (weekStrategy === exports.WeekStrategy.LOCALE) {
        weekYear = date.weekYear();
        weekOfYear = date.week();
        firstDayOfWeek = date.weekday(0);
    }
    else if (weekStrategy === exports.WeekStrategy.ISO) {
        weekYear = date.isoWeekYear();
        weekOfYear = date.isoWeek();
        firstDayOfWeek = date.isoWeekday(1);
    }
    let month = firstDayOfWeek.month() + 1;
    let quarter = firstDayOfWeek.quarter();
    if (date.year() < weekYear || firstDayOfWeek.year() < weekYear) {
        month = 1;
        quarter = 1;
    }
    else if (date.year() > weekYear) {
        month = 12;
        quarter = 4;
    }
    return `Y:${weekYear};Q:${quarter};M:${pad(month)};W:${pad(weekOfYear)}`;
}
function pad(num) {
    const s = '0' + num;
    return s.substring(s.length - 2);
}
function getTimingIds(d, locale, level = exports.CalendarInterval.Unscheduled, weekStrategy = exports.WeekStrategy.LOCALE) {
    const dayId = toTimingId(d, exports.CalendarInterval.Daily, locale);
    const weekId = toWeekTimingId(d, locale, weekStrategy);
    const monthId = dayId.substring(0, dayId.lastIndexOf(';'));
    const quarterId = monthId.substring(0, monthId.lastIndexOf(';'));
    const yearId = quarterId.substring(0, quarterId.lastIndexOf(';'));
    const result = ['U', yearId, quarterId, monthId, weekId, dayId];
    return level > 0 ? result.splice(0, level) : result;
}

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);
class DayJsDateTime {
    constructor(date, locale, timezone) {
        this.isDateTime = true;
        if (dayjs.isDayjs(date)) {
            this.instance = date;
        }
        else {
            this.instance = dayjs(date);
            if (locale) {
                this.instance = this.instance.locale(locale);
            }
            if (timezone) {
                this.instance = this.instance.tz(timezone);
            }
        }
    }
    add(value, unit) {
        return new DayJsDateTime(this.instance.add(value, unit));
    }
    time(h = 0, m = 0, s = 0, ms = 0) {
        return new DayJsDateTime(this.instance.hour(h).minute(m).second(s).millisecond(ms));
    }
    unixTs() {
        return this.instance.unix();
    }
    subtract(value, unit) {
        return new DayJsDateTime(this.instance.subtract(value, unit));
    }
    utc(preserveTime) {
        return new DayJsDateTime(this.instance.utc(preserveTime));
    }
    toDate() {
        return this.instance.toDate();
    }
    date(value) {
        return classValidator.isDefined(value)
            ? new DayJsDateTime(this.instance.date(value))
            : this.instance.date();
    }
    day(value) {
        return classValidator.isDefined(value)
            ? new DayJsDateTime(this.instance.day(value))
            : this.instance.day();
    }
    week(value) {
        return classValidator.isDefined(value)
            ? new DayJsDateTime(this.instance.week(value))
            : this.instance.week();
    }
    weekday(value) {
        return classValidator.isDefined(value)
            ? new DayJsDateTime(this.instance.weekday(value))
            : this.instance.weekday();
    }
    weekYear() {
        return this.instance.weekYear();
    }
    isoWeek(value) {
        return classValidator.isDefined(value)
            ? new DayJsDateTime(this.instance.isoWeek(value))
            : this.instance.isoWeek();
    }
    isoWeekday(value) {
        return classValidator.isDefined(value)
            ? new DayJsDateTime(this.instance.isoWeekday(value))
            : this.instance.isoWeekday();
    }
    isoWeekYear() {
        return this.instance.isoWeekYear();
    }
    quarter(value) {
        return classValidator.isDefined(value)
            ? new DayJsDateTime(this.instance.quarter(value))
            : this.instance.quarter();
    }
    month(value) {
        return classValidator.isDefined(value)
            ? new DayJsDateTime(this.instance.month(value))
            : this.instance.month();
    }
    year(value) {
        return classValidator.isDefined(value)
            ? new DayJsDateTime(this.instance.year(value))
            : this.instance.year();
    }
    format(template) {
        return this.instance.format(template);
    }
}
function dateTimeFactory(date, utc = false, locale, timezone) {
    date = date || new Date();
    const dateTime = new DayJsDateTime(date, locale, timezone);
    return utc ? dateTime.utc() : dateTime;
}
function useDayJsDateTimeAdapter() {
    setDateTimeFactory(dateTimeFactory);
}

exports.DayIterator = DayIterator;
exports.DayJsDateTime = DayJsDateTime;
exports.REGEX_DATE_FORMAT = REGEX_DATE_FORMAT;
exports.TimingModel = TimingModel;
exports.addByInterval = addByInterval;
exports.addDays = addDays;
exports.addHours = addHours;
exports.addMilliSeconds = addMilliSeconds;
exports.addMinutes = addMinutes;
exports.addMonth = addMonth;
exports.addQuarter = addQuarter;
exports.addSeconds = addSeconds;
exports.addWeek = addWeek;
exports.addYear = addYear;
exports.dateTime = dateTime;
exports.dateTimeFactory = dateTimeFactory;
exports.everyFullMinute = everyFullMinute;
exports.formatDate = formatDate;
exports.formatDateWithTime = formatDateWithTime;
exports.formatTime = formatTime;
exports.getCalendarIntervalArray = getCalendarIntervalArray;
exports.getDayNameByIndex = getDayNameByIndex;
exports.getDayNames = getDayNames;
exports.getFullDayDate = getFullDayDate;
exports.getIsoWeekOfYear = getIsoWeekOfYear;
exports.getLocalizedDays = getLocalizedDays;
exports.getLocalizedMonths = getLocalizedMonths;
exports.getMonthNameByIndex = getMonthNameByIndex;
exports.getMonthNames = getMonthNames;
exports.getQuarter = getQuarter;
exports.getRelativeTime = getRelativeTime;
exports.getSecondsSinceStartOfDay = getSecondsSinceStartOfDay;
exports.getTimingIds = getTimingIds;
exports.implementsIDateTime = implementsIDateTime;
exports.isCurrentYear = isCurrentYear;
exports.isInFuture = isInFuture;
exports.isSameDay = isSameDay;
exports.isThisMonth = isThisMonth;
exports.isThisYear = isThisYear;
exports.isToday = isToday;
exports.msToTime = msToTime;
exports.padTime = padTime;
exports.secondsToTime = secondsToTime;
exports.setDateTimeFactory = setDateTimeFactory;
exports.subtractByInterval = subtractByInterval;
exports.subtractDays = subtractDays;
exports.subtractHours = subtractHours;
exports.subtractMilliSeconds = subtractMilliSeconds;
exports.subtractMinutes = subtractMinutes;
exports.subtractMonth = subtractMonth;
exports.subtractQuarter = subtractQuarter;
exports.subtractSeconds = subtractSeconds;
exports.subtractWeek = subtractWeek;
exports.subtractYear = subtractYear;
exports.timeToMs = timeToMs;
exports.toDate = toDate;
exports.toTimingId = toTimingId;
exports.toWeekTimingId = toWeekTimingId;
exports.useDayJsDateTimeAdapter = useDayJsDateTimeAdapter;
