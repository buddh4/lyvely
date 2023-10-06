import { addDays, addMonth, addQuarter, addWeek, addYear, getDayNameByIndex, getMonthNameByIndex, isCurrentYear, subtractDays, subtractMonth, subtractQuarter, subtractWeek, subtractYear, dateTime, CalendarInterval, toTimingId, WeekStrategy, } from '@lyvely/dates';
export class CalendarPlan {
    getInterval() {
        return this.id;
    }
    getTimingId(date, locale = 'de', weekStrategy = WeekStrategy.LOCALE) {
        return toTimingId(date, this.getInterval(), locale, weekStrategy);
    }
    static getInstance(interval) {
        if (!CalendarPlan._instances[interval]) {
            const planClass = PlanFactory[interval];
            if (!planClass) {
                throw new Error('Plan not found!');
            }
            CalendarPlan._instances[interval] = new planClass();
        }
        return CalendarPlan._instances[interval];
    }
}
CalendarPlan._instances = new Map();
export class UnscheduledPlan extends CalendarPlan {
    constructor() {
        super(...arguments);
        this.id = CalendarInterval.Unscheduled;
    }
    getLabel() {
        return 'Unscheduled';
    }
    getTitle(date, locale) {
        return 'Unscheduled';
    }
    getAccessibleTitle(date, locale) {
        return this.getTitle(date, locale);
    }
    increment(date, amount) {
        return date;
    }
    decrement(date, amount) {
        return date;
    }
    getLabelById(id) {
        return id;
    }
    getDefaultWindowSize() {
        return 0;
    }
}
export class YearlyPlan extends UnscheduledPlan {
    constructor() {
        super(...arguments);
        this.id = CalendarInterval.Yearly;
    }
    getLabel() {
        return 'Yearly';
    }
    getTitle(date, locale) {
        return dateTime(date).format('YYYY');
    }
    getAccessibleTitle(date, locale) {
        return this.getTitle(date, locale);
    }
    increment(date, amount = 1) {
        return addYear(date, amount);
    }
    decrement(date, amount = 1) {
        return subtractYear(date, amount);
    }
    getDefaultWindowSize() {
        return 5;
    }
}
export class QuarterlyPlan extends YearlyPlan {
    constructor() {
        super(...arguments);
        this.id = CalendarInterval.Quarterly;
    }
    getLabel() {
        return 'Quarterly';
    }
    getTitle(date, locale) {
        const momentDate = dateTime(date);
        return 'Q' + momentDate.quarter() + (!isCurrentYear(date) ? momentDate.format(' · YYYY') : '');
    }
    getAccessibleTitle(date, locale) {
        return this.getTitle(date, locale);
    }
    increment(date, amount = 1) {
        return addQuarter(date, amount);
    }
    decrement(date, amount = 1) {
        return subtractQuarter(date, amount);
    }
    getDefaultWindowSize() {
        return 8;
    }
}
export class MonthlyPlan extends QuarterlyPlan {
    constructor() {
        super(...arguments);
        this.id = CalendarInterval.Monthly;
    }
    getLabel() {
        return 'Monthly';
    }
    getLabelById(id) {
        return getMonthNameByIndex(id);
    }
    getTitle(date, locale) {
        const format = isCurrentYear(date) ? 'MMMM' : 'MMM · YYYY';
        return dateTime(date).format(format);
    }
    getAccessibleTitle(date, locale) {
        return this.getTitle(date, locale);
    }
    increment(date, amount = 1) {
        return addMonth(date, amount);
    }
    decrement(date, amount = 1) {
        return subtractMonth(date, amount);
    }
    getDefaultWindowSize() {
        return 12;
    }
}
export class WeeklyPlan extends MonthlyPlan {
    constructor() {
        super(...arguments);
        this.id = CalendarInterval.Weekly;
    }
    getLabel() {
        return 'Weekly';
    }
    getTitle(date, locale) {
        const tid = this.getTimingId(date, locale);
        const splitTid = tid.split(';');
        const weekOfYear = parseInt(splitTid.at(-1).split(':')[1]);
        const yearOfWeek = parseInt(splitTid.at(0).split(':')[1]);
        const year = date.getFullYear();
        const showYear = year !== new Date().getFullYear() || year !== yearOfWeek;
        return `Week ${weekOfYear}` + (showYear ? ` · ${yearOfWeek}` : '');
    }
    getAccessibleTitle(date, locale) {
        return this.getTitle(date, locale);
    }
    increment(date, amount = 1) {
        return addWeek(date, amount);
    }
    decrement(date, amount = 1) {
        return subtractWeek(date, amount);
    }
    getDefaultWindowSize() {
        return 10;
    }
}
export class DailyPlan extends WeeklyPlan {
    constructor() {
        super(...arguments);
        this.id = CalendarInterval.Daily;
    }
    getLabel() {
        return 'Daily';
    }
    getLabelById(id) {
        return getDayNameByIndex(id);
    }
    getTitle(date, locale) {
        const format = isCurrentYear(date) ? 'ddd D MMM ' : 'ddd D MMM  · YYYY';
        return dateTime(date).format(format);
    }
    getAccessibleTitle(date, locale) {
        const format = isCurrentYear(date) ? 'dddd D MMMM ' : 'dddd D MMMM  · YYYY';
        return dateTime(date).format(format);
    }
    increment(date, amount = 1) {
        return addDays(date, amount);
    }
    decrement(date, amount = 1) {
        return subtractDays(date, amount);
    }
    getDefaultWindowSize() {
        return 14;
    }
}
const PlanFactory = {
    [CalendarInterval.Unscheduled]: UnscheduledPlan,
    [CalendarInterval.Yearly]: YearlyPlan,
    [CalendarInterval.Quarterly]: QuarterlyPlan,
    [CalendarInterval.Monthly]: MonthlyPlan,
    [CalendarInterval.Weekly]: WeeklyPlan,
    [CalendarInterval.Daily]: DailyPlan,
};
export function getTidWindow(interval, locale, windowSize, weekStrategy = WeekStrategy.LOCALE) {
    const calendarPlan = CalendarPlan.getInstance(interval);
    windowSize || (windowSize = calendarPlan.getDefaultWindowSize());
    const now = new Date();
    const tids = [];
    for (let i = windowSize - 1; i >= 0; i--) {
        tids.push(toTimingId(calendarPlan.decrement(now, i), interval, locale, weekStrategy));
    }
    return tids;
}
