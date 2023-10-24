import { Exclude, Type, Expose } from 'class-transformer';
import { BaseModel } from '@lyvely/common';
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
  @Type(() => HabitModel)
  models: HabitModel[];

  @Expose()
  @Type(() => NumberDataPointModel)
  dataPoints: DataPointModel[];
}
