import { BaseModel } from '@lyvely/common';
import { Exclude, Expose, Type } from 'class-transformer';
import { getChartSeriesConfigTypes } from '../registries/chart-series.registry';
import { ChartSeriesConfigModel } from './chart-series-config.model';

@Exclude()
export class UpdateChartSeriesModel<
  TConfig extends ChartSeriesConfigModel = ChartSeriesConfigModel,
> {
  @Expose()
  @Type(() => ChartSeriesConfigModel, {
    discriminator: {
      property: 'type',
      subTypes: getChartSeriesConfigTypes(),
    },
    keepDiscriminatorProperty: true,
  })
  config: TConfig;

  constructor(config: ChartSeriesConfigModel) {
    BaseModel.init<UpdateChartSeriesModel>(this, { config });
  }
}
