import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Profile,
  User,
  assureObjectId,
  EntityIdentity,
  NestedSchema,
  ObjectIdProp,
  ContentDataType,
  ContentType,
  TObjectId,
} from '@lyvely/core';
import {
  UserAssignmentStrategy,
  PropertiesOf,
  PropertyType,
  getNumberEnumValues,
  BaseModel,
} from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { Timer, TimerModel, TimerSchema } from '@lyvely/timers';
import {
  TaskModel,
  CreateTaskModel,
  TaskWithUsersModel,
  ITaskConfig,
  UserDoneModel,
} from '@lyvely/tasks-interface';

@Schema({ _id: false })
export class UserDone implements UserDoneModel<TObjectId> {
  @ObjectIdProp({ required: true })
  uid: TObjectId;

  @Prop({ type: String, required: true })
  tid: string;

  @Prop({ type: Date, required: true })
  date: Date;

  constructor(uid: EntityIdentity<User>, tid: string, date?: Date) {
    this.uid = assureObjectId(uid);
    this.tid = tid;
    this.date = date || new Date();
  }
}

const UserDoneSchema = SchemaFactory.createForClass(UserDone);

@NestedSchema()
export class TaskConfig extends BaseModel<TaskConfig> implements ITaskConfig {
  @Prop({ type: Number })
  @PropertyType(Number, { default: 0 })
  score: number;

  @Prop({ enum: getNumberEnumValues(CalendarInterval), required: true })
  interval: CalendarInterval;

  @Prop({
    enum: getNumberEnumValues(UserAssignmentStrategy),
    default: UserAssignmentStrategy.Shared,
    required: true,
  })
  userStrategy: UserAssignmentStrategy;
}

const TaskConfigSchema = SchemaFactory.createForClass(TaskConfig);

@Schema()
export class Task
  extends ContentType<Task, TaskConfig>
  implements PropertiesOf<TaskWithUsersModel<TObjectId>>
{
  @Prop({ type: TaskConfigSchema, required: true })
  @PropertyType(TaskConfig)
  config: TaskConfig;

  @Prop({ type: [UserDoneSchema] })
  @PropertyType([UserDone])
  doneBy: UserDone[];

  @Prop({ type: [TimerSchema] })
  @PropertyType([Timer])
  timers: Timer[];

  get interval() {
    return this.config.interval;
  }

  set interval(interval: CalendarInterval) {
    this.config.interval = interval;
  }

  toModel(user?: User): TaskModel<any> {
    const model = new TaskModel<TObjectId>(this);
    if (user) {
      model.done = this.getDoneBy(user)?.tid;
      model.timer = this.getTimer(user) as TimerModel;
    }
    return model;
  }

  isDoneByUser(uid: EntityIdentity<User>) {
    return !!this.doneBy?.find((d) => d.uid.equals(assureObjectId(uid)));
  }

  isDone(uid: EntityIdentity<User>) {
    if (this.config.userStrategy === UserAssignmentStrategy.Shared) {
      return !!this.doneBy.length;
    }

    return this.isDoneByUser(uid);
  }

  getTimer(uid: EntityIdentity<User>): Timer | undefined {
    if (this.config.userStrategy === UserAssignmentStrategy.Shared) {
      return this.timers.length ? this.timers[0] : undefined;
    }

    return this.timers?.find((t) => t.uid?.equals(assureObjectId(uid))) || undefined;
  }

  getDoneBy(uid: EntityIdentity<User>): UserDone | undefined {
    if (this.config.userStrategy === UserAssignmentStrategy.Shared) {
      return this.doneBy?.[0] || undefined;
    }

    return this.doneBy?.find((d) => d.uid.equals(assureObjectId(uid))) || undefined;
  }

  setUndoneBy(uid: EntityIdentity<User>) {
    if (this.config.userStrategy === UserAssignmentStrategy.Shared) {
      this.doneBy = [];
    } else {
      this.doneBy = this.doneBy.filter((d) => !d.uid.equals(assureObjectId(uid)));
    }
  }

  setDoneBy(uid: EntityIdentity<User>, tid: string, date?: Date) {
    date = date || new Date();

    if (this.config.userStrategy === UserAssignmentStrategy.Shared) {
      this.doneBy = [new UserDone(uid, tid, date)];
    } else {
      const doneBy = this.doneBy?.find((d) => d.uid.equals(assureObjectId(uid)));
      if (doneBy) {
        doneBy.tid = tid;
        doneBy.date = date;
      } else {
        this.doneBy.push(new UserDone(uid, tid, date));
      }
    }
  }

  public static create(
    profile: Profile,
    owner: User,
    createModel: PropertiesOf<CreateTaskModel>,
  ): Task {
    const { title, text, score, interval, userStrategy } = createModel;
    return new Task(profile, owner, {
      content: new ContentDataType({ title, text }),
      config: new TaskConfig({ score, interval, userStrategy }),
    });
  }
}

export const TaskSchema = SchemaFactory.createForClass(Task);
