import { Exclude, Expose } from 'class-transformer';
import { CalendarIntervalEnum } from "../../../calendar";
import { DataPointNumberInputStrategy } from "../../../time-series";
import { UserAssignmentStrategy } from "../../../user";
import { IsEnum, IsInt, IsNotEmpty, IsString, Length, Min, Max, IsOptional, IsArray, MaxLength } from 'class-validator';
import { BaseModel, Gte, Lte } from "../../../model";
import { ActivityModel } from "../../models";

@Exclude()
export class CreateHabitDto extends BaseModel<CreateHabitDto> {

  @Expose()
  @IsString()
  @IsNotEmpty()
  //@Length(0, 100)
  title: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Length(0, 2000)
  text?: string;

  @Expose()
  @IsEnum(CalendarIntervalEnum)
  interval: CalendarIntervalEnum;

  @Expose()
  @IsInt()
  @Min(1)
  max: number;

  @Expose()
  @IsInt()
  @Max(100)
  @Min(-100)
  score: number;

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

  constructor(model?: ActivityModel | Partial<CreateHabitDto>) {
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
