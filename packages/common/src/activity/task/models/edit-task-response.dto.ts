import { Exclude, Expose, Type } from 'class-transformer';
import { TagDto } from "../../../tags";
import { BaseDto } from "../../../model";
import { TaskDto } from "./task.dto";

@Exclude()
export class EditTaskResponseDto extends BaseDto<EditTaskResponseDto> {
  @Expose()
  @Type(() => TaskDto)
  model: TaskDto;

  @Expose()
  @Type(() => TagDto)
  tags: TagDto[];
}
