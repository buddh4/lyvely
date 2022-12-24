import { Expose } from 'class-transformer';
import { ActivityType, ActivityModel } from '../../models';
import { TimerModel } from '@/calendar';
import { PropertyType } from '@/models';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';

@Expose()
export class TaskModel extends ActivityModel<TaskModel> {
  done?: string;

  @PropertyType(TimerModel)
  timer: TimerModel;

  type: string = ActivityType.Task;

  static getCreateDto() {
    return new CreateTaskDto();
  }

  getEditDto() {
    return new UpdateTaskDto({
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

  type: string = ActivityType.Task;
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
