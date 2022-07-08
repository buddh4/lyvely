import { Exclude } from 'class-transformer';
import { AbstractEditActivityDto, IActivity } from '../../interfaces';

@Exclude()
export class EditHabitDto extends AbstractEditActivityDto {
  constructor(model?: IActivity | Partial<EditHabitDto>) {
    super(model);

    if(!model) {
      this.max = 3;
    }
  }
}
