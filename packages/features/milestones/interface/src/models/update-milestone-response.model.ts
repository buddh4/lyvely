import { Exclude, Expose, Type } from 'class-transformer';
import { TagModel } from '@lyvely/profiles-interface';
import { PropertyType } from '@lyvely/common';
import { MilestoneModel } from './milestone.model';
import { ContentUpdateResponse } from '@lyvely/content';

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
