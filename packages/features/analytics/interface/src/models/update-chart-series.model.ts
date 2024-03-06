import { Model } from '@lyvely/common';
import type { PartialPropertiesOf } from '@lyvely/common';
import { Exclude, Expose, Type } from 'class-transformer';
import { getChartSeriesConfigTypes } from '../registries/chart-series.registry';
import { ChartSeriesConfigModel } from './chart-series-config.model';

@Exclude()
export class UpdateChartSeriesModel<
  TConfig extends ChartSeriesConfigModel<undefined> = ChartSeriesConfigModel<undefined>,
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

  constructor(config?: ChartSeriesConfigModel<undefined>) {
    Model.init<UpdateChartSeriesModel>(this, { config });
  }
}
