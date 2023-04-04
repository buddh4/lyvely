import { Exclude, Expose } from 'class-transformer';
import { CalendarIntervalEnum } from '@/calendar';

@Exclude()
export class SortAction {
  @Expose()
  attachToId?: string;

  @Expose()
  interval: CalendarIntervalEnum;

  constructor(obj?: Partial<SortAction>) {
    if (obj) {
      this.attachToId = obj.attachToId;
      this.interval = obj.interval;
    }
  }
}
