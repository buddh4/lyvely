import { Exclude, Type, Expose } from 'class-transformer';
import { TaskModel } from './task.model';
import { BaseModel } from '@lyvely/models';
import { ICalendarPlanResponse } from '@lyvely/calendar-plan';

@Exclude()
export class TaskSearchResponse
  extends BaseModel<TaskSearchResponse>
  implements ICalendarPlanResponse<TaskModel>
{
  @Expose()
  @Type(() => TaskModel)
  models: TaskModel[];
}
