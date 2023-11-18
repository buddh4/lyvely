import { Exclude, Expose } from 'class-transformer';
import { TaskModel } from './task.model';
import { BaseModel, PropertyType } from '@lyvely/common';
import { ICalendarPlanResponse } from '@lyvely/calendar-plan-interface';

@Exclude()
export class TaskSearchResponse
  extends BaseModel<TaskSearchResponse>
  implements ICalendarPlanResponse<TaskModel>
{
  @Expose()
  @PropertyType([TaskModel])
  models: TaskModel[];
}
