import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateHabitDto } from './create-habit.dto';

@Exclude()
export class UpdateHabitDto extends PartialType(CreateHabitDto) {
  constructor(model?: Partial<UpdateHabitDto>) {
    super(model, false);
  }
}
