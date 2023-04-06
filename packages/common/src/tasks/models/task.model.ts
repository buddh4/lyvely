import { Expose } from 'class-transformer';
import { IEditableModel, PropertyType } from '@/models';
import { CalendarInterval, TimerModel } from '@/calendar';
import { UpdateTaskModel } from './update-task.model';
import { ITaskConfig } from '@/tasks/interfaces/task-config.interface';
import { ContentModel } from '@/content';
import { ICalendarPlanEntry } from '@/calendar-plan';

@Expose()
export class TaskModel
  extends ContentModel<TaskModel, ITaskConfig>
  implements IEditableModel<UpdateTaskModel>, ICalendarPlanEntry
{
  static contentType = 'Task';
  type = TaskModel.contentType;

  done?: string;

  @PropertyType(TimerModel)
  timer: TimerModel;

  get interval(): CalendarInterval {
    return this.config.interval;
  }

  toEditModel() {
    return new UpdateTaskModel({
      title: this.content.title,
      text: this.content.text,
      interval: this.config.interval,
      userStrategy: this.config.userStrategy,
      score: this.config.score,
    });
  }
}

@Expose()
export class TaskWithUsersModel extends ContentModel<TaskWithUsersModel, ITaskConfig> {
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
