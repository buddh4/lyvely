import { Exclude, Expose } from 'class-transformer';
import { AbstractActivityDto, ActivityType } from '../../interfaces';
import { IHabit } from '../interfaces';
import { IsEnum } from 'class-validator';

@Exclude()
export class HabitDto extends AbstractActivityDto<IHabit> implements IHabit {
  @Expose()
  @IsEnum(ActivityType)
  type: string = ActivityType.Habit;
}
