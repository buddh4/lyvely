import { Exclude, Type, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@lyvely/common';
import {
  DataPointModel,
  ITimeSeriesCalendarPlanResponse,
  NumberDataPointModel,
} from '@lyvely/time-series-interface';
import { HabitModel } from './habit.model';

@Exclude()
export class HabitSearchResponse
  extends BaseModel<HabitSearchResponse>
  implements ITimeSeriesCalendarPlanResponse<HabitModel>
{
  @Expose()
  @PropertyType([HabitModel])
  models: HabitModel[];

  @Expose()
  @PropertyType([NumberDataPointModel])
  dataPoints: DataPointModel[];
}
