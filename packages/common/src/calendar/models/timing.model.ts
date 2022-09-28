import { ITiming } from '../interfaces';

export class TimingModel implements ITiming {
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

  constructor(id: string, interval: number) {
    this._id = id;
    this.tid = id;
    this.interval = interval;
  }
}
