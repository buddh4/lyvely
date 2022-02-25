import { Exclude } from 'class-transformer';
import { AbstractCreateActivityDto, IActivity } from '../../interfaces';
import { EditHabitDto } from './edit-habit.dto';

@Exclude()
export class CreateHabitDto extends AbstractCreateActivityDto {
  constructor(model?: IActivity | Partial<EditHabitDto>) {
    super(model);

    if(!model) {
      this.max = 3;
      this.min = 0;
      this.optimal = 0;
    }
  }
}