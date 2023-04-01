import { ContentModel, IContent } from '@/content';
import { ISortable } from '@/models';
import { IDataPointConfig } from '../data-points';
import { Expose } from 'class-transformer';

export interface ITimeSeriesContentConfig<TDataPointConfig = IDataPointConfig> {
  timeSeries: TDataPointConfig;
}

export interface ITimeSeriesContentModel<TDataPointConfig = IDataPointConfig> extends IContent {
  config: ITimeSeriesContentConfig<TDataPointConfig>;
}

@Expose()
export class TimeSeriesContentModel<
    TContentModel extends ITimeSeriesContentModel = ITimeSeriesContentModel,
    TConfig extends ITimeSeriesContentConfig = ITimeSeriesContentConfig,
  >
  extends ContentModel<TContentModel, TConfig>
  implements ISortable
{
  get timeSeriesConfig(): TConfig['timeSeries'] {
    return this.config.timeSeries;
  }

  set timeSeriesConfig(config: TConfig['timeSeries']) {
    this.config.timeSeries = config;
  }
}
