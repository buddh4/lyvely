import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateMilestoneModel } from './create-milestone.model';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class UpdateMilestoneModel extends PartialType(CreateMilestoneModel) {
  constructor(data?: Partial<UpdateMilestoneModel>) {
    super(false);
    BaseModel.init(this, data, { skipGetDefaults: true });
  }
}
