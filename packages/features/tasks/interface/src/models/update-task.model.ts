import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateTaskModel } from './create-task.model';

@Exclude()
export class UpdateTaskModel extends PartialType(CreateTaskModel) {
  constructor(model?: Partial<UpdateTaskModel>) {
    super(model, false);
  }
}
