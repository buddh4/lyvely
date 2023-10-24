import { ITiming } from '../interfaces';
export declare class TimingModel implements ITiming {
    _id: string;
    tid: string;
    dayOfMonth: number;
    monthOfYear: number;
    year: number;
    date: Date;
    dayOfWeek: number;
    isoWeekOfYear: number;
    interval: number;
    quarter: number;
    constructor(id: string, interval: number);
}
