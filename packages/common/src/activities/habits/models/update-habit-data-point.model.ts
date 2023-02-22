import { Exclude, Expose } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

import { UpdateDataPointModel } from '@/calendar-plan';

@Exclude()
export class UpdateHabitDataPointModel extends UpdateDataPointModel {
  @Expose()
  @IsInt()
  @Min(0)
  value: number;
}
