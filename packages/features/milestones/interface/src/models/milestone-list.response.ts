import { Exclude, Expose } from 'class-transformer';
import { MilestoneModel } from './milestone.model';
import { BaseModel, PropertyType, TransformTo } from '@lyvely/common';

@Exclude()
export class MilestoneListResponse extends BaseModel<MilestoneListResponse> {
  @Expose()
  @TransformTo(MilestoneModel)
  @PropertyType([MilestoneModel])
  models: MilestoneModel[];
}
