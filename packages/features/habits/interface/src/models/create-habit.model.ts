import { Expose } from 'class-transformer';
import { CalendarInterval } from '@lyvely/dates';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointSettings,
  ITimerDataPointSettings,
} from '@lyvely/time-series-interface';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { UserAssignmentStrategy } from '@lyvely/interface';
import { BaseModel, type BaseModelData, Gte, Lte, Trim } from '@lyvely/common';

@Expose()
export class CreateHabitModel implements INumberDataPointSettings, ITimerDataPointSettings {
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(250)
  title: string;

  @IsString()
  @IsOptional()
  @Trim()
  @Length(0, 2500)
  text?: string;

  @IsEnum(CalendarInterval)
  interval: CalendarInterval;

  @IsInt()
  @Max(100)
  @Min(-100)
  score: number;

  @IsInt()
  @Min(0)
  max: number;

  @IsInt()
  @Lte('max')
  @IsOptional()
  @Min(0)
  min?: number;

  @IsInt()
  @Gte('min')
  @Lte('max')
  @Min(0)
  optimal?: number;

  @IsEnum([
    DataPointInputType.Checkbox,
    DataPointInputType.Spinner,
    DataPointInputType.Range,
    DataPointInputType.Timer,
  ])
  inputType: DataPointInputType;

  @IsEnum(UserAssignmentStrategy)
  userStrategy: UserAssignmentStrategy;

  @IsString()
  @IsEnum([DataPointValueType.Number, DataPointValueType.Timer])
  valueType: typeof DataPointValueType.Number | typeof DataPointValueType.Timer;

  @IsArray()
  @MaxLength(20, { each: true })
  @IsOptional()
  tagNames?: string[];

  constructor(data?: BaseModelData<CreateHabitModel>) {
    BaseModel.init(this, data);
  }

  getDefaults() {
    return {
      interval: CalendarInterval.Daily,
      tagNames: [],
      valueType: DataPointValueType.Number,
      inputType: DataPointInputType.Checkbox,
      userStrategy: UserAssignmentStrategy.Shared,
      optimal: 0,
      min: 0,
      max: 3,
      score: 2,
    };
  }
}
