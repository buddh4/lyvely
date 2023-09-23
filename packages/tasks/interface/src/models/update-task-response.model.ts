import { Exclude, Expose, Type } from 'class-transformer';
import { TagModel } from '@/tags';
import { PropertyType } from '@lyvely/common';
import { TaskModel } from './task.model';
import { ContentUpdateResponse } from '@lyvely/content';

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
