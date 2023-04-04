import { Expose, Type } from 'class-transformer';
import { HabitModel } from './habit.model';
import { TagModel } from '@/tags';
import { PropertyType } from '@/models';
import { ContentUpdateResponse } from '@/content';

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
