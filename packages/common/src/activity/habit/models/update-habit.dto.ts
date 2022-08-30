import { Exclude, Expose } from 'class-transformer';
import { IActivity, isActivity } from '../../interfaces';
import { CalendarIntervalEnum } from "../../../calendar";
import { BaseDto, Gte, Lte } from "../../../model";
import { DataPointNumberInputStrategy } from "../../../time-series";
import { UserAssignmentStrategy } from "../../../user";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';

@Exclude()
export class UpdateHabitDto extends BaseDto<UpdateHabitDto> {

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  title?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  text?: string;

  @Expose()
  @IsOptional()
  @IsEnum(CalendarIntervalEnum)
  interval?: CalendarIntervalEnum;

  @Expose()
  @IsInt()
  @IsOptional()
  @Min(1)
  max?: number;

  @Expose()
  @IsInt()
  @Max(100)
  @Min(-100)
  @IsOptional()
  score?: number;

  @Expose()
  @IsInt()
  @Lte('max')
  @IsOptional()
  @Min(0)
  min?: number;

  @Expose()
  @IsInt()
  @Gte('min')
  @Lte('max')
  @IsOptional()
  @Min(0)
  optimal?: number;

  @Expose()
  @IsEnum(DataPointNumberInputStrategy)
  @IsOptional()
  strategy?: DataPointNumberInputStrategy;

  @Expose()
  @IsEnum(UserAssignmentStrategy)
  @IsOptional()
  userStrategy?: UserAssignmentStrategy;

  @Expose()
  @IsArray()
  @MaxLength(20, { each: true })
  @IsOptional()
  tagNames?: string[];

  constructor(model?: IActivity | Partial<UpdateHabitDto>) {
    super(model);

    if (isActivity(model)) {
      this.interval = model.dataPointConfig.interval;
      this.max = model.dataPointConfig.max;
      this.min = model.dataPointConfig.min;
      this.optimal = model.dataPointConfig.optimal;
    }
  }
}
