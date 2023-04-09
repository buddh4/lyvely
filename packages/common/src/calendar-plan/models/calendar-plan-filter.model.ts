import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { CalendarInterval, formatDate, REGEX_DATE_FORMAT } from '@/calendar';
import type { CalendarDate } from '@/calendar';
import { ICalendarPlanFilter } from '../interfaces';

@Exclude()
export class CalendarPlanFilter implements ICalendarPlanFilter {
  @Expose()
  @IsString()
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  @Expose()
  @IsEnum(CalendarInterval)
  @Transform((value) => parseInt(value.value, 10), { toClassOnly: true }) // for query to class transformation
  level: CalendarInterval;

  @Expose()
  @IsBoolean()
  @IsOptional()
  archived?: boolean;

  constructor(date: CalendarDate, level: CalendarInterval = CalendarInterval.Unscheduled) {
    this.date = formatDate(date);
    this.level = level;
  }
}
