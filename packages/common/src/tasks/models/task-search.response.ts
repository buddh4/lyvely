import { Exclude, Type, Expose } from 'class-transformer';
import { TaskModel } from './task.model';
import { BaseModel } from '@/models';
import { NumberDataPointModel } from '@/time-series';
import { ICalendarPlanResponse } from '@/calendar-plan';

@Exclude()
export class TaskSearchResponse
  extends BaseModel<TaskSearchResponse>
  implements ICalendarPlanResponse<TaskModel, NumberDataPointModel>
{
  @Expose()
  @Type(() => TaskModel)
  models: TaskModel[];

  @Expose()
  @Type(() => NumberDataPointModel)
  dataPoints: NumberDataPointModel[];
}
