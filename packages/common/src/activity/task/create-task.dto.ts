import { Exclude } from 'class-transformer';
import { AbstractCreateActivityDto, IActivity } from '../interfaces';
import { EditTaskDto } from './task.model';

@Exclude()
export class CreateTaskDto extends AbstractCreateActivityDto {
  constructor(model?: IActivity | Partial<EditTaskDto>) {
    super(model);

    if(!model) {
      this.max = 1;
      this.min = 1;
      this.optimal = 1;
    }
  }
}