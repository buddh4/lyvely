import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length, IsEnum, IsOptional } from 'class-validator';
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

  getDefaults() {
    return {
      interval: CalendarInterval.Unscheduled,
      tagNames: [],
    };
  }
}
