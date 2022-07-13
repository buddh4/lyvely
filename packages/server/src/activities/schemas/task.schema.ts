import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '../../profiles';
import { AbstractCreateActivityDto, DataPointNumberInputStrategy, ITaskWithUsers, REGEX_TID } from 'lyvely-common';
import mongoose from 'mongoose';
import { User } from '../../users';
import { Activity } from './activity.schema';
import { DataPointConfigFactory } from '../../time-series';
import { assureObjectId, EntityIdentity } from "../../db/db.utils";
import { UserAssignmentStrategy } from "lyvely-common/src";

export type TaskDocument = Task & mongoose.Document;

@Schema({ _id: false })
export class UserDone {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  uid: mongoose.Types.ObjectId;

  @Prop( { type: String, required: true, match: REGEX_TID })
  tid: string;

  @Prop({ type: Date, required: true })
  date: Date;

  constructor(uid: EntityIdentity<User>, tid: string, date: Date) {
    this.uid = assureObjectId(uid);
    this.tid = tid;
    this.date = date;
  }
}

const UserDoneSchema = SchemaFactory.createForClass(UserDone);

@Schema()
export class Task extends Activity implements ITaskWithUsers {

  @Prop({ type: [UserDoneSchema] })
  doneBy?: UserDone[];

  afterInit() {
    this.dataPointConfig = DataPointConfigFactory.createConfig(DataPointNumberInputStrategy.CheckboxNumber, {
      min: 1,
      max: 1,
      optimal: 1
    });

    if(!this.doneBy) {
      this.doneBy = [];
    }

    super.afterInit();
  }

  isDoneByUser(uid: EntityIdentity<User>) {
    return !!this.doneBy?.find(d => d.uid.equals(assureObjectId(uid)));
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

  public static create(owner: User, profile: Profile, data: AbstractCreateActivityDto): Task {
    data.strategy = DataPointNumberInputStrategy.CheckboxNumber;
    data.max = 1;
    data.optimal = 1;
    data.categories = data.categories || [];
    return Activity.createActivityType(owner, profile, data, Task);
  }
}

export const TaskSchema = SchemaFactory.createForClass(Task);
