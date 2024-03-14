import { Exclude, Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import { BaseModel, type BaseModelData } from '@lyvely/common';
import { IChartSeriesConfig } from '../interfaces';

@Exclude()
export class ChartSeriesConfigModel implements IChartSeriesConfig {
  @Expose()
  id: string;

  @Expose()
  type: string;

  @Expose()
  @IsString()
  @MaxLength(255)
  name: string;

  constructor(data?: BaseModelData<ChartSeriesConfigModel>) {
    BaseModel.init(this, data);
  }
}
