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
import { CalendarInterval } from '@/calendar';
import { CreateContentModel } from '@/content';
import { PropertyType } from '@/models';

@Exclude()
export class CreateMilestoneModel extends CreateContentModel<CreateMilestoneModel> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  @PropertyType(String)
  title: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  @PropertyType(String, { optional: true })
  text?: string;

  @Expose()
  @IsEnum(CalendarInterval)
  @PropertyType(Number, { default: CalendarInterval.Unscheduled })
  interval: CalendarInterval;

  @Expose()
  @IsArray()
  @MaxLength(20, { each: true })
  @IsOptional()
  @PropertyType([String])
  tagNames?: string[];
}
