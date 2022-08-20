import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from '../../db/base.entity';
import { Timing, TimingSchema } from '../../calendar/schemas/timing.schema';
import { User } from '../../users';
import { Profile } from './profiles.schema';
import { DeepPartial, toDate, UserAssignmentStrategy, Calendar, CalendarDate, CalendarIntervalEnum } from "@lyvely/common";

export interface IProfileScoreAction {
  _id: TObjectId;
  oid?: TObjectId,
  pid: TObjectId,
  uid?: TObjectId,
  createdBy: TObjectId,
  timing: Timing,
  type: string,
  score: number
}

export interface CreateProfileScore {
  user: User,
  profile: Profile,
  score: number,
  date?: CalendarDate,
  userStrategy?: UserAssignmentStrategy
}

/**
 * Used to log profile related actions, which may be assigned with a score value. In case the action was accomplished by
 * as user the uid should be set, otherwise the action is linked to the whole profile.
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class ProfileScore<C extends IProfileScoreAction = IProfileScoreAction> extends BaseEntity<C> {

  constructor(options: CreateProfileScore, data: DeepPartial<C> = {}) {
    const { user, profile } = options;
    data.createdBy = data.createdBy || user._id;
    data.score = options.score;
    data.pid = profile._id;
    data.oid = profile.oid;

    const strategy = options.userStrategy ?? UserAssignmentStrategy.PerUser;
    if(strategy === UserAssignmentStrategy.PerUser) {
      data.uid = user._id;
    } else {
      data.uid = null;
    }

    data.timing = data.timing || Calendar.createTiming(CalendarIntervalEnum.Daily, toDate(options.date ?? new Date()));

    super(data);
  }

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  oid?: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  uid?: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId,  required: true  })
  createdBy: TObjectId;

  @Prop({ type: TimingSchema, required: true })
  timing: Timing;

  @Prop({ required: true, default: 0 })
  score: number;

  type: string;

  createdAt: Date;

  updatedAt: Date;

  static collectionName() {
    return 'profileScoreActions';
  }

  // TODO: How to generate text, maybe use type to detect message and provide instance and user/profile to translation
}

export const ProfileScoreSchema = SchemaFactory.createForClass(ProfileScore);
export type ProfileScoreActionDocument = ProfileScore & mongoose.Document;
