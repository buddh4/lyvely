import { Exclude, Expose, Type } from 'class-transformer';
import { HabitModel } from '../models';
import { TagModel } from '@/tags';
import { BaseModel, PropertyType } from '@/models';

@Exclude()
export class UpdateHabitResponseDto extends BaseModel<UpdateHabitResponseDto> {
  @Expose()
  @Type(() => HabitModel)
  @PropertyType(HabitModel)
  model: HabitModel;

  @Expose()
  @Type(() => TagModel)
  @PropertyType([TagModel])
  tags: TagModel[];
}
