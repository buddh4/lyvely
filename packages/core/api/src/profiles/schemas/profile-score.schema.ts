import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument, ObjectIdArrayProp, ObjectIdProp, TObjectId } from '@/core';
import { getNumberEnumValues, type PartialPropertiesOf } from '@lyvely/common';
import { CalendarPreferences, UserAssignmentStrategy } from '@lyvely/interface';
import { CalendarDate, CalendarInterval, parseTimingId, toDate, toTimingId } from '@lyvely/dates';
import { ProtectedProfileContext } from '@/profiles';

/**
 * Represents the data required to create a profile score.
 */
export interface ICreateProfileScore {
  context: ProtectedProfileContext;
  score: number;
  title?: string;
  /**
   * The date this score is attributed to.
   * For full day dates, this should be provided in the profiles timezone e.g. by using
   * `getFullDayTZDate(date, profile.timezone)` since aggregations will use the profile timezone.
   * If no date is given the current date and time is set.
   * If no tid is given, this date will be used to calculate the tid.
   **/
  date?: CalendarDate;
  /**
   * This contains the timing id this score is attributed to.
   * If no tid is given, the scores date property is used to calculate one.
   * A custom tid should be provided in cases in which the date may differ due to the profile timezone e.g.
   * for time series data points.
   */
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
  @ObjectIdProp({ required: true })
  oid: TObjectId;

  @ObjectIdProp({ required: true })
  pid: TObjectId;

  @ObjectIdProp()
  uid?: TObjectId;

  /** Optional ID of a content document this score is related to. **/
  @ObjectIdProp()
  cid?: TObjectId;

  /** Optional content type this score is related to. **/
  @Prop()
  contentType?: string;

  /** A title, e.g. content title used in the frontend. **/
  @Prop()
  title?: string;

  @ObjectIdProp({ required: true })
  createdBy: TObjectId;

  /** Contains the tid this score value is attributed to. **/
  @Prop({ type: String, required: true })
  tid: string;

  /** The date this score is attributed to. **/
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

  /** Tag ids related to this score. **/
  @ObjectIdArrayProp()
  tagIds?: TObjectId[];

  @Prop({
    enum: getNumberEnumValues(UserAssignmentStrategy),
    default: UserAssignmentStrategy.Shared,
    required: false,
  })
  userStrategy: UserAssignmentStrategy;

  @Prop({ required: true, default: 0 })
  score: number;

  id: string;

  _id: TObjectId;

  type: string;

  createdAt: Date;

  updatedAt: Date;

  static collectionName() {
    return 'profilescores';
  }

  constructor(options: ICreateProfileScore, data: PartialPropertiesOf<ProfileScore> = {}) {
    const { user, profile } = options.context;
    data.createdBy ||= user._id;
    data.score = options.score;
    data.pid = profile._id;
    data.oid = profile.oid;
    data.tagIds ||= options.tagIds;
    data.date = toDate(options.date || new Date());

    data.userStrategy = options.userStrategy ?? UserAssignmentStrategy.Shared;
    data.uid = user._id;
    data.title ||= options.title;

    BaseDocument.init(this, data);

    if (this.date) {
      const calendarPreferences = profile.settings?.calendar as CalendarPreferences;
      this.tid ??= toTimingId(
        this.date,
        CalendarInterval.Daily,
        profile.locale,
        calendarPreferences
      );
      Object.assign(this, parseTimingId(this.tid));
    }
  }
}

export const ProfileScoreSchema = SchemaFactory.createForClass(ProfileScore);
