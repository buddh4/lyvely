import { ContentModel, IContent } from '@/content';
import { ISortable } from '@/models';
import { IDataPointConfig } from '../interfaces';
import { Expose } from 'class-transformer';
import { ICalendarPlanEntry } from '@/calendar-plan';
import { CalendarInterval } from '@/calendar';

export interface ITimeSeriesContentConfig<TDataPointConfig = IDataPointConfig> {
  timeSeries: TDataPointConfig;
}

export interface ITimeSeriesContentModel<TDataPointConfig = IDataPointConfig> extends IContent {
  config: ITimeSeriesContentConfig<TDataPointConfig>;
  get interval(): CalendarInterval;
}

@Expose()
export class TimeSeriesContentModel<
    TContentModel extends ITimeSeriesContentModel = ITimeSeriesContentModel,
    TConfig extends ITimeSeriesContentConfig = ITimeSeriesContentConfig,
  >
  extends ContentModel<TContentModel, TConfig>
  implements ISortable, ICalendarPlanEntry
{
  get interval(): CalendarInterval {
    return this.timeSeriesConfig.interval;
  }

  get timeSeriesConfig(): TConfig['timeSeries'] {
    return this.config.timeSeries;
  }

  set timeSeriesConfig(config: TConfig['timeSeries']) {
    this.config.timeSeries = config;
  }
}
