import { Exclude, Expose } from 'class-transformer';
import { IEditableModel, ContentModel } from '@lyvely/interface';
import { PropertyType } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { TimerModel } from '@lyvely/timers-interface';
import { UpdateTaskModel } from './update-task.model';
import { ITaskConfig } from '../interfaces';
import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';

@Exclude()
export class TaskModel<TID = string>
  extends ContentModel<TID, TaskModel<TID>, ITaskConfig>
  implements IEditableModel<UpdateTaskModel>, ICalendarPlanEntry<TID>
{
  static contentType = 'Task';

  @Expose()
  type = TaskModel.contentType;

  @Expose()
  done?: string;

  @Expose()
  @PropertyType(TimerModel)
  timer: TimerModel;

  get interval(): CalendarInterval {
    return this.config.interval;
  }

  set interval(interval: CalendarInterval) {
    this.config.interval = interval;
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
export class UserDoneModel<TID = string> {
  uid: TID;
  tid: string;
  date: Date;
}

@Exclude()
export class TaskWithUsersModel<TID = string> extends ContentModel<
  TID,
  TaskWithUsersModel<TID>,
  ITaskConfig
> {
  @Expose()
  @PropertyType([UserDoneModel])
  doneBy?: UserDoneModel<TID>[];

  @Expose()
  @PropertyType([TaskModel])
  timers?: TimerModel<TID>[];

  @Expose()
  type = TaskModel.contentType;
}

export function isTask(content: any): content is TaskModel {
  return content.type === TaskModel.contentType;
}
