import { Content, type DocumentIdentity, ProfileContext } from '@lyvely/api';
import {
  ChartSeriesAccumulation,
  runTimeSeriesAggregation,
  type TimeSeriesAggregationInterval,
  type TimeSeriesChartData,
} from '@lyvely/analytics';
import { AbstractDataPointDao } from '../daos';

export interface TimeSeriesValueAggregationOptions {
  interval?: TimeSeriesAggregationInterval;
  cid?: DocumentIdentity<Content>;
  name?: string;
  color?: string;
  endDate?: Date;
}

export abstract class TimeSeriesValueAggregationService {
  protected abstract dataPointDao: AbstractDataPointDao<any, any, any>;

  async aggregateTimeSeriesValues(
    context: ProfileContext,
    options?: TimeSeriesValueAggregationOptions
  ): Promise<TimeSeriesChartData<string>[]> {
    const { profile } = context;

    return runTimeSeriesAggregation(this.dataPointDao, {
      name: options?.name || 'Value',
      color: options?.color,
      interval: options?.interval || '7D',
      filter: {
        cid: options?.cid,
        oid: profile.oid,
        pid: profile._id,
        /**
         *  TODO: This is a workaround since we do not know the user strategy at this point
         *  We could either load the content
         */

        uids: context.user ? [context.user, null] : [null],
      },
      groupByUid: false,
      timezone: profile.timezone,
      accumulator: ChartSeriesAccumulation.Sum,
      accumulationField: 'value',
      dateField: 'date',
      locale: profile.locale,
      preferences: profile.settings?.calendar,
      endDate: options?.endDate || new Date(),
    });
  }
}
