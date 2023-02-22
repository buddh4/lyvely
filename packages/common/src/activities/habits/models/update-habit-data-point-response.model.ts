import { Exclude, Expose, Type } from 'class-transformer';
import { PropertyType } from '@/models';
import { IsNumber } from 'class-validator';
import { NumberDataPointModel } from '@/time-series';
import { UpdateDataPointResponse } from '@/calendar-plan';

@Exclude()
export class UpdateHabitDataPointResponse extends UpdateDataPointResponse {
  @Expose()
  @IsNumber()
  score: number;

  @Expose()
  @Type(() => NumberDataPointModel)
  @PropertyType(NumberDataPointModel)
  dataPoint: NumberDataPointModel;
}
