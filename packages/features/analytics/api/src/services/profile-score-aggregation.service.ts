import { Injectable } from '@nestjs/common';
import {
  type DocumentIdentity,
  ProfileContext,
  ProfileScoreDao,
  type Tag,
  type User,
} from '@lyvely/api';
import { runTimeSeriesAggregation } from '../aggregations/time-series.aggregation';
import {
  ChartSeriesAccumulation,
  type TimeSeriesAggregationInterval,
  type TimeSeriesChartData,
} from '@lyvely/analytics-interface';

export interface ScoreAggregationOptions {
  interval?: TimeSeriesAggregationInterval;
  uids?: DocumentIdentity<User>[];
  tagIds?: DocumentIdentity<Tag>[];
  name?: string;
  endDate?: Date;
}

@Injectable()
export class ProfileScoreAggregationService {
  constructor(private profileScoreDao: ProfileScoreDao) {}

  async aggregateProfileScoreSeries(
    context: ProfileContext,
    options?: ScoreAggregationOptions,
  ): Promise<TimeSeriesChartData<string>[]> {
    const { profile } = context;

    const $match = {
      oid: profile.oid,
      pid: profile._id,
    };

    return runTimeSeriesAggregation(this.profileScoreDao, {
      name: options?.name || 'Score',
      interval: options?.interval || '7D',
      filter: {
        uids: options?.uids,
        tagIds: options?.tagIds,
      },
      timezone: profile.timezone,
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
