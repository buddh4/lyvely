import { Exclude, Type, Expose } from 'class-transformer';
import { BaseModel } from '@/models';
import { NumberDataPointModel } from '@/time-series';
import { ICalendarPlanResponse } from '@/calendar-plan';
import { HabitModel } from './habit.model';

@Exclude()
export class HabitSearchResponse
  extends BaseModel<HabitSearchResponse>
  implements ICalendarPlanResponse<HabitModel, NumberDataPointModel>
{
  @Expose()
  @Type(() => HabitModel)
  models: HabitModel[];

  @Expose()
  @Type(() => NumberDataPointModel)
  dataPoints: NumberDataPointModel[];
}
