import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateTaskDto } from './create-task.dto';

@Exclude()
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  constructor(model?: Partial<UpdateTaskDto>) {
    super(model, false);
  }
}
