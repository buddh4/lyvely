import { Exclude, Expose } from 'class-transformer';
import { Matches } from 'class-validator';
import { formatDate, REGEX_DATE_FORMAT } from '@lyvely/calendar';
import type { CalendarDate } from '@lyvely/calendar';
import { BaseModel } from '@lyvely/core';

@Exclude()
export class TimerUpdateModel extends BaseModel<TimerUpdateModel> {
  @Expose()
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  constructor(date: CalendarDate) {
    super({ date: formatDate(date) });
  }
}
