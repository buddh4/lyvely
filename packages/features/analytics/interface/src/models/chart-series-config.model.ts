import { Exclude, Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import type { PartialPropertiesOf } from '@lyvely/common';
import { Document } from '@lyvely/common';
import { IChartSeriesConfig } from '../interfaces';

@Exclude()
export class ChartSeriesConfigModel<TID = string> implements IChartSeriesConfig<TID> {
  @Expose()
  id: TID;

  @Expose()
  type: string;

  @Expose()
  @IsString()
  @MaxLength(255)
  name: string;

  constructor(data?: PartialPropertiesOf<ChartSeriesConfigModel<any>>) {
    Document.init(this, data);
  }
}
