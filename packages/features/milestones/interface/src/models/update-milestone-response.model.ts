import { Exclude, Expose, Type } from 'class-transformer';
import { ContentUpdateResponse } from '@lyvely/core-interface';
import { PropertyType } from '@lyvely/common';
import { MilestoneModel } from './milestone.model';

@Exclude()
export class UpdateMilestoneResponse extends ContentUpdateResponse<MilestoneModel> {
  @Expose()
  @Type(() => MilestoneModel)
  @PropertyType(MilestoneModel)
  model: MilestoneModel;
}
