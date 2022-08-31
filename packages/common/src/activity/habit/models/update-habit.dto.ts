import { Exclude } from 'class-transformer';
import { IActivity, isActivity } from '../../interfaces';
import { PartialType } from '@buddh4/mapped-types';
import { CreateHabitDto } from "./create-habit.dto";

@Exclude()
export class UpdateHabitDto extends PartialType(CreateHabitDto)  {

  constructor(model?: IActivity | Partial<UpdateHabitDto>) {
    super(model);

    if (isActivity(model)) {
      this.interval = model.dataPointConfig.interval;
      this.max = model.dataPointConfig.max;
      this.min = model.dataPointConfig.min;
      this.optimal = model.dataPointConfig.optimal;
    }
  }
}
