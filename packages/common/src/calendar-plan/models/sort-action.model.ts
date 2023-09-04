import { Exclude, Expose } from 'class-transformer';
import { CalendarInterval } from '@lyvely/calendar';
import { ICalendarPlanSort } from '../interfaces';

@Exclude()
export class CalendarPlanSort implements ICalendarPlanSort {
  @Expose()
  attachToId?: string;

  @Expose()
  interval: CalendarInterval;

  constructor(obj?: Partial<CalendarPlanSort>) {
    if (obj) {
      this.attachToId = obj.attachToId;
      this.interval = obj.interval;
    }
  }
}
