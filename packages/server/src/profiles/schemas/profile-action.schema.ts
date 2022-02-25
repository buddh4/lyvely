import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from '../../db/base.entity';
import { Timing, TimingSchema } from '../../calendar/schemas/timing.schema';
import { assureObjectId } from '../../db/db.utils';
import { Calendar, CalendarIntervalEnum } from 'lyvely-common';
import { User } from '../../users/schemas/users.schema';
import { Profile } from './profiles.schema';

interface IProfileAction {
  _id: mongoose.Types.ObjectId;
  oid?: mongoose.Types.ObjectId,
  pid: mongoose.Types.ObjectId,
  uid?: mongoose.Types.ObjectId,
  timing: Timing,
  timingId: string,
  type: string,
  score: number
}

type CreateProfileAction<C extends IProfileAction = IProfileAction> = Partial<C> & {
  user?: User,
  profile?: Profile
};

/**
 * Used to log profile related actions, which may be assigned with a score value. In case the action was accomplished by
 * as user the uid should be set, otherwise the action is linked to the whole profile.
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class ProfileAction<C extends IProfileAction = IProfileAction> extends BaseEntity<C> {

  constructor(data: CreateProfileAction<C> = {}) {
    data.uid = data.user ? assureObjectId(data.user._id) : data.uid;
    data.pid = data.profile ? assureObjectId(data.profile._id) : data.pid;
    data.oid = data.profile?.oid ? assureObjectId(data.profile.oid) : data.oid;
    data.score = data.score ?? 0;

    if(!data.timing && data.profile) {
      data.timing = Calendar.createTiming(CalendarIntervalEnum.Daily, new Date(), data.profile.getLocale());
    }

    if(data.timing) {
      data.timingId = data.timing.timingId;
    }

    super(data);
  }

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  oid?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  uid: mongoose.Types.ObjectId;

  @Prop({ type: TimingSchema, required: true })
  timing: Timing;

  @Prop( { required: true })
  timingId: string;

  @Prop({ required: true, default: 0 })
  score: number;

  type: string;

  createdAt: Date;

  updatedAt: Date;

  // TODO: How to generate text, maybe use type to detect message and provide instance and user/profile to translation
}

export const UserProfileLogSchema = SchemaFactory.createForClass(ProfileAction);
export type UserProfileLogDocument = ProfileAction & mongoose.Document;
