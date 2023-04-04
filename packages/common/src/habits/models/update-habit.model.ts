import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateHabitModel } from './create-habit.model';

@Exclude()
export class UpdateHabitModel extends PartialType(CreateHabitModel) {
  constructor(model?: Partial<UpdateHabitModel>) {
    super(model, false);
  }
}
