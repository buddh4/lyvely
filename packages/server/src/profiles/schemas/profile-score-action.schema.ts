import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from '../../db/base.entity';
import { Timing, TimingSchema } from '../../calendar/schemas/timing.schema';
import { assureObjectId } from '../../db/db.utils';
import { Calendar, CalendarDate, CalendarIntervalEnum } from 'lyvely-common';
import { User } from '../../users';
import { Profile } from './profiles.schema';
import { UserAssignmentStrategy } from "lyvely-common/src";

interface IProfileScoreAction {
  _id: mongoose.Types.ObjectId;
  oid?: mongoose.Types.ObjectId,
  pid: mongoose.Types.ObjectId,
  uid?: mongoose.Types.ObjectId,
  createdBy: mongoose.Types.ObjectId,
  timing: Timing,
  type: string,
  score: number
}

export type CreateProfileScoreAction<C extends IProfileScoreAction = IProfileScoreAction> = Partial<C> & {
  user?: User,
  profile?: Profile,
  date?: CalendarDate,
  userStrategy?: UserAssignmentStrategy
};

/**
 * Used to log profile related actions, which may be assigned with a score value. In case the action was accomplished by
 * as user the uid should be set, otherwise the action is linked to the whole profile.
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class ProfileScoreAction<C extends IProfileScoreAction = IProfileScoreAction> extends BaseEntity<C> {

  constructor(data: CreateProfileScoreAction<C> = {}) {
    const strategy = data.userStrategy ?? UserAssignmentStrategy.PerUser;
    data.uid = data.user && strategy === UserAssignmentStrategy.PerUser ? assureObjectId(data.user._id) : data.uid;
    data.createdBy = data.user ? assureObjectId(data.user._id) : data.createdBy;
    data.pid = data.profile ? assureObjectId(data.profile._id) : data.pid;
    data.oid = data.profile?.oid ? assureObjectId(data.profile.oid) : data.oid;
    data.score = data.score ?? 0;
    data.date = data.date ?? new Date();

    if(!data.timing && data.profile) {
      data.timing = Calendar.createTiming(CalendarIntervalEnum.Daily, data.date || new Date());
    }

    super(data);
  }

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  oid?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  uid?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId,  required: true  })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ type: TimingSchema, required: true })
  timing: Timing;

  @Prop({ required: true, default: 0 })
  score: number;

  type: string;

  createdAt: Date;

  updatedAt: Date;

  // TODO: How to generate text, maybe use type to detect message and provide instance and user/profile to translation
}

export const ProfileScoreActionSchema = SchemaFactory.createForClass(ProfileScoreAction);
export type ProfileScoreActionDocument = ProfileScoreAction & mongoose.Document;
