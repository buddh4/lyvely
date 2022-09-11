import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { CalendarIntervalEnum } from "../../../calendar";
import { BaseModel } from "../../../model";
import { isActivity } from "../../models";
import { ActivityModel } from "../../models";

@Exclude()
export class UpdateTaskDto extends BaseModel<UpdateTaskDto> {

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  title?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  text?: string;

  @Expose()
  @IsOptional()
  @IsEnum(CalendarIntervalEnum)
  interval?: CalendarIntervalEnum;

  @Expose()
  @IsInt()
  @Max(100)
  @Min(-100)
  @IsOptional()
  score?: number;

  @Expose()
  @IsArray()
  @MaxLength(20, { each: true })
  @IsOptional()
  tagNames?: string[];

  constructor(model?: ActivityModel | Partial<UpdateTaskDto>) {
    super(model);

    if (isActivity(model)) {
      this.interval = model.dataPointConfig.interval;
    }
  }
}
