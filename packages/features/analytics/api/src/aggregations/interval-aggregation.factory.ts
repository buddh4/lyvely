import { IntervalAggregationOptions } from './interval-aggregation.helper';
import { CalendarInterval } from '@lyvely/dates';
import { YearlyIntervalAggregation } from './yearly-interval-aggregation.helper';
import { QuarterlyIntervalAggregation } from './quarterly-interval-aggregation.helper';
import { MonthlyIntervalAggregation } from './monthly-interval-aggregation.helper';
import { WeeklyIntervalAggregation } from './weekly-interval-aggregation.helper';
import { DailyIntervalAggregation } from './daily-interval-aggregation.helper';

export function createIntervalAggregation(options: IntervalAggregationOptions) {
  switch (options.interval) {
    case CalendarInterval.Yearly:
      return new YearlyIntervalAggregation(options).build();
    case CalendarInterval.Quarterly:
      return new QuarterlyIntervalAggregation(options).build();
    case CalendarInterval.Monthly:
      return new MonthlyIntervalAggregation(options).build();
    case CalendarInterval.Weekly:
      return new WeeklyIntervalAggregation(options).build();
    default:
      return new DailyIntervalAggregation(options).build();
  }
}
