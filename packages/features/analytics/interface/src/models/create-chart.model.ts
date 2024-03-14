import { Exclude, Expose } from 'class-transformer';
import { CreateContentModel } from '@lyvely/interface';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { Trim, type BaseModelData, BaseModel } from '@lyvely/common';
import { ChartType } from '../interfaces';
import { CalendarInterval } from '@lyvely/dates';

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
  @IsEnum(CalendarInterval)
  interval: CalendarInterval = CalendarInterval.Monthly;

  @Expose()
  @IsEnum(ChartType)
  type: ChartType = ChartType.Graph;

  constructor(data?: BaseModelData<CreateChartModel>) {
    super(false);
    BaseModel.init(this, data);
  }
}
