import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';
import { CalendarIntervalEnum } from '../../calendar';
import { Gte, Lte } from '../../model';
import { IActivity, isActivity } from './activity.interface';
import { Exclude, Expose } from 'class-transformer';
import { DataPointNumberInputStrategy } from '../../time-series';
import { UserAssignmentStrategy } from "../../user";

@Exclude()
export abstract class AbstractCreateActivityDto {

  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsString()
  @Length(0, 2000)
  @IsOptional()
  text?: string;

  @Expose()
  @IsEnum(CalendarIntervalEnum)
  interval: number

  @Expose()
  @IsInt()
  @IsOptional()
  @Min(0)
  max?: number;

  @Expose()
  @IsInt()
  @Max(100)
  @Min(-100)
  score: number;

  @Expose()
  @IsInt()
  @Lte('max')
  @Min(0)
  min?: number;

  @Expose()
  @IsInt()
  @Gte('min')
  @Lte('max')
  @Min(0)
  optimal?: number;

  @Expose()
  @IsEnum(DataPointNumberInputStrategy)
  strategy?: DataPointNumberInputStrategy;

  @Expose()
  @IsEnum(UserAssignmentStrategy)
  userStrategy?: UserAssignmentStrategy;

  @Expose()
  @IsArray()
  @MaxLength(20, { each: true })
  categories?: string[];

  constructor(model?: IActivity | Partial<AbstractCreateActivityDto>) {
    // Defaults
    this.optimal = 0;
    this.max = 1;
    this.min = 0;
    this.score = 2;

    if (isActivity(model)) {
      this.title = model.title;
      this.text = model.text;
      this.interval = model.dataPointConfig.interval;
      this.max = model.dataPointConfig.max;
      this.min = model.dataPointConfig.min || 0;
      this.optimal = model.dataPointConfig.optimal || 0;
      this.score = model.score || 0;
      this.categories = model.categories || [];
    } else {
      Object.assign(this, model);
    }

    this.interval = this.interval ?? CalendarIntervalEnum.Daily;
    this.min = Math.min(this.min ?? 0, this.max);
    this.optimal = Math.min(this.optimal ?? this.max, this.max);
    this.score = this.score ?? 0;
    this.strategy = this.strategy ?? DataPointNumberInputStrategy.CheckboxNumber;
    this.userStrategy = this.userStrategy ?? UserAssignmentStrategy.Shared;
    this.categories = this.categories || [];
  }
}
