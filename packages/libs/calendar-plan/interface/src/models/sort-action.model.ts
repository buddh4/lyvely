import { Exclude, Expose } from 'class-transformer';
import { CalendarInterval } from '@lyvely/dates';
import { ICalendarPlanSort } from '../interfaces';
import type { BaseModelData } from '@lyvely/common';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class CalendarPlanSort implements ICalendarPlanSort {
  @Expose()
  attachToId?: string;

  @Expose()
  interval: CalendarInterval;

  constructor(obj?: BaseModelData<CalendarPlanSort>) {
    BaseModel.init(this, obj);
  }
}
