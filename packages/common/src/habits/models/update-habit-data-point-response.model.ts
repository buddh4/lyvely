import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { DataPointModel, TimerDataPointModel, UpdateDataPointResponse } from '@/time-series';
import { PropertyType } from '@/models';

@Expose()
export class UpdateHabitDataPointResponse extends UpdateDataPointResponse<UpdateHabitDataPointResponse> {
  @IsNumber()
  score: number;
  dataPoint: DataPointModel;
}

@Expose()
export class UpdateHabitDataPointTimerResponse extends UpdateHabitDataPointResponse {
  @PropertyType(TimerDataPointModel)
  dataPoint: TimerDataPointModel;
}
