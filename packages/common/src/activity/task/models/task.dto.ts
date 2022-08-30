import { Exclude, Expose } from 'class-transformer';
import { ActivityType, AbstractActivityDto } from '../../interfaces';
import { ITask } from '../interfaces';
import { IsEnum } from 'class-validator';

@Exclude()
export class TaskDto extends AbstractActivityDto<ITask> implements ITask {
  @Expose()
  done?: string;

  @Expose()
  @IsEnum(ActivityType)
  type: string = ActivityType.Task;
}


