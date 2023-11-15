import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { BaseModel, IsIn } from '@lyvely/common';
import { Expose } from 'class-transformer';

@Expose()
export class CalendarPreferences extends BaseModel<CalendarPreferences> {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  weekStart?: number;

  @IsOptional()
  @IsBoolean()
  @IsIn(['iso'])
  weekStrategy?: 'iso' | 'locale';
}
