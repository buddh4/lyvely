import { Exclude } from 'class-transformer';
import { IActivity, AbstractEditActivityDto } from '../../interfaces';

@Exclude()
export class EditHabitDto extends AbstractEditActivityDto {
  constructor(model?: IActivity | Partial<EditHabitDto>) {
    super(model);

    if(!model) {
      this.max = 3;
    }
  }
}