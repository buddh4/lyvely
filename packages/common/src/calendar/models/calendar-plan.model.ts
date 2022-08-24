import {
  addDays,
  addMonth,
  addQuarter,
  addWeek,
  addYear,
  getDayNameByIndex,
  getIsoWeekOfYear,
  getMonthNameByIndex,
  getQuarter,
  getYearAndWeekOfYear,
  isCurrentYear,
  subtractDays,
  subtractMonth,
  subtractQuarter,
  subtractWeek,
  subtractYear
} from '../utils';
import { CalendarDate, dateTime, getFullDayDate,  ITiming } from '../interfaces';
import { TimingModel } from './timing.model';
import { CalendarIntervalEnum } from './calendar-interval.enum';
import { toTimingId } from "./timing-id";

export abstract class CalendarPlan {
  protected abstract id: CalendarIntervalEnum;
  private static _instances: Map<CalendarIntervalEnum, CalendarPlan> = new Map();

  abstract createTimingInstance(date: CalendarDate): ITiming;
  abstract getLabel(): string;
  abstract getTitle(date: Date, locale: string): string;
  abstract getAccessibleTitle(date: Date, locale: string): string;
  abstract getLabelById(id: any): string;
  abstract increment(date: Date): Date;
  abstract decrement(date: Date): Date;

  public getPlan() {
    return this.id;
  }

  getTimingUniqueId(date: CalendarDate): string {
    return toTimingId(date, this.getPlan());
  }

  public static getInstance(interval: CalendarIntervalEnum): CalendarPlan {
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

export class UnscheduledPlan extends CalendarPlan {
  protected id = CalendarIntervalEnum.Unscheduled;

  createTimingInstance(date: CalendarDate): ITiming {
    return new TimingModel(this.getTimingUniqueId(date), this.getPlan());
  }

  getLabel(): string {
    return "Unscheduled";
  }

  getTitle(date: Date, locale: string): string {
    return 'Unscheduled';
  }

  getAccessibleTitle(date: Date, locale: string): string {
    return this.getTitle(date, locale);
  }

  increment(date: Date): Date {
    return date;
  }

  decrement(date: Date): Date {
    return date;
  }

  getLabelById(id: any): string {
    return id;
  }
}

export class YearlyPlan extends UnscheduledPlan {
  protected id = CalendarIntervalEnum.Yearly;

  createTimingInstance(date: CalendarDate): ITiming {
    date = getFullDayDate(date);
    const timing = super.createTimingInstance(date);
    timing.year = date.getUTCFullYear();
    return timing;
  }

  getLabel(): string {
    return "Yearly";
  }

  getTitle(date: Date, locale: string): string {
    return dateTime(date).format('YYYY');
  }

  getAccessibleTitle(date: Date, locale: string): string {
    return this.getTitle(date, locale);
  }

  increment(date: Date): Date {
    return addYear(date, 1);
  }

  decrement(date: Date): Date {
    return subtractYear(date, 1);
  }
}

export class QuarterlyPlan extends YearlyPlan {
  protected id = CalendarIntervalEnum.Quarterly;

  createTimingInstance(date: CalendarDate): ITiming {
    date = getFullDayDate(date);
    const timing = super.createTimingInstance(date);
    timing.quarter = getQuarter(date);
    return timing;
  }

  getLabel(): string {
    return "Quarterly";
  }

  getTitle(date: Date, locale: string): string {
    const momentDate = dateTime(date);
    return 'Q' + momentDate.quarter()
      + (!isCurrentYear(date) ? momentDate.format(' · YYYY') : '');
  }

  getAccessibleTitle(date: Date, locale: string): string {
    return this.getTitle(date, locale);
  }

  increment(date: Date): Date {
    return addQuarter(date, 1);
  }

  decrement(date: Date): Date {
    return subtractQuarter(date, 1);
  }
}

export class MonthlyPlan extends QuarterlyPlan {
  protected id = CalendarIntervalEnum.Monthly;

  createTimingInstance(date: CalendarDate): ITiming {
    date = getFullDayDate(date);
    const timing = super.createTimingInstance(date);
    timing.monthOfYear = date.getUTCMonth();
    return timing;
  }

  getLabel(): string {
    return "Monthly";
  }

  getLabelById(id: any): string {
    return getMonthNameByIndex(id);
  }

  getTitle(date: Date, locale: string): string {
    const format = isCurrentYear(date) ? 'MMMM' : 'MMM · YYYY';
    return dateTime(date).format(format);
  }

  getAccessibleTitle(date: Date, locale: string): string {
    return this.getTitle(date, locale);
  }

  increment(date: Date): Date {
    return addMonth(date, 1);
  }

  decrement(date: Date): Date {
    return subtractMonth(date, 1);
  }


}

export class WeeklyPlan extends MonthlyPlan {
  protected id = CalendarIntervalEnum.Weekly;

  createTimingInstance(date: CalendarDate): ITiming {
    date = getFullDayDate(date);
    const timing = super.createTimingInstance(date);
    timing.isoWeekOfYear = getIsoWeekOfYear(date);
    return timing;
  }

  getLabel(): string {
    return "Weekly";
  }

  getTitle(date: Date, locale: string): string {
    const { weekOfYear, year } = getYearAndWeekOfYear(date, locale);
    const dateMoment = dateTime(date);
    const showYear = (dateMoment.year() !== year) || !isCurrentYear(date);
    return `Week ${weekOfYear}` +  (showYear ? ` · ${year}` : '');
  }

  getAccessibleTitle(date: Date, locale: string): string {
    return this.getTitle(date, locale);
  }

  increment(date: Date): Date {
    return addWeek(date, 1);
  }

  decrement(date: Date): Date {
    return subtractWeek(date, 1);
  }
}

export class DailyPlan extends WeeklyPlan {
  protected id = CalendarIntervalEnum.Daily;

  createTimingInstance(date: CalendarDate): ITiming {
    date = getFullDayDate(date);
    const timing = super.createTimingInstance(date);
    timing.isoWeekOfYear = getIsoWeekOfYear(date);
    timing.date = date;
    timing.dayOfMonth = date.getUTCDate();
    timing.dayOfWeek = date.getUTCDay();
    return timing;
  }

  getLabel(): string {
    return "Daily";
  }

  getLabelById(id: any): string {
    return getDayNameByIndex(id);
  }

  getTitle(date: Date, locale: string): string {
    const format = isCurrentYear(date) ? 'ddd D MMM ' : 'ddd D MMM  · YYYY';
    return dateTime(date).format(format);
  }

  getAccessibleTitle(date: Date, locale: string): string {
    const format = isCurrentYear(date) ? 'dddd D MMMM ' : 'dddd D MMMM  · YYYY';
    return dateTime(date).format(format);
  }

  increment(date: Date): Date {
    return addDays(date, 1);
  }


  decrement(date: Date): Date {
    return subtractDays(date, 1);
  }
}

export function getCalendarPlanArray(): CalendarIntervalEnum[] {
  return Object.keys(CalendarIntervalEnum)
    .filter(value => isNaN(Number(value)) === false)
    .map(key => parseInt(key))
    .reverse();
}

export function getCalendarPlanOptions(): { value: CalendarIntervalEnum, label: string }[] {
  return  [
    { value: CalendarIntervalEnum.Daily, label: 'Daily' },
    { value: CalendarIntervalEnum.Weekly, label: 'Weekly' },
    { value: CalendarIntervalEnum.Monthly, label: 'Monthly' },
    { value: CalendarIntervalEnum.Quarterly, label: 'Quarterly' },
    { value: CalendarIntervalEnum.Yearly, label: 'Yearly' },
    { value: CalendarIntervalEnum.Unscheduled, label: 'Unscheduled' },
  ];
}

const PlanFactory = {
  [CalendarIntervalEnum.Unscheduled]: UnscheduledPlan,
  [CalendarIntervalEnum.Yearly]: YearlyPlan,
  [CalendarIntervalEnum.Quarterly]: QuarterlyPlan,
  [CalendarIntervalEnum.Monthly]: MonthlyPlan,
  [CalendarIntervalEnum.Weekly]: WeeklyPlan,
  [CalendarIntervalEnum.Daily]: DailyPlan,
}
