import { Exclude, Expose } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateChartModel } from './create-chart.model';
import type { PartialPropertiesOf } from '@lyvely/common';
import { Model } from '@lyvely/common';
import { IsEnum } from 'class-validator';
import { CalendarInterval } from '@lyvely/dates';
import { ChartType } from '../interfaces';

@Exclude()
export class UpdateChartModel extends PartialType(CreateChartModel) {
  @Expose()
  @IsEnum(CalendarInterval)
  interval?: CalendarInterval = undefined;

  @Expose()
  @IsEnum(ChartType)
  type?: ChartType = undefined;

  constructor(data?: PartialPropertiesOf<UpdateChartModel>) {
    super(false);
    Model.init(this, data);
  }
}
