import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument, ObjectIdArrayProp, ObjectIdProp, TObjectId } from '@/core';
import { type PartialPropertiesOf } from '@lyvely/common';
import { CalendarPreferences, UserAssignmentStrategy } from '@lyvely/interface';
import { User } from '@/users';
import { Profile } from './profiles.schema';
import { CalendarDate, CalendarInterval, parseTimingId, toDate, toTimingId } from '@lyvely/dates';

export interface IProfileScore {
  _id: TObjectId;
  oid?: TObjectId;
  pid: TObjectId;
  uid?: TObjectId;
  createdBy: TObjectId;
  date: Date;
  tid: string;
  type: string;
  tagIds?: TObjectId[];
  score: number;
}

export interface ICreateProfileScore {
  user: User;
  profile: Profile;
  score: number;
  date?: CalendarDate;
  tid?: string;
  tagIds?: TObjectId[];
  userStrategy?: UserAssignmentStrategy;
}

/**
 * Used to log profile related actions, which may be assigned with a score value. In case the action was accomplished by
 * as user the uid should be set, otherwise the action is linked to the whole profile.
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class ProfileScore {
  @ObjectIdProp()
  oid?: TObjectId;

  @ObjectIdProp({ required: true })
  pid: TObjectId;

  @ObjectIdProp()
  uid?: TObjectId;

  @ObjectIdProp({ required: true })
  createdBy: TObjectId;

  /** Contains the tid this score value is attributed to. **/
  @Prop({ type: String, required: true })
  tid: string;

  /** Contains the tid this score value is attributed to. **/
  @Prop({ type: Date, required: true, immutable: true })
  date: Date;

  /** Contains the same year value as tid and is mainly used for aggregation purposes. **/
  @Prop({ immutable: true })
  year?: number;

  /** Contains the same month value as tid and is mainly used for aggregation purposes. **/
  @Prop({ immutable: true })
  month?: number;

  /** Contains the same quarter value as tid and is mainly used for aggregation purposes. **/
  @Prop({ immutable: true })
  quarter?: number;

  /** Contains the same day value as tid and is mainly used for aggregation purposes. **/
  @Prop({ immutable: true })
  day?: number;

  /** Contains the same week value as tid and is mainly used for aggregation purposes. **/
  @Prop({ immutable: true })
  week?: number;

  @ObjectIdArrayProp()
  tagIds?: TObjectId[];

  @Prop({ required: true, default: 0 })
  score: number;

  id: string;

  _id: TObjectId;

  type: string;

  createdAt: Date;

  updatedAt: Date;

  static collectionName() {
    return 'profileScores';
  }

  constructor(options: ICreateProfileScore, data: PartialPropertiesOf<ProfileScore> = {}) {
    const { user, profile } = options;
    data.createdBy ||= user._id;
    data.score = options.score;
    data.pid = profile._id;
    data.oid = profile.oid;
    data.tagIds ||= options.tagIds;
    data.date = toDate(options.date || new Date());

    const strategy = options.userStrategy ?? UserAssignmentStrategy.PerUser;
    if (strategy === UserAssignmentStrategy.PerUser) {
      data.uid = user._id;
    } else {
      data.uid = undefined;
    }

    BaseDocument.init(this, data);

    if (this.date) {
      const calendarPreferences = profile.settings?.calendar as CalendarPreferences;
      this.tid ??= toTimingId(
        this.date,
        CalendarInterval.Daily,
        profile.locale,
        calendarPreferences,
      );
      Object.assign(this, parseTimingId(this.tid));
    }
  }

  // TODO: How to generate text, maybe use type to detect message and provide instance and user/profile to translation
}

export const ProfileScoreSchema = SchemaFactory.createForClass(ProfileScore);
