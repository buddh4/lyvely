import { Exclude, Expose } from 'class-transformer';
import { ContentUpdateResponse } from '@lyvely/interface';
import { PropertyType } from '@lyvely/common';
import { TaskModel } from './task.model';

@Exclude()
export class UpdateTaskResponse extends ContentUpdateResponse<TaskModel> {
  @Expose()
  @PropertyType(TaskModel)
  model: TaskModel;
}
