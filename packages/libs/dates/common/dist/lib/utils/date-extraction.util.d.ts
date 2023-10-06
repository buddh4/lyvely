import { CalendarDate } from '../interfaces';
export declare function getSecondsSinceStartOfDay(d: CalendarDate): number;
export declare function getIsoWeekOfYear(date: CalendarDate): number;
export declare function getQuarter(date: CalendarDate): number;
export declare function isCurrentYear(date: CalendarDate): boolean;
export declare function isToday(cDate: CalendarDate): boolean;
export declare function isThisYear(cDate: CalendarDate): boolean;
export declare function isThisMonth(cDate: CalendarDate): boolean;
export declare function isInFuture(cDate: CalendarDate, ignoreTime?: boolean): boolean;
