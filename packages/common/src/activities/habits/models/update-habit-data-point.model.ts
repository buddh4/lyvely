import { Exclude, Expose } from 'class-transformer';
import { IsInt, Matches, Min } from 'class-validator';
import { REGEX_DATE_FORMAT } from '@/calendar';

@Exclude()
export class UpdateHabitDataPointModel {
  @Expose()
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  @Expose()
  @IsInt()
  @Min(0)
  value: number;

  constructor(obj: Partial<UpdateHabitDataPointModel>) {
    Object.assign(this, obj);
  }
}
