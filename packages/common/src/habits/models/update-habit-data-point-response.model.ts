import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import {
  DataPointModel,
  TimerDataPointModel,
  TimeSeriesContentModel,
  UpdateDataPointResponse,
} from '@/time-series';
import { PropertyType } from '@/models';
import { HabitModel } from '@/habits';

@Expose()
export class UpdateHabitDataPointResponse extends UpdateDataPointResponse<UpdateHabitDataPointResponse> {
  score: number;
  model: HabitModel;
}

@Expose()
export class UpdateHabitDataPointTimerResponse extends UpdateHabitDataPointResponse {
  @PropertyType(TimerDataPointModel)
  dataPoint: TimerDataPointModel;
}
