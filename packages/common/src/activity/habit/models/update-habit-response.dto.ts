import { Exclude, Expose, Type } from 'class-transformer';
import { HabitDto } from "./habit.dto";
import { TagDto } from "../../../tags";
import { BaseDto } from "../../../model";

@Exclude()
export class UpdateHabitResponseDto extends BaseDto<UpdateHabitResponseDto> {
  @Expose()
  @Type(() => HabitDto)
  model: HabitDto;

  @Expose()
  @Type(() => TagDto)
  tags: TagDto[];
}
