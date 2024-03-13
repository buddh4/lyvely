import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateHabitModel } from './create-habit.model';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class UpdateHabitModel extends PartialType(CreateHabitModel) {
  constructor(model?: Partial<UpdateHabitModel>) {
    super(false);
    BaseModel.init(this, model, { skipGetDefaults: true });
  }
}
