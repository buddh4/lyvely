import { Exclude, Expose, Type } from 'class-transformer';
import { HabitModel } from "../models";
import { TagModel } from "../../../tags";
import { BaseModel } from "../../../model";

@Exclude()
export class UpdateHabitResponseDto extends BaseModel<UpdateHabitResponseDto> {
  @Expose()
  @Type(() => HabitModel)
  model: HabitModel;

  @Expose()
  @Type(() => TagModel)
  tags: TagModel[];
}
