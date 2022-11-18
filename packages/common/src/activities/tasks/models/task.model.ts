import { Expose } from 'class-transformer';
import { ActivityType, ActivityModel } from '../../models';
import { IsEnum } from 'class-validator';
import { ContentModel } from '@/content';

@Expose()
export class TaskModel extends ActivityModel<TaskModel> {
  done?: string;

  @IsEnum(ActivityType)
  type: string = ActivityType.Task;
}

@Expose()
export class TaskWithUsersModel extends TaskModel {
  doneBy?: UserDoneModel[];
}

@Expose()
export class UserDoneModel {
  uid: any;
  tid: string;
  date: Date;
}

export function isTask(content: ContentModel): content is TaskModel {
  return content.type === ActivityType.Task;
}
