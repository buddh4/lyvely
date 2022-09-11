import { Exclude } from 'class-transformer';
import { isActivity } from "../../models";
import { PartialType } from '@buddh4/mapped-types';
import { CreateHabitDto } from "./create-habit.dto";
import { ActivityModel } from "../../models";

@Exclude()
export class UpdateHabitDto extends PartialType(CreateHabitDto)  {

  constructor(model?: ActivityModel | Partial<UpdateHabitDto>) {
    super(model);

    if (isActivity(model)) {
      this.interval = model.dataPointConfig.interval;
      this.max = model.dataPointConfig.max;
      this.min = model.dataPointConfig.min;
      this.optimal = model.dataPointConfig.optimal;
    }
  }
}
