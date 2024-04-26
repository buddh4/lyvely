import { Exclude, Expose, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, Matches } from 'class-validator';
import { CalendarInterval, formatDate, REGEX_DATE_FORMAT } from '@lyvely/dates';
import type { CalendarDate } from '@lyvely/dates';
import { ICalendarPlanFilter } from '../interfaces';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class CalendarPlanFilter implements ICalendarPlanFilter {
  @Expose()
  @IsString()
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  @Expose()
  @IsEnum(CalendarInterval)
  @Type(() => Number)
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
    BaseModel.init(this, data);
    this.date = formatDate(date);
    this.level = level;
  }
}
