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
  subtractMonth,
  subtractQuarter,
  subtractWeek,
  subtractYear,
  CalendarDate,
  dateTime,
  CalendarInterval,
  toTimingId,
  WeekStrategy,
} from '@lyvely/dates';

export abstract class CalendarPlan {
  protected abstract id: CalendarInterval;
  private static _instances: Map<CalendarInterval, CalendarPlan> = new Map();

  abstract getLabel(): string;
  abstract getTitle(date: Date, locale: string): string;
  abstract getAccessibleTitle(date: Date, locale: string): string;
  abstract getLabelById(id: any): string;
  abstract increment(date: Date, amount?: number): Date;
  abstract decrement(date: Date, amount?: number): Date;
  abstract getDefaultWindowSize(): number;

  public getInterval() {
    return this.id;
  }

  getTimingId(date: CalendarDate, locale = 'de', weekStrategy: WeekStrategy = 'locale'): string {
    return toTimingId(date, this.getInterval(), locale, weekStrategy);
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
  getTitle(date: Date, locale: string): string {
    return 'Unscheduled';
  }

  getAccessibleTitle(date: Date, locale: string): string {
    return this.getTitle(date, locale);
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
  protected id = CalendarInterval.Yearly;

  getLabel(): string {
    return 'Yearly';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTitle(date: Date, locale: string): string {
    return dateTime(date).format('YYYY');
  }

  getAccessibleTitle(date: Date, locale: string): string {
    return this.getTitle(date, locale);
  }

  increment(date: Date, amount = 1): Date {
    return addYear(date, amount);
  }

  decrement(date: Date, amount = 1): Date {
    return subtractYear(date, amount);
  }

  getDefaultWindowSize(): number {
    return 5;
  }
}

export class QuarterlyPlan extends YearlyPlan {
  protected id = CalendarInterval.Quarterly;

  getLabel(): string {
    return 'Quarterly';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTitle(date: Date, locale: string): string {
    const momentDate = dateTime(date);
    return 'Q' + momentDate.quarter() + (!isCurrentYear(date) ? momentDate.format(' · YYYY') : '');
  }

  getAccessibleTitle(date: Date, locale: string): string {
    return this.getTitle(date, locale);
  }

  increment(date: Date, amount = 1): Date {
    return addQuarter(date, amount);
  }

  decrement(date: Date, amount = 1): Date {
    return subtractQuarter(date, amount);
  }

  getDefaultWindowSize(): number {
    return 8;
  }
}

export class MonthlyPlan extends QuarterlyPlan {
  protected id = CalendarInterval.Monthly;

  getLabel(): string {
    return 'Monthly';
  }

  getLabelById(id: any): string {
    return getMonthNameByIndex(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTitle(date: Date, locale: string): string {
    const format = isCurrentYear(date) ? 'MMMM' : 'MMM · YYYY';
    return dateTime(date).format(format);
  }

  getAccessibleTitle(date: Date, locale: string): string {
    return this.getTitle(date, locale);
  }

  increment(date: Date, amount = 1): Date {
    return addMonth(date, amount);
  }

  decrement(date: Date, amount = 1): Date {
    return subtractMonth(date, amount);
  }

  getDefaultWindowSize(): number {
    return 12;
  }
}

export class WeeklyPlan extends MonthlyPlan {
  protected id = CalendarInterval.Weekly;

  getLabel(): string {
    return 'Weekly';
  }

  getTitle(date: Date, locale: string): string {
    const tid = this.getTimingId(date, locale);
    const splitTid = tid.split(';');
    const weekOfYear = parseInt(splitTid.at(-1)!.split(':')[1]);
    const yearOfWeek = parseInt(splitTid.at(0)!.split(':')[1]);
    const year = date.getFullYear();

    const showYear = year !== new Date().getFullYear() || year !== yearOfWeek;
    return `Week ${weekOfYear}` + (showYear ? ` · ${yearOfWeek}` : '');
  }

  getAccessibleTitle(date: Date, locale: string): string {
    return this.getTitle(date, locale);
  }

  increment(date: Date, amount = 1): Date {
    return addWeek(date, amount);
  }

  decrement(date: Date, amount = 1): Date {
    return subtractWeek(date, amount);
  }

  getDefaultWindowSize(): number {
    return 10;
  }
}

export class DailyPlan extends WeeklyPlan {
  protected id = CalendarInterval.Daily;

  getLabel(): string {
    return 'Daily';
  }

  getLabelById(id: any): string {
    return getDayNameByIndex(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTitle(date: Date, locale: string): string {
    const format = isCurrentYear(date) ? 'ddd D MMM ' : 'ddd D MMM  · YYYY';
    return dateTime(date).format(format);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAccessibleTitle(date: Date, locale: string): string {
    const format = isCurrentYear(date) ? 'dddd D MMMM ' : 'dddd D MMMM  · YYYY';
    return dateTime(date).format(format);
  }

  increment(date: Date, amount = 1): Date {
    return addDays(date, amount);
  }

  decrement(date: Date, amount = 1): Date {
    return subtractDays(date, amount);
  }

  getDefaultWindowSize(): number {
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

// TODO: Implement proper weekStrategyOption iso vs locale
export function getTidWindow(
  interval: CalendarInterval,
  locale: string,
  windowSize?: number,
  weekStrategy: WeekStrategy = 'locale',
) {
  const calendarPlan = CalendarPlan.getInstance(interval);
  windowSize ||= calendarPlan.getDefaultWindowSize();
  const now = new Date();
  const tids: string[] = [];
  for (let i = windowSize - 1; i >= 0; i--) {
    tids.push(toTimingId(calendarPlan.decrement(now, i), interval, locale, weekStrategy));
  }
  return tids;
}
