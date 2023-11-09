import { ILocaleManager } from './locale-loader.interface';

export type CalendarDate = string | number | Date;
export type CalendarDateTime = CalendarDate | IDateTime;

type UnitTypeShort = 'd' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms';
type UnitTypeLong =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';
type UnitTypeLongPlural =
  | 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'quarters'
  | 'years';
export type UnitType = UnitTypeLong | UnitTypeLongPlural | UnitTypeShort;

export interface IDateTime {
  isDateTime: boolean;
  toDate(): Date;
  subtract(value: number, unit?: UnitType): IDateTime;
  add(value: number, unit?: UnitType): IDateTime;
  utc(preserveTime?: boolean): IDateTime;
  date(): number;
  date(value: number): IDateTime;
  day(): number;
  day(value: number): IDateTime;
  weekday(): number;
  weekday(value: number): IDateTime;
  week(): number;
  week(value: number): IDateTime;
  isoWeek(): number;
  isoWeek(value: number): IDateTime;
  isoWeekday(): number;
  isoWeekday(value: number): IDateTime;
  isoWeekYear(): number;
  weekYear(): number;
  quarter(): number;
  quarter(value: number): IDateTime;
  month(): number;
  month(value: number): IDateTime;
  year(): number;
  year(value: number): IDateTime;
  time(h?: number, m?: number, s?: number, ms?: number): IDateTime;
  unixTs(): number;
  format(template: string): string;
}

export function implementsIDateTime(obj: any): obj is IDateTime {
  return obj && (<IDateTime>obj).isDateTime === true;
}

export function toDate(date: CalendarDateTime) {
  return dateTime(date).toDate();
}

export type DateTimeFactory = (
  date?: CalendarDate,
  utc?: boolean,
  locale?: string,
  timezone?: string,
) => IDateTime;

let dateTimeFactory: DateTimeFactory;

export function setDateTimeFactory(factory: DateTimeFactory) {
  dateTimeFactory = factory;
}

let localeManager: ILocaleManager;

export function setLocaleManager(loader: ILocaleManager) {
  localeManager = loader;
}

/**
 * Asynchronously loads a locale module based on the provided locale string.
 * @param locale The locale string in the format 'language' or 'language-COUNTRY'.
 */
export async function loadDateTimeLocale(locale: string): Promise<void> {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.loadLocale(locale);
}

/**
 * Sets the given locale as global locale.
 * Note, the given locale needs to be loaded.
 * @param locale The locale string in the format 'language' or 'language-COUNTRY'.
 */
export function setGlobalDateTimeLocale(locale: string): void {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.setGlobalLocale(locale);
}

/**
 * Checks if a specific locale is already loaded.
 * @param locale The locale string in the format 'language' or 'language-COUNTRY'.
 */
export function isDateTimeLocaleLoaded(locale: string): boolean {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.isLoaded(locale);
}

/**
 * Returns an already loaded locale or undefined in case it was not loaded or does not exist.
 * Note, the format will depend on adapter.
 * @param locale The locale string in the format 'language' or 'language-COUNTRY'.
 */
export function getDateTimeLocale<TLocale = any>(locale: string): TLocale | undefined {
  if (!localeManager) {
    throw new Error('No locale manager set');
  }

  return localeManager.getLocale(locale);
}

export function dateTime(
  date?: CalendarDateTime,
  utc = false,
  locale?: string,
  timezone?: string,
): IDateTime {
  if (!dateTimeFactory) {
    throw new Error('No dateTimeFactory set');
  }

  if (implementsIDateTime(date)) return date;

  if (typeof date === 'string' && /^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(date)) {
    date = getFullDayDate(date);
  }

  return dateTimeFactory(date, utc, locale, timezone);
}

/**
 * Returns a utc date instance without time. When given a string this function cuts
 * @param date
 */
export function getFullDayDate(date: CalendarDate): Date {
  if (typeof date === 'string') {
    const dateNoTime = date.split('T')[0];
    if (/^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(dateNoTime)) {
      const splitDate = dateNoTime.split('-');
      date = new Date(
        Date.UTC(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2])),
      );
    } else {
      date = new Date(date);
    }
  } else if (date instanceof Date) {
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
