import { Exclude, Expose, Type } from 'class-transformer';
import { TagModel } from '@/tags';
import { PropertyType } from '@/models';
import { TaskModel } from './task.model';
import { ContentUpdateResponse } from '@/content';

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
