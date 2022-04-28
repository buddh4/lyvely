export interface ITiming {
    _id: string;
    tid: string;
    dayOfMonth: number;
    monthOfYear: number;
    year: number;
    date: Date;
    dayOfWeek: number; // note Su = 0
    isoWeekOfYear: number;
    interval: number;
    quarter: number;
}
