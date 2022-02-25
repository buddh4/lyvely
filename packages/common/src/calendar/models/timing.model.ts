import { ITiming } from '../interfaces';

export class TimingModel implements ITiming {
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

    constructor(id: string, interval: number) {
        this._id = id;
        this.timingId = id;
        this.interval = interval;
    }
}