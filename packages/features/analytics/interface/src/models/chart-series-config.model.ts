import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { BaseModel, type BaseModelData } from '@lyvely/common';
import { ChartType, IChartSeriesConfig } from '../interfaces';

@Exclude()
export class ChartSeriesConfigModel implements IChartSeriesConfig {
  @Expose()
  id: string;

  @Expose()
  @IsEnum(ChartType)
  chartType: ChartType;

  @Expose()
  type: string;

  @Expose()
  @IsString()
  @MaxLength(255)
  name: string;

  templateId?: string;

  constructor(data: BaseModelData<ChartSeriesConfigModel>) {
    BaseModel.init(this, data);
  }
}
