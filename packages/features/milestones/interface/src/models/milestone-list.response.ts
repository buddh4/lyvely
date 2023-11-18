import { Exclude, Expose } from 'class-transformer';
import { MilestoneModel } from './milestone.model';
import { BaseModel, PropertyType } from '@lyvely/common';

@Exclude()
export class MilestoneListResponse extends BaseModel<MilestoneListResponse> {
  @Expose()
  @PropertyType([MilestoneModel])
  models: MilestoneModel[];
}
