import { Injectable } from '@nestjs/common';
import { ProfileContext, ProfileScoreDao } from '@lyvely/api';
import { runTimeSeriesAggregation } from '../aggregations/time-series.aggregation';
import {
  ChartSeriesAccumulation,
  type TimeSeriesAggregationInterval,
  ChartSeriesKeyValueData,
} from '@lyvely/analytics-interface';

export interface ScoreAggregationOptions {
  interval?: TimeSeriesAggregationInterval;
  name?: string;
  endDate?: Date;
}

@Injectable()
export class ScoreAggregationService {
  constructor(private profileScoreDao: ProfileScoreDao) {}

  async aggregateProfileScoreSeries(
    context: ProfileContext,
    options?: ScoreAggregationOptions,
  ): Promise<ChartSeriesKeyValueData[]> {
    const { profile } = context;

    const $match = {
      oid: profile.oid,
      pid: profile._id,
    };

    return runTimeSeriesAggregation(this.profileScoreDao, {
      name: options?.name || 'Score',
      interval: options?.interval || '7D',
      accumulator: ChartSeriesAccumulation.Sum,
      accumulationField: 'score',
      dateField: 'date',
      $match,
      locale: profile.locale,
      preferences: profile.settings?.calendar,
      endDate: options?.endDate || new Date(),
    });
  }
}
