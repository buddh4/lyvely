import { Exclude, Expose } from 'class-transformer';
import { Matches } from 'class-validator';
import { formatDate, REGEX_DATE_FORMAT } from '@/calendar';
import type { CalendarDate } from '@/calendar';
import { BaseModel } from '@/models';

@Exclude()
export class TimerUpdate extends BaseModel<TimerUpdate> {
  @Expose()
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  constructor(date: CalendarDate) {
    super({ date: formatDate(date) });
  }
}
