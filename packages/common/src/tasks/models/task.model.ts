import { Exclude, Expose } from 'class-transformer';
import { IEditableModel, PropertyType, TransformTo } from '@/models';
import { CalendarInterval, TimerModel } from '@/calendar';
import { UpdateTaskModel } from './update-task.model';
import { ITaskConfig } from '@/tasks/interfaces/task-config.interface';
import { ContentModel } from '@/content';
import { ICalendarPlanEntry } from '@/calendar-plan';

@Exclude()
export class TaskModel
  extends ContentModel<TaskModel, ITaskConfig>
  implements IEditableModel<UpdateTaskModel>, ICalendarPlanEntry
{
  static contentType = 'Task';

  @Expose()
  type = TaskModel.contentType;

  @Expose()
  done?: string;

  @Expose()
  @TransformTo(TimerModel)
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
export class UserDoneModel {
  uid: any;
  tid: string;
  date: Date;
}

@Exclude()
export class TaskWithUsersModel extends ContentModel<TaskWithUsersModel, ITaskConfig> {
  @Expose()
  @TransformTo(UserDoneModel)
  @PropertyType([UserDoneModel])
  doneBy?: UserDoneModel[];

  @Expose()
  @TransformTo(TaskModel)
  @PropertyType([TaskModel])
  timers?: TimerModel[];

  @Expose()
  type = TaskModel.contentType;
}

export function isTask(content: any): content is TaskModel {
  return content.type === TaskModel.contentType;
}
