import { Exclude, Expose } from 'class-transformer';
import { CreateContentModel } from '@lyvely/interface';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { Trim, Model } from '@lyvely/common';
import type { PartialPropertiesOf } from '@lyvely/common';
import { ChartType } from '../interfaces';
import { CalendarInterval } from '@lyvely/dates';

@Exclude()
export class CreateChartModel extends CreateContentModel<CreateChartModel> {
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

  constructor(data?: PartialPropertiesOf<CreateChartModel> | false) {
    super();
    if (data !== false) {
      Model.init(this, data);
    }
  }
}
