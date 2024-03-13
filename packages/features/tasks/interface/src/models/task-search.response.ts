import { Exclude, Expose } from 'class-transformer';
import { TaskModel } from './task.model';
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import { ICalendarPlanResponse } from '@lyvely/calendar-plan-interface';

@Exclude()
export class TaskSearchResponse implements ICalendarPlanResponse<TaskModel> {
  @Expose()
  @PropertyType([TaskModel])
  models: TaskModel[];

  constructor(data: PropertiesOf<TaskSearchResponse>) {
    BaseModel.init(this, data);
  }
}
