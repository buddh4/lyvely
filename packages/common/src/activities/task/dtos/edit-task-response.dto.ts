import { Exclude, Expose, Type } from 'class-transformer';
import { TagModel } from "@/tags";
import { BaseModel } from "@/models";
import { TaskModel } from "../models";

@Exclude()
export class EditTaskResponseDto extends BaseModel<EditTaskResponseDto> {
  @Expose()
  @Type(() => TaskModel)
  model: TaskModel;

  @Expose()
  @Type(() => TagModel)
  tags: TagModel[];
}
