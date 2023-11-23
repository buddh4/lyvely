import { Expose } from 'class-transformer';
import { TimerDataPointModel, UpdateDataPointResponse } from '@lyvely/time-series-interface';
import { PropertyType } from '@lyvely/common';
import { HabitModel } from './habit.model';

@Expose()
export class UpdateHabitDataPointResponse extends UpdateDataPointResponse<UpdateHabitDataPointResponse> {
  score: number;

  @PropertyType(HabitModel)
  model: HabitModel;
}

@Expose()
export class UpdateHabitDataPointTimerResponse extends UpdateHabitDataPointResponse {
  @PropertyType(TimerDataPointModel)
  dataPoint: TimerDataPointModel;
}
