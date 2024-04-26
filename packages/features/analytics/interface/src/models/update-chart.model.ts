import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateChartModel } from './create-chart.model';
import type { PartialPropertiesOf } from '@lyvely/common';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class UpdateChartModel extends PartialType(CreateChartModel) {
  constructor(data?: PartialPropertiesOf<UpdateChartModel>) {
    super(false);
    BaseModel.init(this, data);
  }
}
