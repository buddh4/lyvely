import { Exclude, Expose } from 'class-transformer';
import { CreateContentModel } from '@lyvely/interface';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { Trim, type BaseModelData, BaseModel } from '@lyvely/common';
import { ChartCategory } from '../interfaces';
import type { ChartSeriesConfigModel } from './chart-series-config.model';

@Exclude()
export class CreateChartModel extends CreateContentModel {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(250)
  title: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Trim()
  @Length(0, 2500)
  text?: string;

  @Expose()
  @IsEnum(ChartCategory)
  category: ChartCategory = ChartCategory.Graph;

  @Expose()
  series: ChartSeriesConfigModel;

  constructor(data?: BaseModelData<CreateChartModel>) {
    super(false);
    BaseModel.init(this, data);
  }
}
