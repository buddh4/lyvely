import { Exclude, Expose } from 'class-transformer';
import { CalendarIntervalEnum } from '@/calendar';
import { DataPointInputType, DataPointNumberInputType, INumberDataPointConfig } from '@/time-series';
import { UserAssignmentStrategy } from '@/collab';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';
import { BaseModel } from '@/models';
import { Gte, Lte } from '@/validation';
import { IContentDataType } from '@/content';

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
  @Min(0)
  optimal?: number;

  @Expose()
  @IsEnum(DataPointNumberInputType)
  inputType: DataPointInputType;

  @Expose()
  @IsEnum(UserAssignmentStrategy)
  userStrategy: UserAssignmentStrategy;

  @Expose()
  @IsArray()
  @MaxLength(20, { each: true })
  @IsOptional()
  tagNames?: string[];

  constructor(obj?: Partial<CreateHabitDto>, init = true) {
    obj = init
      ? Object.assign(
          {
            interval: CalendarIntervalEnum.Daily,
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
