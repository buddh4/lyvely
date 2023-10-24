import { Exclude, Expose, Type } from 'class-transformer';
import { TagModel, ContentUpdateResponse } from '@lyvely/core-interface';
import { PropertyType } from '@lyvely/common';
import { TaskModel } from './task.model';

@Exclude()
export class UpdateTaskResponse extends ContentUpdateResponse<TaskModel> {
  @Expose()
  @Type(() => TaskModel)
  @PropertyType(TaskModel)
  model: TaskModel;

  @Expose()
  @Type(() => TagModel)
  tags: TagModel[];
}
