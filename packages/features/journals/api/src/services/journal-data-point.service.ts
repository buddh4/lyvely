import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AnalyticsEvents,
  FetchSeriesDataEvent,
  isTimeSeriesAggregationInterval,
} from '@lyvely/analytics';
import { JournalDataPointDao } from '../daos';
import { DataPointService } from '@lyvely/time-series';
import { type JournalValueChartSeriesConfig } from '../schemas';
import { Journal, JournalDataPoint } from '../schemas';
import { JournalValueAggregationService } from './journal-value-aggregation.service';
import { CHART_SERIES_JOURNAL_VALUE } from '@lyvely/journals-interface';

@Injectable()
export class JournalDataPointService extends DataPointService<Journal, JournalDataPoint> {
  @Inject()
  protected dataPointDao: JournalDataPointDao;

  @Inject()
  protected aggregationService: JournalValueAggregationService;

  @OnEvent(AnalyticsEvents.EVENT_FETCH_SERIES_DATA)
  onFetchSeriesDataEvent(event: FetchSeriesDataEvent) {
    const { context, config, query } = event;

    if (event.isSeriesType<JournalValueChartSeriesConfig>(config, CHART_SERIES_JOURNAL_VALUE.id)) {
      event.setResult(
        this.aggregationService.aggregateTimeSeriesValues(context, {
          name: config.name,
          color: config.color,
          interval: isTimeSeriesAggregationInterval(query?.interval) ? query?.interval : undefined,
        })
      );
    }
  }
}
