import { Expose, Type } from 'class-transformer';
import { HabitModel } from './habit.model';
import { TagModel } from '@lyvely/profiles-interface';
import { PropertyType } from '@lyvely/common';
import { ContentUpdateResponse } from '@lyvely/content-interface';

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
