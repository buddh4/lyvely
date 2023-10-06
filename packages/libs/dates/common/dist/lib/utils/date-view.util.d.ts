import { CalendarDateTime } from '../interfaces';
export declare function getMonthNameByIndex(id: number, short?: boolean): string;
export declare function getLocalizedDays(format?: 'long' | 'short' | 'narrow' | undefined): string[];
export declare function getLocalizedMonths(format?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined): string[];
export declare function getMonthNames(): string[];
export declare function getDayNameByIndex(id: number): string;
export declare function getDayNames(): string[];
export declare function formatDate(date: CalendarDateTime, format?: string): string;
export declare function formatDateWithTime(date: CalendarDateTime, format?: string): string;
export declare function getRelativeTime(timeInMs: number, locale: string, style?: Intl.RelativeTimeFormatStyle): string;
export declare function msToTime(ms: number): {
    hours: number;
    minutes: number;
    seconds: number;
};
interface ITime {
    hours: number;
    minutes: number;
    seconds: number;
}
export declare function timeToMs({ hours, minutes, seconds }: ITime): number;
export declare function secondsToTime(seconds: number): {
    hours: number;
    minutes: number;
    seconds: number;
};
export declare function padTime(num: string | number): string;
export declare function formatTime({ hours, minutes, seconds }: ITime): string;
export {};
