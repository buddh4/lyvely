import { Injectable } from '@nestjs/common';
import { ProfileContext, ProfileScoreDao } from '@lyvely/api';
import { runIntervalAggregation } from '../aggregations/interval.aggregation';
import { ChartSeriesAccumulation } from '@lyvely/analytics-interface';
import { CalendarInterval } from '@lyvely/dates';
import type { ChartSeriesKeyValueData } from '@lyvely/analytics-interface';

@Injectable()
export class ScoreAggregationService {
  constructor(private profileScoreDao: ProfileScoreDao) {}

  async aggregateProfileScoreSeries(context: ProfileContext): Promise<ChartSeriesKeyValueData[]> {
    const { profile } = context;
    const $match = {
      oid: profile.oid,
      pid: profile._id,
    };

    return runIntervalAggregation(this.profileScoreDao, {
      interval: CalendarInterval.Monthly,
      accumulator: ChartSeriesAccumulation.Sum,
      accumulationField: 'score',
      dateField: 'date',
      $match,
      locale: profile.locale,
      preferences: profile.settings?.calendar,
      endDate: new Date(),
    });
  }
}
