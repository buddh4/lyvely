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
  CalendarIntervalEnum,
  toTimingId,
  WeekStrategy,
} from '@/calendar';

export abstract class CalendarPlan {
  protected abstract id: CalendarIntervalEnum;
  private static _instances: Map<CalendarIntervalEnum, CalendarPlan> = new Map();

  abstract getLabel(): string;
  abstract getTitle(date: Date, locale: string): string;
  abstract getAccessibleTitle(date: Date, locale: string): string;
  abstract getLabelById(id: any): string;
  abstract increment(date: Date): Date;
  abstract decrement(date: Date): Date;

  public getInterval() {
    return this.id;
  }

  getTimingUniqueId(date: CalendarDate, locale = 'de', weekStrategy = WeekStrategy.LOCALE): string {
    return toTimingId(date, this.getInterval(), locale, weekStrategy);
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

  increment(date: Date): Date {
    return addYear(date, 1);
  }

  decrement(date: Date): Date {
    return subtractYear(date, 1);
  }
}

export class QuarterlyPlan extends YearlyPlan {
  protected id = CalendarIntervalEnum.Quarterly;

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

  increment(date: Date): Date {
    return addQuarter(date, 1);
  }

  decrement(date: Date): Date {
    return subtractQuarter(date, 1);
  }
}

export class MonthlyPlan extends QuarterlyPlan {
  protected id = CalendarIntervalEnum.Monthly;

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

  increment(date: Date): Date {
    return addMonth(date, 1);
  }

  decrement(date: Date): Date {
    return subtractMonth(date, 1);
  }
}

export class WeeklyPlan extends MonthlyPlan {
  protected id = CalendarIntervalEnum.Weekly;

  getLabel(): string {
    return 'Weekly';
  }

  getTitle(date: Date, locale: string): string {
    const tid = this.getTimingUniqueId(date, locale);
    const splitTid = tid.split(';');
    const weekOfYear = parseInt(splitTid.at(-1).split(':')[1]);
    const yearOfWeek = parseInt(splitTid.at(0).split(':')[1]);
    const year = date.getFullYear();

    const showYear = year !== new Date().getFullYear() || year !== yearOfWeek;
    return `Week ${weekOfYear}` + (showYear ? ` · ${yearOfWeek}` : '');
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

  increment(date: Date): Date {
    return addDays(date, 1);
  }

  decrement(date: Date): Date {
    return subtractDays(date, 1);
  }
}

const PlanFactory = {
  [CalendarIntervalEnum.Unscheduled]: UnscheduledPlan,
  [CalendarIntervalEnum.Yearly]: YearlyPlan,
  [CalendarIntervalEnum.Quarterly]: QuarterlyPlan,
  [CalendarIntervalEnum.Monthly]: MonthlyPlan,
  [CalendarIntervalEnum.Weekly]: WeeklyPlan,
  [CalendarIntervalEnum.Daily]: DailyPlan,
};
