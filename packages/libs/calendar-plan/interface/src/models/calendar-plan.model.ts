import {
  addDays,
  addMonth,
  addQuarter,
  addWeek,
  addYear,
  getDayNameByIndex,
  getMonthNameByIndex,
  isCurrentYear,
  subtractDays,
  subtractMonths,
  subtractQuarters,
  subtractWeeks,
  subtractYears,
  CalendarDate,
  dateTime,
  CalendarInterval,
  toTimingId,
  ICalendarPreferences,
} from '@lyvely/dates';
import { ITranslatable } from '@lyvely/interface';

export abstract class CalendarPlan {
  protected abstract id: CalendarInterval;
  private static _instances: Map<CalendarInterval, CalendarPlan> = new Map();

  abstract getLabel(): string;
  abstract getTitle(date: Date, locale: string, preferences?: ICalendarPreferences): ITranslatable;
  abstract getAccessibleTitle(
    date: Date,
    locale: string,
    preferences?: ICalendarPreferences
  ): ITranslatable;
  abstract getLabelById(id: any): string;
  abstract increment(date: Date, amount?: number): Date;
  abstract decrement(date: Date, amount?: number): Date;
  abstract getDefaultWindowSize(): number;

  public getInterval() {
    return this.id;
  }

  getTimingId(date: CalendarDate, locale = 'de', preferences?: ICalendarPreferences): string {
    return toTimingId(date, this.getInterval(), locale, preferences);
  }

  public static getInstance(interval: CalendarInterval): CalendarPlan {
    if (!CalendarPlan._instances.get(interval)) {
      const planClass = PlanFactory[interval];
      if (!planClass) {
        throw new Error('Plan not found!');
      }

      CalendarPlan._instances.set(interval, new planClass());
    }

    return CalendarPlan._instances.get(interval)!;
  }
}

export class UnscheduledPlan extends CalendarPlan {
  protected id = CalendarInterval.Unscheduled;

  getLabel(): string {
    return 'Unscheduled';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTitle(date: Date, locale: string, preferences?: ICalendarPreferences): ITranslatable {
    return 'calendar-plan.interval.recurrent.0';
  }

  getAccessibleTitle(
    date: Date,
    locale: string,
    preferences?: ICalendarPreferences
  ): ITranslatable {
    return this.getTitle(date, locale, preferences);
  }

  increment(date: Date, amount?: number): Date {
    return date;
  }

  decrement(date: Date, amount?: number): Date {
    return date;
  }

  getLabelById(id: any): string {
    return id;
  }

  getDefaultWindowSize(): number {
    return 0;
  }
}

export class YearlyPlan extends UnscheduledPlan {
  protected override id = CalendarInterval.Yearly;

  override getLabel(): string {
    return 'Yearly';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getTitle(date: Date, locale: string, preferences?: ICalendarPreferences): ITranslatable {
    return dateTime(date).format('YYYY');
  }

  override getAccessibleTitle(
    date: Date,
    locale: string,
    preferences?: ICalendarPreferences
  ): ITranslatable {
    return this.getTitle(date, locale, preferences);
  }

  override increment(date: Date, amount = 1): Date {
    return addYear(date, amount);
  }

  override decrement(date: Date, amount = 1): Date {
    return subtractYears(date, amount);
  }

  override getDefaultWindowSize(): number {
    return 5;
  }
}

export class QuarterlyPlan extends YearlyPlan {
  protected override id = CalendarInterval.Quarterly;

  override getLabel(): string {
    return 'Quarterly';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getTitle(date: Date, locale: string, preferences?: ICalendarPreferences): ITranslatable {
    const momentDate = dateTime(date);
    const quarter =
      momentDate.quarter() + (!isCurrentYear(date) ? momentDate.format(' · YYYY') : '');
    return { key: 'calendar-plan.titles.quarterly', params: { quarter } };
  }

  override getAccessibleTitle(
    date: Date,
    locale: string,
    preferences?: ICalendarPreferences
  ): ITranslatable {
    return this.getTitle(date, locale, preferences);
  }

  override increment(date: Date, amount = 1): Date {
    return addQuarter(date, amount);
  }

  override decrement(date: Date, amount = 1): Date {
    return subtractQuarters(date, amount);
  }

  override getDefaultWindowSize(): number {
    return 8;
  }
}

export class MonthlyPlan extends QuarterlyPlan {
  protected override id = CalendarInterval.Monthly;

  override getLabel(): string {
    return 'Monthly';
  }

  override getLabelById(id: any): string {
    return getMonthNameByIndex(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getTitle(date: Date, locale: string, preferences?: ICalendarPreferences): ITranslatable {
    const format = isCurrentYear(date) ? 'MMMM' : 'MMM · YYYY';
    return dateTime(date).format(format);
  }

  override getAccessibleTitle(
    date: Date,
    locale: string,
    preferences?: ICalendarPreferences
  ): ITranslatable {
    return this.getTitle(date, locale, preferences);
  }

  override increment(date: Date, amount = 1): Date {
    return addMonth(date, amount);
  }

  override decrement(date: Date, amount = 1): Date {
    return subtractMonths(date, amount);
  }

  override getDefaultWindowSize(): number {
    return 12;
  }
}

export class WeeklyPlan extends MonthlyPlan {
  protected override id = CalendarInterval.Weekly;

  override getLabel(): string {
    return 'Weekly';
  }

  override getTitle(date: Date, locale: string, preferences?: ICalendarPreferences): ITranslatable {
    const tid = this.getTimingId(date, locale, preferences);
    const splitTid = tid.split(';');
    const weekOfYear = parseInt(splitTid.at(-1)!.split(':')[1]);
    const yearOfWeek = parseInt(splitTid.at(0)!.split(':')[1]);
    const year = date.getFullYear();

    const showYear = year !== new Date().getFullYear() || year !== yearOfWeek;
    const week = `${weekOfYear}` + (showYear ? ` · ${yearOfWeek}` : '');
    return { key: 'calendar-plan.titles.weekly', params: { week } };
  }

  override getAccessibleTitle(
    date: Date,
    locale: string,
    preferences?: ICalendarPreferences
  ): ITranslatable {
    return this.getTitle(date, locale, preferences);
  }

  override increment(date: Date, amount = 1): Date {
    return addWeek(date, amount);
  }

  override decrement(date: Date, amount = 1): Date {
    return subtractWeeks(date, amount);
  }

  override getDefaultWindowSize(): number {
    return 10;
  }
}

export class DailyPlan extends WeeklyPlan {
  protected override id = CalendarInterval.Daily;

  override getLabel(): string {
    return 'Daily';
  }

  override getLabelById(id: any): string {
    return getDayNameByIndex(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getTitle(date: Date, locale: string, preferences?: ICalendarPreferences): ITranslatable {
    const format = isCurrentYear(date) ? 'ddd D MMM ' : 'ddd D MMM  · YYYY';
    return dateTime(date).format(format);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getAccessibleTitle(
    date: Date,
    locale: string,
    preferences?: ICalendarPreferences
  ): ITranslatable {
    const format = isCurrentYear(date) ? 'dddd D MMMM ' : 'dddd D MMMM  · YYYY';
    return dateTime(date).format(format);
  }

  override increment(date: Date, amount = 1): Date {
    return addDays(date, amount);
  }

  override decrement(date: Date, amount = 1): Date {
    return subtractDays(date, amount);
  }

  override getDefaultWindowSize(): number {
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

export function getTidWindow(
  interval: CalendarInterval,
  locale: string,
  windowSize?: number,
  preferences?: ICalendarPreferences
) {
  const calendarPlan = CalendarPlan.getInstance(interval);
  windowSize ||= calendarPlan.getDefaultWindowSize();
  const now = new Date();
  const tids: string[] = [];
  for (let i = windowSize - 1; i >= 0; i--) {
    tids.push(toTimingId(calendarPlan.decrement(now, i), interval, locale, preferences));
  }
  return tids;
}
