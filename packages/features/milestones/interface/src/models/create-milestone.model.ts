import { Exclude, Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEnum,
  IsOptional,
  IsArray,
  MaxLength,
} from 'class-validator';
import { CalendarInterval } from '@lyvely/dates';
import { CreateContentModel } from '@lyvely/core-interface';

@Exclude()
export class CreateMilestoneModel extends CreateContentModel<CreateMilestoneModel> {
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
  @IsEnum(CalendarInterval)
  interval: CalendarInterval;

  @Expose()
  @IsArray()
  @MaxLength(20, { each: true })
  @IsOptional()
  tagNames?: string[];

  getDefaults() {
    return {
      interval: CalendarInterval.Unscheduled,
      tagNames: [],
    };
  }
}
