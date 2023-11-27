import { Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { CalendarInterval } from '@lyvely/dates';
import { UserAssignmentStrategy, CreateContentModel } from '@lyvely/interface';
import { Gte, Lte } from '@lyvely/common';
import { DataPointInputType, DataPointValueType } from '@lyvely/time-series-interface';

@Expose()
export class CreateJournalModel extends CreateContentModel<CreateJournalModel> {
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  text?: string;

  @IsEnum(CalendarInterval)
  interval: CalendarInterval;

  @IsEnum(UserAssignmentStrategy)
  userStrategy: UserAssignmentStrategy;

  @IsString()
  @IsEnum([
    DataPointValueType.Number,
    DataPointValueType.Text,
    DataPointValueType.Timer,
    DataPointValueType.Selection,
  ])
  valueType:
    | typeof DataPointValueType.Number
    | typeof DataPointValueType.Timer
    | typeof DataPointValueType.Text
    | typeof DataPointValueType.Selection;

  @Expose()
  @IsEnum(DataPointInputType)
  inputType: DataPointInputType;

  @IsInt()
  @Min(1)
  @ValidateIf((o) => o.type === DataPointValueType.Number)
  max?: number;

  @IsInt()
  @Lte('max')
  @IsOptional()
  @Min(0)
  @ValidateIf((o) => o.type === DataPointValueType.Number)
  min?: number;

  @IsDefined()
  @MaxLength(250, {
    each: true,
  })
  @IsString({ each: true })
  @ValidateIf((o) => o.type === DataPointValueType.Selection)
  options?: Array<string>;

  @IsBoolean()
  @IsOptional()
  @ValidateIf((o) => o.type === DataPointValueType.Selection)
  allowOther?: boolean;

  @IsInt()
  @Gte('min')
  @Lte('max')
  @Min(0)
  @ValidateIf((o) => o.type === DataPointValueType.Number)
  optimal?: number;

  @IsBoolean()
  @IsOptional()
  @ValidateIf((o) => o.type === DataPointValueType.Text)
  required?: boolean;

  @IsArray()
  @MaxLength(20, { each: true })
  @IsOptional()
  tagNames?: string[];

  getDefaults() {
    return {
      interval: CalendarInterval.Daily,
      inputType: DataPointInputType.Range,
      valueType: DataPointValueType.Number,
      userStrategy: UserAssignmentStrategy.Shared,
      max: 10,
      min: 5,
      optimal: 6,
      tagNames: [],
    };
  }
}
