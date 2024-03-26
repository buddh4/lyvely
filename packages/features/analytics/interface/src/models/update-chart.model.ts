import { Exclude, Expose } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateChartModel } from './create-chart.model';
import type { PartialPropertiesOf } from '@lyvely/common';
import { BaseModel } from '@lyvely/common';
import { IsEnum } from 'class-validator';
import { ChartCategory } from '../interfaces';

@Exclude()
export class UpdateChartModel extends PartialType(CreateChartModel) {
  @Expose()
  @IsEnum(ChartCategory)
  override category?: ChartCategory = undefined;

  constructor(data?: PartialPropertiesOf<UpdateChartModel>) {
    super(false);
    BaseModel.init(this, data);
  }
}
