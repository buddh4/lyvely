import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, Matches } from 'class-validator';
import { CalendarInterval, formatDate, REGEX_DATE_FORMAT } from '@lyvely/calendar';
import type { CalendarDate } from '@lyvely/calendar';
import { ICalendarPlanFilter } from '../interfaces';
import { BaseModel } from '@/models';

@Exclude()
export class CalendarPlanFilter
  extends BaseModel<CalendarPlanFilter>
  implements ICalendarPlanFilter
{
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

  @Expose()
  @IsMongoId()
  @IsOptional()
  cid?: string;

  constructor(
    date: CalendarDate,
    level: CalendarInterval = CalendarInterval.Unscheduled,
    data?: Partial<CalendarPlanFilter>,
  ) {
    super(data);
    this.date = formatDate(date);
    this.level = level;
  }
}
