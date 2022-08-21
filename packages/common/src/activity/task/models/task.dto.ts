import { Exclude, Expose } from 'class-transformer';
import { ActivityType, IActivity, AbstractActivityDto, AbstractEditActivityDto } from '../../interfaces';
import { ITask } from '../interfaces/task.interface';
import { Equals, IsEnum, IsOptional, Matches } from 'class-validator';
import { REGEX_DATE_FORMAT } from '../../../calendar';

@Exclude()
export class TaskDto extends AbstractActivityDto<ITask> implements ITask {
  @Expose()
  done?: string;

  @Expose()
  @IsEnum(ActivityType)
  type: string = ActivityType.Task;
}

@Expose()
export class DoneTaskResultModel {
  score: number;
  done: string;

  constructor(obj: Partial<DoneTaskResultModel>) {
    Object.assign(this, obj);
  }
}

@Exclude()
export class UpdateTaskStateModel {
  @Expose()
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  constructor(obj: Partial<UpdateTaskStateModel>) {
    Object.assign(this, obj);
  }
}

@Exclude()
export class EditTaskDto extends AbstractEditActivityDto {
  @IsOptional()
  @Equals(1)
  max? = 1;

  @IsOptional()
  @Equals(0)
  min? = 0;

  constructor(model?: IActivity | Partial<EditTaskDto>) {
    super(model);
    this.max = this.optimal = 1;
    this.min = 0;
  }
}
