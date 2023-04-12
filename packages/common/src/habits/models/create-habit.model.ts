import { Expose } from 'class-transformer';
import { CalendarInterval } from '@/calendar';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointSettings,
  ITimerDataPointSettings,
} from '@/time-series';
import { UserAssignmentStrategy } from '@/collab';
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
import { BaseModel, PropertyType } from '@/models';
import { Gte, Lte } from '@/validation';

@Expose()
export class CreateHabitModel
  extends BaseModel<CreateHabitModel>
  implements INumberDataPointSettings, ITimerDataPointSettings
{
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  @PropertyType(String)
  title: string;

  @IsString()
  @IsOptional()
  @Length(0, 2500)
  @PropertyType(String, { optional: true })
  text?: string;

  @IsEnum(CalendarInterval)
  @PropertyType(Number, { default: CalendarInterval.Daily })
  interval: CalendarInterval;

  @IsInt()
  @Max(100)
  @Min(-100)
  @PropertyType(Number, { default: 2 })
  score: number;

  @IsInt()
  @Min(0)
  @PropertyType(Number, { default: 3 })
  max: number;

  @IsInt()
  @Lte('max')
  @IsOptional()
  @Min(0)
  @PropertyType(Number, { default: 0 })
  min?: number;

  @IsInt()
  @Gte('min')
  @Lte('max')
  @Min(0)
  @PropertyType(Number, { default: 0 })
  optimal?: number;

  @IsEnum([
    DataPointInputType.Checkbox,
    DataPointInputType.Spinner,
    DataPointInputType.Range,
    DataPointInputType.Timer,
  ])
  @PropertyType(String, { default: DataPointInputType.Checkbox })
  inputType: DataPointInputType;

  @IsEnum(UserAssignmentStrategy)
  @PropertyType(Number, { default: UserAssignmentStrategy.Shared })
  userStrategy: UserAssignmentStrategy;

  @IsString()
  @IsEnum([DataPointValueType.Number, DataPointValueType.Timer])
  @PropertyType(String, { default: DataPointValueType.Number })
  valueType: string;

  @IsArray()
  @MaxLength(20, { each: true })
  @IsOptional()
  @PropertyType([String])
  tagNames?: string[];
}
