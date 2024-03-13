import { Expose } from 'class-transformer';
import { TimerDataPointModel, UpdateDataPointResponse } from '@lyvely/time-series-interface';
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import { HabitModel } from './habit.model';

@Expose()
export class UpdateHabitDataPointResponse extends UpdateDataPointResponse {
  score: number;

  @PropertyType(HabitModel)
  override model: HabitModel;

  constructor(data: PropertiesOf<UpdateHabitDataPointResponse>) {
    super(false);
    BaseModel.init(this, data);
  }
}

@Expose()
export class UpdateHabitDataPointTimerResponse {
  score: number;

  @PropertyType(TimerDataPointModel)
  dataPoint: TimerDataPointModel;

  constructor(data: PropertiesOf<UpdateHabitDataPointTimerResponse>) {
    BaseModel.init(this, data);
  }
}
