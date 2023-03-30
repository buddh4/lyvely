import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '@/profiles';
import {
  REGEX_TID,
  UserAssignmentStrategy,
  CreateTaskModel,
  UpdateTaskModel,
  PropertiesOf,
  TaskWithUsersModel,
  DataPointInputType,
  DataPointValueType,
  PropertyType,
  TaskModel,
} from '@lyvely/common';
import mongoose from 'mongoose';
import { User } from '@/users';
import { Activity, ActivityConfig } from './activity.schema';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  NumberTimeSeriesContentConfig,
  TimeSeriesConfigSchemaFactory,
} from '@/time-series';
import { assureObjectId, EntityIdentity } from '@/core';
import { ContentDataType } from '@/content';
import { Timer, TimerSchema } from '@/calendar';

export type TaskDocument = Task & mongoose.Document;

@Schema({ _id: false })
export class UserDone {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  uid: TObjectId;

  @Prop({ type: String, required: true, match: REGEX_TID })
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

@Schema({ _id: false })
export class TaskConfig extends NumberTimeSeriesContentConfig<
  TaskConfig,
  CheckboxNumberDataPointConfig
> {
  @Prop({ type: Number })
  @PropertyType(Number, { default: 0 })
  score: number;
}

export const TaskConfigSchema = TimeSeriesConfigSchemaFactory.createForClass(TaskConfig, [
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
]);

@Schema()
export class Task extends Activity implements PropertiesOf<TaskWithUsersModel> {
  @Prop({ type: TaskConfigSchema, required: true })
  @PropertyType(TaskConfig)
  config: TaskConfig;

  @Prop({ type: [UserDoneSchema] })
  @PropertyType([UserDone])
  doneBy: UserDone[];

  @Prop({ type: [TimerSchema] })
  @PropertyType([Timer])
  timers: Timer[];

  afterInit() {
    if (!this.timeSeriesConfig) {
      this.timeSeriesConfig = DataPointConfigFactory.createConfig(
        DataPointValueType.Number,
        DataPointInputType.Checkbox,
      );
    }

    this.timeSeriesConfig.min = 1;
    this.timeSeriesConfig.max = 1;
    this.timeSeriesConfig.optimal = 1;

    super.afterInit();
  }

  applyUpdate(update: UpdateTaskModel) {
    // We only need to update the interval, all other time series config values are static
    this.timeSeriesConfig.interval = update.interval ?? this.timeSeriesConfig.interval;
    this.applyContentUpdate({
      title: update.title ?? this.content.title,
      text: update.title ?? this.content.text,
    });

    return this;
  }

  toModel(user?: User): TaskModel {
    const model = new TaskModel(this);
    if (user) {
      model.done = this.getDoneBy(user)?.tid;
      model.timer = this.getTimer(user);
    }
    return model;
  }

  isDoneByUser(uid: EntityIdentity<User>) {
    return !!this.doneBy?.find((d) => d.uid.equals(assureObjectId(uid)));
  }

  isDone(uid: EntityIdentity<User>) {
    if (this.timeSeriesConfig.userStrategy === UserAssignmentStrategy.Shared) {
      return !!this.doneBy.length;
    }

    return this.isDoneByUser(uid);
  }

  getTimer(uid: EntityIdentity<User>) {
    if (this.timeSeriesConfig.userStrategy === UserAssignmentStrategy.Shared) {
      return this.timers.length ? this.timers[0] : undefined;
    }

    return this.timers?.find((t) => t.uid?.equals(assureObjectId(uid)));
  }

  getDoneBy(uid: EntityIdentity<User>) {
    if (this.timeSeriesConfig.userStrategy === UserAssignmentStrategy.Shared) {
      return this.doneBy[0];
    }

    return this.doneBy?.find((d) => d.uid.equals(assureObjectId(uid)));
  }

  setUndoneBy(uid: EntityIdentity<User>) {
    if (this.timeSeriesConfig.userStrategy === UserAssignmentStrategy.Shared) {
      this.doneBy = [];
    } else {
      this.doneBy = this.doneBy.filter((d) => !d.uid.equals(assureObjectId(uid)));
    }
  }

  setDoneBy(uid: EntityIdentity<User>, tid: string, date?: Date) {
    date = date || new Date();

    if (this.timeSeriesConfig.userStrategy === UserAssignmentStrategy.Shared) {
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

  public static create(profile: Profile, owner: User, update: PropertiesOf<CreateTaskModel>): Task {
    return new Task(profile, owner, {
      content: new ContentDataType({ title: update.title, text: update.text }),
      tagIds: profile.getTagsByName(update.tagNames).map((tag) => assureObjectId(tag.id)),
      config: new ActivityConfig({
        score: update.score,
        timeSeries: _createDataPointConfigFromUpdate(update),
      }),
    });
  }
}

function _createDataPointConfigFromUpdate(update: UpdateTaskModel) {
  return DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(
    DataPointValueType.Number,
    DataPointInputType.Checkbox,
    {
      min: 0,
      max: 1,
      interval: update.interval,
      userStrategy: update.userStrategy,
      optimal: 0,
    },
  );
}

export const TaskSchema = SchemaFactory.createForClass(Task);
