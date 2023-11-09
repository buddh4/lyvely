import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import {
  CalendarDate,
  IDateTime,
  setDateTimeFactory,
  setLocaleManager,
  UnitType,
} from '../../interfaces';
import { isDefined } from 'class-validator';
import { useDayJsLocaleLoader } from './dayjs-locale.manager';

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);

export class DayJsDateTime implements IDateTime {
  instance: dayjs.Dayjs;

  isDateTime = true;

  constructor(date: CalendarDate | dayjs.Dayjs, locale?: string, timezone?: string) {
    if (dayjs.isDayjs(date)) {
      this.instance = date;
    } else {
      this.instance = dayjs(date);

      if (locale) {
        this.instance = this.instance.locale(locale);
      }

      if (timezone) {
        this.instance = this.instance.tz(timezone);
      }
    }
  }

  add(value: number, unit?: UnitType): IDateTime {
    return new DayJsDateTime(this.instance.add(value, unit as dayjs.ManipulateType));
  }

  time(h = 0, m = 0, s = 0, ms = 0) {
    return new DayJsDateTime(this.instance.hour(h).minute(m).second(s).millisecond(ms));
  }

  unixTs() {
    return this.instance.unix();
  }

  subtract(value: number, unit?: UnitType): IDateTime {
    return new DayJsDateTime(this.instance.subtract(value, unit as dayjs.ManipulateType));
  }

  utc(preserveTime?: boolean): IDateTime {
    return new DayJsDateTime(this.instance.utc(preserveTime));
  }

  toDate(): Date {
    return this.instance.toDate();
  }

  date(): number;
  date(value: number): IDateTime;
  date(value?: number): number | IDateTime {
    return isDefined(value)
      ? new DayJsDateTime(this.instance.date(value as number))
      : this.instance.date();
  }

  day(): number;
  day(value: number): IDateTime;
  day(value?: number): number | IDateTime {
    return isDefined(value)
      ? new DayJsDateTime(this.instance.day(value as number))
      : this.instance.day();
  }

  week(): number;
  week(value: number): IDateTime;
  week(value?: number): number | IDateTime {
    return isDefined(value)
      ? new DayJsDateTime(this.instance.week(value as number))
      : this.instance.week();
  }

  weekday(): number;
  weekday(value: number): IDateTime;
  weekday(value?: number): number | IDateTime {
    return isDefined(value)
      ? new DayJsDateTime(this.instance.weekday(value as number))
      : this.instance.weekday();
  }

  weekYear(): number {
    return this.instance.weekYear();
  }

  isoWeek(): number;
  isoWeek(value: number): IDateTime;
  isoWeek(value?: number): number | IDateTime {
    return isDefined(value)
      ? new DayJsDateTime(this.instance.isoWeek(value as number))
      : this.instance.isoWeek();
  }

  isoWeekday(): number;
  isoWeekday(value: number): IDateTime;
  isoWeekday(value?: number): number | IDateTime {
    return isDefined(value)
      ? new DayJsDateTime(this.instance.isoWeekday(value as number))
      : this.instance.isoWeekday();
  }

  isoWeekYear(): number {
    return this.instance.isoWeekYear();
  }

  quarter(): number;
  quarter(value: number): IDateTime;
  quarter(value?: number): number | IDateTime {
    return isDefined(value)
      ? new DayJsDateTime(this.instance.quarter(value as number))
      : this.instance.quarter();
  }

  month(): number;
  month(value: number): IDateTime;
  month(value?: number): number | IDateTime {
    return isDefined(value)
      ? new DayJsDateTime(this.instance.month(value as number))
      : this.instance.month();
  }

  year(): number;
  year(value: number): IDateTime;
  year(value?: number): number | IDateTime {
    return isDefined(value)
      ? new DayJsDateTime(this.instance.year(value as number))
      : this.instance.year();
  }

  format(template: string): string {
    return this.instance.format(template);
  }
}

export function dateTimeFactory(
  date?: CalendarDate,
  utc = false,
  locale?: string,
  timezone?: string,
): IDateTime {
  date = date || new Date();
  const dateTime = new DayJsDateTime(date, locale, timezone);
  return utc ? dateTime.utc() : dateTime;
}

export function useDayJsDateTimeAdapter() {
  setDateTimeFactory(dateTimeFactory);
  setLocaleManager(useDayJsLocaleLoader());
}
