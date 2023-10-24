export type CalendarDate = string | number | Date;
export type CalendarDateTime = CalendarDate | IDateTime;
type UnitTypeShort = 'd' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms';
type UnitTypeLong = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
type UnitTypeLongPlural = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
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
export declare function implementsIDateTime(obj: any): obj is IDateTime;
export declare function toDate(date: CalendarDateTime): Date;
export type DateTimeFactory = (date?: CalendarDate, utc?: boolean, locale?: string, timezone?: string) => IDateTime;
export declare function setDateTimeFactory(factory: DateTimeFactory): void;
export declare function dateTime(date?: CalendarDateTime, utc?: boolean, locale?: string, timezone?: string): IDateTime;
export declare function getFullDayDate(date: CalendarDate): Date;
export {};
