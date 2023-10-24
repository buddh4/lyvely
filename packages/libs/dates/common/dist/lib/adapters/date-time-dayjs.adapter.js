import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import { setDateTimeFactory } from '../interfaces';
import { isDefined } from 'class-validator';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);
export class DayJsDateTime {
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
        return isDefined(value)
            ? new DayJsDateTime(this.instance.date(value))
            : this.instance.date();
    }
    day(value) {
        return isDefined(value)
            ? new DayJsDateTime(this.instance.day(value))
            : this.instance.day();
    }
    week(value) {
        return isDefined(value)
            ? new DayJsDateTime(this.instance.week(value))
            : this.instance.week();
    }
    weekday(value) {
        return isDefined(value)
            ? new DayJsDateTime(this.instance.weekday(value))
            : this.instance.weekday();
    }
    weekYear() {
        return this.instance.weekYear();
    }
    isoWeek(value) {
        return isDefined(value)
            ? new DayJsDateTime(this.instance.isoWeek(value))
            : this.instance.isoWeek();
    }
    isoWeekday(value) {
        return isDefined(value)
            ? new DayJsDateTime(this.instance.isoWeekday(value))
            : this.instance.isoWeekday();
    }
    isoWeekYear() {
        return this.instance.isoWeekYear();
    }
    quarter(value) {
        return isDefined(value)
            ? new DayJsDateTime(this.instance.quarter(value))
            : this.instance.quarter();
    }
    month(value) {
        return isDefined(value)
            ? new DayJsDateTime(this.instance.month(value))
            : this.instance.month();
    }
    year(value) {
        return isDefined(value)
            ? new DayJsDateTime(this.instance.year(value))
            : this.instance.year();
    }
    format(template) {
        return this.instance.format(template);
    }
}
export function dateTimeFactory(date, utc = false, locale, timezone) {
    date = date || new Date();
    const dateTime = new DayJsDateTime(date, locale, timezone);
    return utc ? dateTime.utc() : dateTime;
}
export function useDayJsDateTimeAdapter() {
    setDateTimeFactory(dateTimeFactory);
}
//# sourceMappingURL=date-time-dayjs.adapter.js.map