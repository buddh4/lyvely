import { Exclude, Expose } from 'class-transformer';
import { Matches } from 'class-validator';
import { formatDate, REGEX_DATE_FORMAT } from '@lyvely/dates';
import type { CalendarDate } from '@lyvely/dates';

@Exclude()
export class TimerUpdateModel {
  @Expose()
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  constructor(date: CalendarDate) {
    this.date = formatDate(date);
  }
}
