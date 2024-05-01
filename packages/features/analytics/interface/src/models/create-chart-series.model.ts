import { BaseModel } from '@lyvely/common';
import { Exclude, Expose, Type } from 'class-transformer';
import { getChartSeriesConfigTypes } from '../registries/chart-series.registry';
import { ChartSeriesConfigModel } from './chart-series-config.model';

@Exclude()
export class CreateChartSeriesModel<
  TConfig extends Omit<ChartSeriesConfigModel, 'id'> = Omit<ChartSeriesConfigModel, 'id'>,
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
    BaseModel.init<CreateChartSeriesModel>(this, { config });
  }
}
