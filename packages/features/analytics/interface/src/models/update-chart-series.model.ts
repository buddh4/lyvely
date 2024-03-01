import { Model } from '@lyvely/common';
import type { PartialPropertiesOf } from '@lyvely/common';
import { Exclude, Expose, Type } from 'class-transformer';
import { getGraphSeriesConfigTypes } from '../registries';
import { IsOptional } from 'class-validator';

export class ChartSeriesConfigModel {}

@Exclude()
export class UpdateChartSeriesModel<TConfig = unknown> {
  @Expose()
  type: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => ChartSeriesConfigModel, {
    discriminator: {
      property: 'type',
      subTypes: getGraphSeriesConfigTypes(),
    },
  })
  @IsOptional()
  config?: TConfig;

  constructor(data?: PartialPropertiesOf<UpdateChartSeriesModel>) {
    Model.init(this, data);
  }
}
