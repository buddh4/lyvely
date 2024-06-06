import { Exclude, Expose } from 'class-transformer';
import { IEditableModel, ContentModel, TimerModel } from '@lyvely/interface';
import { BaseModel, type BaseModelData, PropertyType } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { UpdateTaskModel } from './update-task.model';
import { type ITaskConfig } from '../interfaces';
import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';

@Exclude()
export class SingleUserTaskStateModel {
  @Expose()
  done?: string;

  @Expose()
  @PropertyType(TimerModel)
  timer: TimerModel;

  constructor(data: BaseModelData<SingleUserTaskStateModel>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class TaskModel<TID = string>
  extends ContentModel<TID, ITaskConfig, SingleUserTaskStateModel>
  implements IEditableModel<UpdateTaskModel>, ICalendarPlanEntry<TID>
{
  static contentType = 'Task';

  @Expose()
  override type = TaskModel.contentType;

  @Expose()
  override config: ITaskConfig;

  @Expose()
  @PropertyType(SingleUserTaskStateModel)
  override state: SingleUserTaskStateModel;

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
export class MultiUserTaskStateModel<TID> {
  @Expose()
  @PropertyType([UserDoneModel])
  doneBy?: UserDoneModel<TID>[];

  @Expose()
  @PropertyType([TaskModel])
  timers?: TimerModel<TID>[];

  constructor(data: BaseModelData<MultiUserTaskStateModel<any>>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class TaskWithUsersModel<TID = string> extends ContentModel<
  TID,
  ITaskConfig,
  MultiUserTaskStateModel<TID>
> {
  @Expose()
  override type = TaskModel.contentType;

  @Expose()
  @PropertyType(MultiUserTaskStateModel)
  override state: MultiUserTaskStateModel<TID>;
}

export function isTask(content: any): content is TaskModel {
  return content.type === TaskModel.contentType;
}
