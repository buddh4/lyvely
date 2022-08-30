import { Exclude, Expose } from 'class-transformer';
import { IActivity } from '../../interfaces';
import { UpdateHabitDto } from './update-habit.dto';
import { CalendarIntervalEnum } from "../../../calendar";
import { DataPointNumberInputStrategy } from "../../../time-series";
import { UserAssignmentStrategy } from "../../../user";
import { IsEnum, IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

@Exclude()
export class CreateHabitDto extends UpdateHabitDto {

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  title?: string;

  @Expose()
  @IsEnum(CalendarIntervalEnum)
  interval?: CalendarIntervalEnum;

  @Expose()
  @IsInt()
  @Min(1)
  max?: number;

  constructor(model?: IActivity | Partial<CreateHabitDto>) {
    super(model);

    this.interval = this.interval ?? CalendarIntervalEnum.Daily;
    this.score = this.score ?? 2;
    this.max = this.max ?? 3;
    this.min = Math.min(this.min ?? 0, this.max);
    this.optimal = Math.min(this.optimal ?? this.min, this.max);
    this.strategy = this.strategy ?? DataPointNumberInputStrategy.CheckboxNumber;
    this.userStrategy = this.userStrategy ?? UserAssignmentStrategy.Shared;
    this.tagNames = this.tagNames || []
  }
}
