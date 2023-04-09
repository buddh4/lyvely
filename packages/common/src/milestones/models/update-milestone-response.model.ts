import { Exclude, Expose, Type } from 'class-transformer';
import { TagModel } from '@/tags';
import { PropertyType } from '@/models';
import { MilestoneModel } from './milestone.model';
import { ContentUpdateResponse } from '@/content';

@Exclude()
export class UpdateMilestoneResponse extends ContentUpdateResponse<MilestoneModel> {
  @Expose()
  @Type(() => MilestoneModel)
  @PropertyType(MilestoneModel)
  model: MilestoneModel;

  @Expose()
  @Type(() => TagModel)
  tags: TagModel[];
}
