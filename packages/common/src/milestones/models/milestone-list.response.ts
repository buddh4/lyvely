import { Exclude, Expose } from 'class-transformer';
import { MilestoneModel } from './milestone.model';
import { BaseModel, PropertyType, TransformTo } from '@/models';

@Exclude()
export class MilestoneListResponse extends BaseModel<MilestoneListResponse> {
  @Expose()
  @TransformTo(MilestoneModel)
  @PropertyType([MilestoneModel])
  models: MilestoneModel[];
}
