import { Exclude, Expose, Type } from 'class-transformer';
import { HabitDto } from "./habit.dto";
import { TagDto } from "../../../tags";
import { BaseDto } from "../../../model";

@Exclude()
export class EditHabitResponseDto extends BaseDto<EditHabitResponseDto> {
  @Expose()
  @Type(() => HabitDto)
  model: HabitDto;

  @Expose()
  @Type(() => TagDto)
  tags: TagDto[];
}
