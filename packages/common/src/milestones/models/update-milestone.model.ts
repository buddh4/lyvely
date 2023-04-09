import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateMilestoneModel } from './create-milestone.model';

@Exclude()
export class UpdateMilestoneModel extends PartialType(CreateMilestoneModel) {
  constructor(model?: Partial<UpdateMilestoneModel>) {
    super(model, false);
  }
}
