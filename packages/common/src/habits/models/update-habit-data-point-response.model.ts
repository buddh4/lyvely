import { Exclude, Expose, Type } from 'class-transformer';
import { PropertyType } from '@/models';
import { IsNumber } from 'class-validator';
import { NumberDataPointModel, UpdateDataPointResponse } from '@/time-series';

@Exclude()
export class UpdateHabitDataPointResponse extends UpdateDataPointResponse<UpdateHabitDataPointResponse> {
  @Expose()
  @IsNumber()
  score: number;

  @Expose()
  @Type(() => NumberDataPointModel)
  @PropertyType(NumberDataPointModel)
  dataPoint: NumberDataPointModel;
}
