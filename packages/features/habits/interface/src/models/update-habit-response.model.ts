import { Expose } from 'class-transformer';
import { HabitModel } from './habit.model';
import { PropertyType } from '@lyvely/common';
import { ContentUpdateResponse } from '@lyvely/interface';

export class UpdateHabitResponse extends ContentUpdateResponse<HabitModel> {
  @Expose()
  @PropertyType(HabitModel)
  model: HabitModel;
}
