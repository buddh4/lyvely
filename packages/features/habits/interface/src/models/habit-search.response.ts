import { Exclude, Expose } from 'class-transformer';
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import { DataPointModel, ITimeSeriesCalendarPlanResponse } from '@lyvely/time-series-interface';
import { HabitModel } from './habit.model';

@Exclude()
export class HabitSearchResponse implements ITimeSeriesCalendarPlanResponse<HabitModel> {
  @Expose()
  @PropertyType([HabitModel])
  models: HabitModel[];

  @Expose()
  dataPoints: DataPointModel[];

  constructor(data: PropertiesOf<HabitSearchResponse>) {
    BaseModel.init(this, data);
  }
}
