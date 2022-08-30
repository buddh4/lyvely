import { Exclude, Expose } from 'class-transformer';
import { UpdateTaskDto } from "./update-task.dto";
import { IsNotEmpty, IsString, Length, IsEnum } from 'class-validator';
import { CalendarIntervalEnum } from "../../../calendar";

@Exclude()
export class CreateTaskDto extends UpdateTaskDto {

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  title?: string;

  @Expose()
  @IsEnum(CalendarIntervalEnum)
  interval?: CalendarIntervalEnum;

  constructor(obj?: Partial<CreateTaskDto>) {
    super(obj);

    this.interval = this.interval ?? CalendarIntervalEnum.Daily;
    this.score = this.score ?? 2;
    this.tagNames = this.tagNames || [];
  }

}
