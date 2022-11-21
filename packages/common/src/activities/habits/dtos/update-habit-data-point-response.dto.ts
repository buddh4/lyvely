import { Exclude, Expose, Type } from 'class-transformer';
import { BaseModel, PropertyType } from '@/models';
import { IsNumber } from 'class-validator';
import { NumberDataPointModel } from '@/time-series';

@Exclude()
export class UpdateHabitDataPointResultDto extends BaseModel<UpdateHabitDataPointResultDto> {
  @Expose()
  @IsNumber()
  score: number;

  @Expose()
  @Type(() => NumberDataPointModel)
  @PropertyType(NumberDataPointModel)
  dataPoint: NumberDataPointModel;
}
