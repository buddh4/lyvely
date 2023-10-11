import { Expose, Type } from 'class-transformer';
import { HabitModel } from './habit.model';
import { TagModel } from '@lyvely/core-interface';
import { PropertyType } from '@lyvely/common';
import { ContentUpdateResponse } from '@lyvely/core-interface';

export class UpdateHabitResponse extends ContentUpdateResponse<HabitModel> {
  @Expose()
  @Type(() => HabitModel)
  @PropertyType(HabitModel)
  model: HabitModel;

  @Expose()
  @Type(() => TagModel)
  @PropertyType([TagModel])
  tags: TagModel[];
}
