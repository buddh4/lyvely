import { Injectable } from '@nestjs/common';
import {
  Content,
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
  cid?: DocumentIdentity<Content>;
  contentType?: string;
  name?: string;
  color?: string;
  endDate?: Date;
}

@Injectable()
export class ProfileScoreAggregationService {
  constructor(private profileScoreDao: ProfileScoreDao) {}

  async aggregateProfileScoreSeries(
    context: ProfileContext,
    options?: ScoreAggregationOptions
  ): Promise<TimeSeriesChartData<string>[]> {
    const { profile } = context;

    return runTimeSeriesAggregation(this.profileScoreDao, {
      name: options?.name || 'Score',
      color: options?.color,
      interval: options?.interval || '7D',
      filter: {
        oid: profile.oid,
        pid: profile._id,
        uids: options?.uids,
        tagIds: options?.tagIds,
        cid: options?.cid,
        contentType: options?.contentType,
      },
      timezone: profile.timezone,
      accumulator: ChartSeriesAccumulation.Sum,
      accumulationField: 'score',
      dateField: 'date',
      locale: profile.locale,
      preferences: profile.settings?.calendar,
      endDate: options?.endDate || new Date(),
    });
  }
}
