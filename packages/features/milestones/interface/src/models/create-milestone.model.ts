import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length, IsEnum, IsOptional } from 'class-validator';
import { CalendarInterval } from '@lyvely/dates';
import { CreateContentModel } from '@lyvely/interface';
import { Trim } from '@lyvely/common';

@Exclude()
export class CreateMilestoneModel extends CreateContentModel<CreateMilestoneModel> {
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

  getDefaults() {
    return {
      interval: CalendarInterval.Unscheduled,
      tagNames: [],
    };
  }
}
