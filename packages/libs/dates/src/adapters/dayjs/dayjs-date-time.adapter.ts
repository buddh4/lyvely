import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import {
  CalendarDate,
  IDateTime,
  setDateTimeFactory,
  setLocaleManager,
  CalendarUnitType,
  ICalendarPreferences,
} from '../../interfaces';
import { isDefined } from 'class-validator';
import { useDayJsLocaleManager } from './dayjs-locale.manager';

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);

export class DayJsDateTime implements IDateTime {
  instance: dayjs.Dayjs;

  isDateTime = true;

  constructor(
    date: CalendarDate | dayjs.Dayjs,
    locale?: string,
    preferences?: ICalendarPreferences,
  ) {
    if (dayjs.isDayjs(date)) {
      this.instance = date;
    } else {
      this.instance = dayjs(date);

      if (preferences) {
        locale = useDayJsLocaleManager().extendLocale(locale, preferences);
      }

      if (locale) {
        this.instance = this.instance.locale(locale);
      }
    }
  }

  add(value: number, unit?: CalendarUnitType): IDateTime {
    return new DayJsDateTime(this.instance.add(value, unit as dayjs.ManipulateType));
  }

  time(h = 0, m = 0, s = 0, ms = 0) {
    return new DayJsDateTime(this.instance.hour(h).minute(m).second(s).millisecond(ms));
  }

  unixTs() {
    return this.instance.unix();
  }

  subtract(value: number, unit?: CalendarUnitType): IDateTime {
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

  format(template?: string): string {
    return this.instance.format(template);
  }

  toTZ(timezone: string): IDateTime {
    return new DayJsDateTime(this.instance.tz(timezone, true));
  }
}

export function dateTimeFactory(
  date?: CalendarDate,
  locale?: string,
  preferences?: ICalendarPreferences,
): IDateTime {
  date = date || new Date();
  return new DayJsDateTime(date, locale, preferences);
}

export function useDayJsDateTimeAdapter() {
  setDateTimeFactory(dateTimeFactory);
  setLocaleManager(useDayJsLocaleManager());
}
