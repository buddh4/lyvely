import { Exclude, Expose, Type } from 'class-transformer';
import { TagModel } from '@/tags';
import { BaseModel } from '@/models';
import { TaskModel } from '../models';

@Exclude()
export class UpdateTaskResponseDto extends BaseModel<UpdateTaskResponseDto> {
  @Expose()
  @Type(() => TaskModel)
  model: TaskModel;

  @Expose()
  @Type(() => TagModel)
  tags: TagModel[];
}
