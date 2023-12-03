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
import { CalendarInterval } from '@lyvely/dates';
import { UserAssignmentStrategy, CreateContentModel } from '@lyvely/interface';
import { Trim } from '@lyvely/common';

@Exclude()
export class CreateTaskModel extends CreateContentModel<CreateTaskModel> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Length(0, 100)
  title: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Trim()
  @Length(0, 2000)
  text?: string;

  @Expose()
  @IsEnum(CalendarInterval)
  interval: CalendarInterval;

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
            interval: CalendarInterval.Daily,
            score: 2,
            userStrategy: UserAssignmentStrategy.Shared,
            tagNames: [],
          },
          obj || {},
        )
      : obj;
    super(obj);
  }
}
