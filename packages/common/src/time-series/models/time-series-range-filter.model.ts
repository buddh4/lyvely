import { IsArray, IsOptional, IsString, Matches } from "class-validator";
import { Transform, Type } from "class-transformer";
import {
  getCalendarPlanArray,
  DayIterator, formatDate, REGEX_DATE_FORMAT, toTimingId
} from '@/calendar';

import type { CalendarDate } from '@/calendar';

/**
 * Note: In an earlier implementation TimeSeriesRangeFilter was used instead of DataPointIntervalFilter
 */
export class TimeSeriesRangeFilter {

  @IsOptional()
  @IsString()
  @Matches(REGEX_DATE_FORMAT)
  from: CalendarDate;

  @IsOptional()
  @IsString()
  @Matches(REGEX_DATE_FORMAT)
  to: CalendarDate;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @Transform(({value}) => value.split(','))
  includes?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @Transform(({value}) => value.split(','))
  excludes?: string[];

  constructor(obj: Partial<TimeSeriesRangeFilter>) {
    Object.assign(this, obj);
  }

  static createForRange(from: CalendarDate, to: CalendarDate) {
    return new TimeSeriesRangeFilter({
      from: from,
      to: to
    });
  }

  getAsParams() {
    const result: Partial<TimeSeriesRangeFilter> = {};
    if (this.from) {
      result.from = formatDate(this.from);
    }

    if (this.to) {
      result.to = formatDate(this.to);
    }

    if (this.includes) {
      result.includes = this.includes;
    }

    if (this.excludes) {
      result.excludes = this.excludes;
    }

    return result;
  }
}

export function getTimingIdsByRange(filter: TimeSeriesRangeFilter): string[] {
  if (!filter.from) {
    return filter.includes || [];
  }

  const timingSet = new Set<string>();

  for (const date of new DayIterator(filter.from, filter.to)) {
    for (const interval of getCalendarPlanArray()) {
      const timingId = toTimingId(date, interval);

      if ((!filter.includes || filter.includes.includes(timingId))
        && (!filter.excludes || !filter.excludes.includes(timingId))) {
        timingSet.add(timingId);
      }
    }
  }

  return Array.from(timingSet);
}
