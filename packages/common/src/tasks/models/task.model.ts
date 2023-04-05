import { Expose } from 'class-transformer';
import { IEditableModel, PropertyType } from '../../models';
import { CalendarIntervalEnum, TimerModel } from '@/calendar';
import { UpdateTaskModel } from './update-task.model';
import { DataPointInputType, DataPointValueType, TimeSeriesContentModel } from '@/time-series';
import { ITaskConfig } from '@/tasks/interfaces/task-config.interface';
import { IHabitConfig } from '@/habits';
import { UserAssignmentStrategy } from '@/collab';

@Expose()
export class TaskModel
  extends TimeSeriesContentModel<TaskModel, ITaskConfig>
  implements IEditableModel<UpdateTaskModel>
{
  static contentType = 'Task';
  type = TaskModel.contentType;

  done?: string;

  @PropertyType(TimerModel)
  timer: TimerModel;

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
export class TaskWithUsersModel extends TimeSeriesContentModel<TaskWithUsersModel, ITaskConfig> {
  doneBy?: UserDoneModel[];
  timers?: TimerModel[];
  type = TaskModel.contentType;
}

@Expose()
export class UserDoneModel {
  uid: any;
  tid: string;
  date: Date;
}

export function isTask(content: any): content is TaskModel {
  return content.type === TaskModel.contentType;
}
