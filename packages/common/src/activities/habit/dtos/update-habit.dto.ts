import { Exclude } from 'class-transformer';
import { ActivityModel } from '../../models';
import { PartialType } from '@buddh4/mapped-types';
import { CreateHabitDto } from './create-habit.dto';
import { applyValidationProperties } from '@/utils';

@Exclude()
export class UpdateHabitDto extends PartialType(CreateHabitDto) {
  constructor(model?: ActivityModel | Partial<UpdateHabitDto>) {
    if (model instanceof ActivityModel) {
      super(null, false);
      applyValidationProperties(this, model);
      applyValidationProperties(this, model.dataPointConfig);
      applyValidationProperties(this, model.data);
    } else {
      super(model, false);
    }
  }
}
