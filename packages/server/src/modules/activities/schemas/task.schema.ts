import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '../../profiles';
import { DataPointNumberInputStrategy, REGEX_TID, UserAssignmentStrategy } from '@lyvely/common';
import mongoose from 'mongoose';
import { User } from '../../users';
import { Activity } from './activity.schema';
import { CheckboxNumberDataPointConfig, DataPointConfigFactory } from '../../../interfaces/time-series';
import { assureObjectId, EntityIdentity } from "../../../core/db/db.utils";
import { applyValidationProperties, CreateTaskDto, UpdateTaskDto } from "@lyvely/common";
import { cloneDeep } from "lodash";
import { PropertiesOf, TaskWithUsersModel } from "@lyvely/common";

export type TaskDocument = Task & mongoose.Document;

@Schema({ _id: false })
export class UserDone {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  uid: TObjectId;

  @Prop( { type: String, required: true, match: REGEX_TID })
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

@Schema()
export class Task extends Activity implements PropertiesOf<TaskWithUsersModel> {

  @Prop({ type: [UserDoneSchema] })
  doneBy?: UserDone[];

  afterInit() {
    if(!this.dataPointConfig) {
      this.dataPointConfig = DataPointConfigFactory.createConfig(DataPointNumberInputStrategy.CheckboxNumber, {});
    }

    this.dataPointConfig.min = 1;
    this.dataPointConfig.max = 1;
    this.dataPointConfig.optimal = 1;

    if(!this.doneBy) {
      this.doneBy = [];
    }

    super.afterInit();
  }

  isDoneByUser(uid: EntityIdentity<User>) {
    return !!this.doneBy?.find(d => d.uid.equals(assureObjectId(uid)));
  }

  isDone(uid: EntityIdentity<User>) {
    if(this.userStrategy === UserAssignmentStrategy.Shared) {
      return !!this.doneBy.length;
    }

    return this.isDoneByUser(uid);
  }

  getDoneBy(uid: EntityIdentity<User>) {
    if(this.userStrategy === UserAssignmentStrategy.Shared) {
      return this.doneBy[0];
    }

    return this.doneBy?.find(d => d.uid.equals(assureObjectId(uid)))
  }

  setUndoneBy(uid: EntityIdentity<User>) {
    if(this.userStrategy === UserAssignmentStrategy.Shared) {
      this.doneBy = [];
    } else {
      this.doneBy = this.doneBy.filter(d => !d.uid.equals(assureObjectId(uid)));
    }
  }

  setDoneBy(uid: EntityIdentity<User>, tid: string, date?: Date) {
    date = date || new Date();

    if(this.userStrategy === UserAssignmentStrategy.Shared) {
      this.doneBy = [new UserDone(uid, tid, date)];
    } else {
      const doneBy = this.doneBy?.find(d => d.uid.equals(assureObjectId(uid)));
      if(doneBy) {
        doneBy.tid = tid;
        doneBy.date = date;
      } else {
        this.doneBy.push(new UserDone(uid, tid, date))
      }
    }
  }

  public static applyUpdate(model: Task, update: UpdateTaskDto) {
    const updatedDataPointConfig = cloneDeep(model.dataPointConfig);
    updatedDataPointConfig.interval = update.interval ?? model.dataPointConfig.interval;

    if (model.dataPointConfigRevisionCheck(updatedDataPointConfig)) {
      model.pushDataPointConfigRevision(model.dataPointConfig);
      model.dataPointConfig = updatedDataPointConfig;
    }

    applyValidationProperties(model, update);
  }

  public static create(profile: Profile, owner: User, update: CreateTaskDto): Task {
    return new Task(profile, owner, {
      ...update,
      tagIds: profile.getTagsByName(update.tagNames).map(tag => assureObjectId(tag.id)),
      dataPointConfig: _createDataPointConfigFromUpdate(update)
    });
  }
}

function _createDataPointConfigFromUpdate(update: UpdateTaskDto) {
  return DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(
    DataPointNumberInputStrategy.CheckboxNumber,
    {
      min: 0,
      max: 1,
      interval: update.interval,
      optimal: 0
    });
}

export const TaskSchema = SchemaFactory.createForClass(Task);