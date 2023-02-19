import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  MaxLength,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { CalendarIntervalEnum } from '@/calendar';
import { UserAssignmentStrategy } from '@/collab';
import { DataPointInputType, DataPointNumberInputType, DataPointValueType } from '@/time-series';
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

  @IsEnum(CalendarIntervalEnum)
  interval: CalendarIntervalEnum;

  @IsEnum(UserAssignmentStrategy)
  userStrategy: UserAssignmentStrategy;

  @IsString()
  @IsEnum(DataPointValueType)
  type: DataPointValueType;

  @Expose()
  @IsEnum(DataPointInputType)
  inputType: DataPointInputType;

  @IsInt()
  @Min(1)
  @ValidateIf((o) => o.type === DataPointValueType.Number)
  max: number;

  @IsInt()
  @Lte('max')
  @IsOptional()
  @Min(0)
  @ValidateIf((o) => o.type === DataPointValueType.Number)
  min?: number;

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
            interval: CalendarIntervalEnum.Daily,
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
