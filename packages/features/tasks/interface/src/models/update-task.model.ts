import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateTaskModel } from './create-task.model';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class UpdateTaskModel extends PartialType(CreateTaskModel) {
  constructor(data?: Partial<UpdateTaskModel>) {
    super(false);
    BaseModel.init(this, data, { skipGetDefaults: true });
  }
}
