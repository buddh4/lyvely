import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { type PropertiesOf } from '@lyvely/common';
import { Expose } from 'class-transformer';
import { ICalendarPreferences } from '@lyvely/dates';

/**
 * This class defines calendar preferences, which can be used to overwrite locale specific behavior.
 */
@Expose()
export class CalendarPreferences implements ICalendarPreferences {
  /**
   * Defines the start of a week. If the value is 1, Monday will be the start of week instead of Sunday
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  weekStart?: number;

  /**
   * Defines the start of the year, e.g. 4 means the week that contains Jan 4th is the first week of the year.
   * The value should be between 0 and 6 where 0 means the calculation of the first week is done by ISO standard.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  yearStart?: number;

  constructor(data?: PropertiesOf<CalendarPreferences>) {
    this.weekStart = data?.weekStart;
    this.yearStart = data?.yearStart;
  }
}
