import { Expose } from 'class-transformer';
import { ActivityType, ActivityModel } from '../../models';
import { ContentModel } from '@/content';
import { TimerModel } from '@/calendar';
import { PropertyType } from '@/models';

@Expose()
export class TaskModel extends ActivityModel<TaskModel> {
  done?: string;

  @PropertyType(TimerModel)
  timer: TimerModel;

  type: string = ActivityType.Task;
}

@Expose()
export class TaskWithUsersModel extends ActivityModel<TaskModel> {
  doneBy?: UserDoneModel[];

  timers?: TimerModel[];

  type: string = ActivityType.Task;
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
