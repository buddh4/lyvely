import {
  addDays, addMonth, addQuarter, addWeek, addYear, getDayNameByIndex,
  getIsoWeekOfYear, getMonthNameByIndex,
  getQuarter,
  getWeekOfYear,
  getYearAndWeekOfYear, isCurrentYear, subtractDays, subtractMonth, subtractQuarter, subtractWeek, subtractYear
} from '../utils';
import { CalendarDate, dateTime, getFullDayDate,  ITiming } from '../interfaces';
import { TimingModel } from './timing.model';
import { CalendarIntervalEnum } from './calendar-interval.enum';

export abstract class CalendarPlan {
  protected abstract id: CalendarIntervalEnum;
  private static _instances: Map<CalendarIntervalEnum, CalendarPlan> = new Map();

  abstract createTimingInstance(date: CalendarDate, locale: string): ITiming;
  abstract getLabel(): string;
  abstract getTitle(date: Date, locale: string): string;
  abstract getLabelById(id: any): string;
  abstract increment(date: Date): Date;
  abstract decrement(date: Date): Date;

  public getPlan() {
    return this.id;
  }

  getTimingUniqueId(date: CalendarDate, locale: string): string {
    return buildTimingId(this.getPlan(), date, locale);
  }

  public static getInstance(interval: CalendarIntervalEnum): CalendarPlan {
    if (!CalendarPlan._instances[interval]) {
      let planClass = PlanFactory[interval];
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

  createTimingInstance(date: CalendarDate, locale: string): ITiming {
    return new TimingModel(this.getTimingUniqueId(date, locale), this.getPlan());
  }

  getLabel(): string {
    return "Unscheduled";
  }

  getTitle(date: Date, locale: string): string {
    return 'Unscheduled';
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

  createTimingInstance(date: CalendarDate, locale: string): ITiming {
    date = getFullDayDate(date);
    const timing = super.createTimingInstance(date, locale);
    timing.year = date.getUTCFullYear();
    return timing;
  }

  getLabel(): string {
    return "Yearly";
  }

  getTitle(date: Date, locale: string): string {
    return dateTime(date).format('YYYY');
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

  createTimingInstance(date: CalendarDate, locale: string): ITiming {
    date = getFullDayDate(date);
    const timing = super.createTimingInstance(date, locale);
    timing.quarter = getQuarter(date);
    return timing;
  }

  getLabel(): string {
    return "Quarterly";
  }

  getTitle(date: Date, locale: string): string {
    let momentDate = dateTime(date);
    return 'Q' + momentDate.quarter()
      + (!isCurrentYear(date) ? momentDate.format(' · YYYY') : '');
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

  createTimingInstance(date: CalendarDate, locale: string): ITiming {
    date = getFullDayDate(date);
    const timing = super.createTimingInstance(date, locale);
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
    let format = isCurrentYear(date) ? 'MMM' : 'MMM · YYYY';
    return dateTime(date).format(format);
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

  createTimingInstance(date: CalendarDate, locale: string): ITiming {
    date = getFullDayDate(date);
    const timing = super.createTimingInstance(date, locale);
    timing.weekOfYear = getWeekOfYear(date, locale);
    timing.isoWeekOfYear = getIsoWeekOfYear(date);
    return timing;
  }

  getLabel(): string {
    return "Weekly";
  }

  getTitle(date: Date, locale: string): string {
    let {weekOfYear, year} = getYearAndWeekOfYear(date, locale);
    let dateMoment = dateTime(date);
    let showYear = (dateMoment.year() !== year) || !isCurrentYear(date);
    return `Week ${weekOfYear}` +  (showYear ? ` · ${year}` : '');
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

  createTimingInstance(date: CalendarDate, locale: string): ITiming {
    date = getFullDayDate(date);
    const timing = super.createTimingInstance(date, locale);
    timing.weekOfYear = getWeekOfYear(date, locale);
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
    let format = isCurrentYear(date) ? 'ddd, MMM Do' : 'ddd, MMM Do · YYYY';
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
    {value: CalendarIntervalEnum.Daily, label: 'Daily'},
    {value: CalendarIntervalEnum.Weekly, label: 'Weekly'},
    {value: CalendarIntervalEnum.Monthly, label: 'Monthly'},
    {value: CalendarIntervalEnum.Quarterly, label: 'Quarterly'},
    {value: CalendarIntervalEnum.Yearly, label: 'Yearly'},
    {value: CalendarIntervalEnum.Unscheduled, label: 'Unscheduled'},
  ];
}

export function buildTimingId(interval: CalendarIntervalEnum, date: CalendarDate, locale: string): string {
  date = getFullDayDate(date);
  switch (interval) {
    case CalendarIntervalEnum.Unscheduled:
      return interval + ':unscheduled';
    case CalendarIntervalEnum.Yearly:
      return interval + ':Y:' + date.getUTCFullYear();
    case CalendarIntervalEnum.Quarterly:
      return interval + ':Y:' + date.getUTCFullYear() + ':Q:' + getQuarter(date);
    case CalendarIntervalEnum.Monthly:
      return interval + ':Y:' + date.getUTCFullYear() + ':M:' + date.getUTCMonth();
    case CalendarIntervalEnum.Weekly:
      let {year, weekOfYear} = getYearAndWeekOfYear(date, locale)
      return interval + ':Y:' + year + ':W:' + weekOfYear;
    case CalendarIntervalEnum.Daily:
      return interval
        + ':Y:' + date.getUTCFullYear()
        + ':M:' + date.getUTCMonth()
        + ':D:' + date.getUTCDate();
  }
}

const PlanFactory = {
  [CalendarIntervalEnum.Unscheduled]: UnscheduledPlan,
  [CalendarIntervalEnum.Yearly]: YearlyPlan,
  [CalendarIntervalEnum.Quarterly]: QuarterlyPlan,
  [CalendarIntervalEnum.Monthly]: MonthlyPlan,
  [CalendarIntervalEnum.Weekly]: WeeklyPlan,
  [CalendarIntervalEnum.Daily]: DailyPlan,
}