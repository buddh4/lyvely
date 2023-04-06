import { Exclude, Type, Expose } from 'class-transformer';
import { BaseModel } from '@/models';
import {
  DataPointModel,
  ITimeSeriesCalendarPlanResponse,
  NumberDataPointModel,
} from '@/time-series';
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
