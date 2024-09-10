import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { CalendarInterval } from '@lyvely/dates';
import { CreateContentModel } from '@lyvely/interface';
import { BaseModel, type BaseModelData, Trim } from '@lyvely/common';

@Exclude()
export class CreateMilestoneModel extends CreateContentModel {
  @Expose()
  @IsEnum(CalendarInterval)
  interval: CalendarInterval;

  constructor(data: BaseModelData<CreateMilestoneModel>) {
    super(false);
    BaseModel.init(this, data);
  }

  getDefaults() {
    return {
      interval: CalendarInterval.Unscheduled,
      tagNames: [],
    };
  }
}
