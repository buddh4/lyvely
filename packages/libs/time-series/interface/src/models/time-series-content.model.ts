import { ContentModel } from '@lyvely/content-interface';
import { ISortable, PropertyType } from '@lyvely/common';
import { ITimeSeriesContentConfig, ITimeSeriesContent } from '../interfaces';
import { Expose } from 'class-transformer';
import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';
import { CalendarInterval } from '@lyvely/dates';

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
    TID = string,
    TModel extends ITimeSeriesContent<TID> = ITimeSeriesContent<TID>,
    TConfig extends ITimeSeriesContentConfig = ITimeSeriesContentConfig,
  >
  extends ContentModel<TID, TModel, TConfig>
  implements ISortable, ICalendarPlanEntry<TID>
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
