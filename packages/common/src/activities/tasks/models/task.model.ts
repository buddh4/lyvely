import { Expose } from 'class-transformer';
import { ActivityType, ActivityModel } from '../../models';
import { TimerModel } from '@/calendar';
import { IEditableModel, PropertyType } from '@/models';
import { UpdateTaskModel } from './update-task.model';

@Expose()
export class TaskModel extends ActivityModel<TaskModel> implements IEditableModel<UpdateTaskModel> {
  done?: string;

  @PropertyType(TimerModel)
  timer: TimerModel;

  type = ActivityType.Task;

  toEditModel() {
    return new UpdateTaskModel({
      title: this.content.title,
      text: this.content.text,
      interval: this.timeSeriesConfig.interval,
      userStrategy: this.timeSeriesConfig.userStrategy,
      score: this.config.score,
    });
  }
}

@Expose()
export class TaskWithUsersModel extends ActivityModel<TaskModel> {
  doneBy?: UserDoneModel[];

  timers?: TimerModel[];

  type = ActivityType.Task;
}

@Expose()
export class UserDoneModel {
  uid: any;
  tid: string;
  date: Date;
}

export function isTask(content: any): content is TaskModel {
  return content.type === ActivityType.Task;
}
