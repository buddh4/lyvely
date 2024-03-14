import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { CalendarInterval } from '@lyvely/dates';
import { CreateContentModel, UserAssignmentStrategy } from '@lyvely/interface';
import { BaseModel, Trim } from '@lyvely/common';
import type { StrictBaseModelData } from '@lyvely/common';

@Exclude()
export class CreateTaskModel extends CreateContentModel {
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
  interval: CalendarInterval = CalendarInterval.Daily;

  @Expose()
  @IsEnum(UserAssignmentStrategy)
  userStrategy: UserAssignmentStrategy = UserAssignmentStrategy.Shared;

  @Expose()
  @IsInt()
  @Max(100)
  @Min(-100)
  score = 2;

  constructor(data: StrictBaseModelData<CreateTaskModel>) {
    super(false);
    BaseModel.init(this, data);
  }
}
