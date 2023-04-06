import { Exclude, Expose } from 'class-transformer';
import { CalendarInterval } from '@/calendar';

@Exclude()
export class SortAction {
  @Expose()
  attachToId?: string;

  @Expose()
  interval: CalendarInterval;

  constructor(obj?: Partial<SortAction>) {
    if (obj) {
      this.attachToId = obj.attachToId;
      this.interval = obj.interval;
    }
  }
}
