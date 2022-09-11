import { Exclude, Expose, Type } from 'class-transformer';
import { TagDto } from "../../../tags";
import { BaseModel } from "../../../model";
import { TaskDto } from "./task.dto";

@Exclude()
export class EditTaskResponseDto extends BaseModel<EditTaskResponseDto> {
  @Expose()
  @Type(() => TaskDto)
  model: TaskDto;

  @Expose()
  @Type(() => TagDto)
  tags: TagDto[];
}
