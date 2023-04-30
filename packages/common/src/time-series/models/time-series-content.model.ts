import { ContentModel } from '@/content';
import { ISortable, PropertyType } from '@/models';
import { ITimeSeriesContentConfig, ITimeSeriesContent, ITimeSeriesSummary } from '../interfaces';
import { Expose } from 'class-transformer';
import { ICalendarPlanEntry } from '@/calendar-plan';
import { CalendarInterval } from '@/calendar';

export class TimeSeriesSummaryWindowEntryModel {
  @Expose()
  tid: string;
  @Expose()
  value: number;
}

export class TimeSeriesSummaryModel {
  @Expose()
  @PropertyType([TimeSeriesSummaryWindowEntryModel])
  window: TimeSeriesSummaryWindowEntryModel[];
}

@Expose()
export class TimeSeriesContentModel<
    TContentModel extends ITimeSeriesContent = ITimeSeriesContent,
    TConfig extends ITimeSeriesContentConfig = ITimeSeriesContentConfig,
  >
  extends ContentModel<TContentModel, TConfig>
  implements ISortable, ICalendarPlanEntry
{
  @Expose()
  @PropertyType(TimeSeriesSummaryModel)
  timeSeriesSummary: TimeSeriesSummaryModel;

  get interval(): CalendarInterval {
    return this.timeSeriesConfig.interval;
  }

  set interval(interval: CalendarInterval) {
    this.timeSeriesConfig.interval = interval;
  }

  get timeSeriesConfig(): TConfig['timeSeries'] {
    return this.config.timeSeries;
  }

  set timeSeriesConfig(config: TConfig['timeSeries']) {
    this.config.timeSeries = config;
  }
}
