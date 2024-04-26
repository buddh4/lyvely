import { Exclude, Expose } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { BaseModel, type BaseModelData, Trim } from '@lyvely/common';
import { IChartSeriesConfig } from '../interfaces';

@Exclude()
export class ChartSeriesConfigModel implements IChartSeriesConfig {
  @Expose({ toPlainOnly: true })
  @IsMongoId()
  @IsOptional()
  id: string;

  @Expose()
  @MaxLength(255)
  type: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(250)
  name: string;

  constructor(data: BaseModelData<ChartSeriesConfigModel>) {
    BaseModel.init(this, data);
  }
}
