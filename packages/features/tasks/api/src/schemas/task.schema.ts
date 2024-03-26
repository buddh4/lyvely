import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Profile,
  User,
  UserAssignmentStrategy,
  assureObjectId,
  DocumentIdentity,
  NestedSchema,
  ObjectIdProp,
  ContentDataType,
  ContentType,
  TObjectId,
} from '@lyvely/api';
import {
  PropertiesOf,
  PropertyType,
  getNumberEnumValues,
  BaseModel,
  PartialPropertiesOf,
} from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { Timer, TimerModel, TimerSchema } from '@lyvely/timers';
import {
  TaskModel,
  CreateTaskModel,
  TaskWithUsersModel,
  ITaskConfig,
  UserDoneModel,
  MultiUserTaskStateModel,
  SingleUserTaskStateModel,
} from '@lyvely/tasks-interface';

@Schema({ _id: false })
export class UserDone implements UserDoneModel<TObjectId> {
  @ObjectIdProp({ required: true })
  uid: TObjectId;

  @Prop({ type: String, required: true })
  tid: string;

  @Prop({ type: Date, required: true })
  date: Date;

  constructor(uid: DocumentIdentity<User>, tid: string, date?: Date) {
    this.uid = assureObjectId(uid);
    this.tid = tid;
    this.date = date || new Date();
  }
}

const UserDoneSchema = SchemaFactory.createForClass(UserDone);

@NestedSchema()
export class TaskConfig implements ITaskConfig {
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

  constructor(data: PropertiesOf<TaskConfig>) {
    BaseModel.init(this, data);
  }
}

const TaskConfigSchema = SchemaFactory.createForClass(TaskConfig);

@NestedSchema()
export class TaskState implements PropertiesOf<MultiUserTaskStateModel<any>> {
  @Prop({ type: [UserDoneSchema] })
  @PropertyType([UserDone])
  doneBy: UserDone[];

  @Prop({ type: [TimerSchema] })
  @PropertyType([Timer])
  timers: Timer[];

  constructor(data: PartialPropertiesOf<TaskState>) {
    BaseModel.init(this, data);
  }
}

const TaskStateSchema = SchemaFactory.createForClass(TaskState);

@Schema()
export class Task
  extends ContentType<TaskConfig, TaskState>
  implements PropertiesOf<TaskWithUsersModel<TObjectId>>
{
  @Prop({ type: TaskConfigSchema, required: true })
  @PropertyType(TaskConfig)
  override config: TaskConfig;

  @Prop({ type: TaskStateSchema, required: true })
  @PropertyType(TaskState)
  override state: TaskState;

  get interval() {
    return this.config.interval;
  }

  set interval(interval: CalendarInterval) {
    this.config.interval = interval;
  }

  toModel(user?: User): TaskModel<any> {
    const model = new TaskModel<TObjectId>({ ...this, state: new SingleUserTaskStateModel(false) });
    if (user) {
      model.state.done = this.getDoneBy(user)?.tid;
      model.state.timer = this.getTimer(user) as TimerModel;
    }
    return model;
  }

  isDoneByUser(uid: DocumentIdentity<User>) {
    return !!this.state.doneBy?.find((d) => d.uid.equals(assureObjectId(uid)));
  }

  isDone(uid: DocumentIdentity<User>) {
    if (this.config.userStrategy === UserAssignmentStrategy.Shared) {
      return !!this.state.doneBy.length;
    }

    return this.isDoneByUser(uid);
  }

  getTimer(uid: DocumentIdentity<User>): Timer | undefined {
    if (this.config.userStrategy === UserAssignmentStrategy.Shared) {
      return this.state.timers.length ? this.state.timers[0] : undefined;
    }

    return this.state.timers?.find((t) => t.uid?.equals(assureObjectId(uid))) || undefined;
  }

  getDoneBy(uid: DocumentIdentity<User>): UserDone | undefined {
    if (this.config.userStrategy === UserAssignmentStrategy.Shared) {
      return this.state.doneBy?.[0] || undefined;
    }

    return this.state.doneBy?.find((d) => d.uid.equals(assureObjectId(uid))) || undefined;
  }

  setUndoneBy(uid: DocumentIdentity<User>) {
    if (this.config.userStrategy === UserAssignmentStrategy.Shared) {
      this.state.doneBy = [];
    } else {
      this.state.doneBy = this.state.doneBy.filter((d) => !d.uid.equals(assureObjectId(uid)));
    }
  }

  setDoneBy(uid: DocumentIdentity<User>, tid: string, date?: Date) {
    date = date || new Date();

    if (this.config.userStrategy === UserAssignmentStrategy.Shared) {
      this.state.doneBy = [new UserDone(uid, tid, date)];
    } else {
      const doneBy = this.state.doneBy?.find((d) => d.uid.equals(assureObjectId(uid)));
      if (doneBy) {
        doneBy.tid = tid;
        doneBy.date = date;
      } else {
        this.state.doneBy.push(new UserDone(uid, tid, date));
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
