import { Exclude, Expose } from 'class-transformer';
import { ContentUpdateResponse } from '@lyvely/core-interface';
import { PropertyType } from '@lyvely/common';
import { MilestoneModel } from './milestone.model';

@Exclude()
export class UpdateMilestoneResponse extends ContentUpdateResponse<MilestoneModel> {
  @Expose()
  @PropertyType(MilestoneModel)
  model: MilestoneModel;
}
