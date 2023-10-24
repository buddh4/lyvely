import { CalendarInterval } from '../models/calendar-interval.enum';
import { CalendarDateTime } from '../interfaces/calendar-date.interface';
export declare function toTimingId(cd: CalendarDateTime, level?: CalendarInterval, locale?: string, weekStrategy?: WeekStrategy): string;
export declare enum WeekStrategy {
    ISO = 0,
    LOCALE = 1
}
export declare function toWeekTimingId(cd: CalendarDateTime, locale: string, weekStrategy?: WeekStrategy): string;
export declare function getTimingIds(d: CalendarDateTime, locale: string, level?: CalendarInterval, weekStrategy?: WeekStrategy): string[];
