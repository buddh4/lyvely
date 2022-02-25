export interface ITiming {
    _id: string;
    timingId: string;
    dayOfMonth: number;
    monthOfYear: number;
    year: number;
    date: Date;
    dayOfWeek: number; // note Su = 0
    weekOfYear: number;
    isoWeekOfYear: number;
    interval: number;
    quarter: number;
}