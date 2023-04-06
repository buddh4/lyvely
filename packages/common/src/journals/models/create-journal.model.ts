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
import { CalendarInterval } from '@/calendar';
import { UserAssignmentStrategy } from '@/collab';
import { DataPointInputType, DataPointValueType } from '@/time-series';
import { CreateContentModel } from '@/content';
import { Gte, Lte } from '@/validation';

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
  @IsEnum([DataPointValueType.Number, DataPointValueType.Timer, DataPointValueType.Selection])
  valueType: DataPointValueType;

  @Expose()
  @IsEnum(DataPointInputType)
  @ValidateIf((o) => o.type === DataPointValueType.Number)
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

  constructor(obj?: Partial<CreateJournalModel>, init = true) {
    obj = init
      ? Object.assign(
          {
            interval: CalendarInterval.Daily,
            inputType: DataPointInputType.Checkbox,
            valueType: DataPointValueType.Number,
            userStrategy: UserAssignmentStrategy.Shared,
            tagNames: [],
          },
          obj || {},
        )
      : obj;
    super(obj);
  }
}
