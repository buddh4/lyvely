import { Expose } from 'class-transformer';
import { CalendarInterval } from '@/calendar';
import { DataPointInputType, DataPointNumberInputType, DataPointValueType } from '@/time-series';
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
import { BaseModel } from '@/models';
import { Gte, Lte } from '@/validation';

@Expose()
export class CreateHabitModel extends BaseModel<CreateHabitModel> {
  @IsString()
  @IsNotEmpty()
  //@Length(0, 100)
  title: string;

  @IsString()
  @IsOptional()
  @Length(0, 2000)
  text?: string;

  @IsEnum(CalendarInterval)
  interval: CalendarInterval;

  @IsInt()
  @Max(100)
  @Min(-100)
  score: number;

  @IsInt()
  @Min(1)
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

  @IsEnum(DataPointNumberInputType)
  inputType: DataPointInputType;

  @IsEnum(UserAssignmentStrategy)
  userStrategy: UserAssignmentStrategy;

  @IsString()
  @IsEnum([DataPointValueType.Number, DataPointValueType.Timer])
  valueType: string;

  @IsArray()
  @MaxLength(20, { each: true })
  @IsOptional()
  tagNames?: string[];

  constructor(obj?: Partial<CreateHabitModel>, init = true) {
    obj = init
      ? Object.assign(
          {
            interval: CalendarInterval.Daily,
            score: 2,
            max: 3,
            min: 0,
            optimal: 0,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.Shared,
            tagNames: [],
          },
          obj || {},
        )
      : obj;
    super(obj);
  }
}
