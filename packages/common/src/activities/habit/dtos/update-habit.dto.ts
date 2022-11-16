import { Exclude } from 'class-transformer';
import { isActivity, ActivityModel } from '../../models';
import { PartialType } from '@buddh4/mapped-types';
import { CreateHabitDto } from './create-habit.dto';

@Exclude()
export class UpdateHabitDto extends PartialType(CreateHabitDto) {
  constructor(model?: ActivityModel | Partial<UpdateHabitDto>) {
    super(model);

    if (isActivity(model)) {
      this.interval = model.dataPointConfig.interval;
      this.max = model.dataPointConfig.max;
      this.min = model.dataPointConfig.min;
      this.optimal = model.dataPointConfig.optimal;
      this.text = model.data.textContent;
      this.title = model.data.title;
    }
  }
}
