import { Exclude, Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEnum,
  IsOptional,
  IsInt,
  Max,
  Min,
  IsArray,
  MaxLength,
} from 'class-validator';
import { CalendarIntervalEnum } from '@/calendar';
import { BaseModel } from '@/models';
import { UserAssignmentStrategy } from '@/collab';
import { DataPointInputType, INumberDataPointConfig } from '@/time-series';
import { CreateContentModel, IContentDataType } from '@/content';

@Exclude()
export class CreateTaskModel extends CreateContentModel<CreateTaskModel> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  title: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  text?: string;

  @Expose()
  @IsEnum(CalendarIntervalEnum)
  interval: CalendarIntervalEnum;

  @Expose()
  @IsEnum(UserAssignmentStrategy)
  userStrategy: UserAssignmentStrategy;

  @Expose()
  @IsInt()
  @Max(100)
  @Min(-100)
  score: number;

  @Expose()
  @IsArray()
  @MaxLength(20, { each: true })
  @IsOptional()
  tagNames?: string[];

  constructor(obj?: Partial<CreateTaskModel>, init = true) {
    obj = init
      ? Object.assign(
          {
            interval: CalendarIntervalEnum.Daily,
            score: 2,
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
