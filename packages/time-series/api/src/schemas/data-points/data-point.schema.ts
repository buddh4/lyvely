import { assureObjectId, MixedProp } from '@lyvely/core';
import { assignEntityData, BaseEntity } from '@lyvely/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  CalendarInterval,
  getFullDayDate,
  getNumberEnumValues,
  toTimingId,
  UserAssignmentStrategy,
  DeepPartial,
  DataPointModel,
  PropertiesOf,
} from '@lyvely/common';
import { TimeSeriesContent } from '../time-series-content.schema';
import { User } from '@lyvely/users';
import { Profile } from '@lyvely/profiles';

export type DataPointEntity<T> = DataPointModel & BaseEntity<T>;

/**
 * This represents a datapoint bucket of given interval.
 */
@Schema({ timestamps: true, discriminatorKey: 'valueType' })
export class DataPoint<T extends DataPointEntity<T> = DataPointEntity<any>>
  extends BaseEntity<T>
  implements PropertiesOf<DataPointModel>
{
  meta: any;

  @Prop({ type: mongoose.Schema.Types.ObjectId, immutable: true })
  oid: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, immutable: true })
  pid: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, immutable: true })
  cid: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, immutable: true })
  uid?: TObjectId;

  @Prop({ enum: getNumberEnumValues(CalendarInterval), required: true })
  interval: CalendarInterval;

  @Prop({ type: String, required: true, immutable: true })
  tid: string;

  valueType: string;

  value: any;

  /**
   * Contains a full day (no time) utc date with the same date described by tid.
   * date.toISOString() should always return a date string in the format '2020-02-20T00:00:00.000Z'
   * If a date with timezone information is given in the constructor, we simply translate the given date to utc without
   * respecting timezone differences.
   */
  @Prop({ type: Date, required: true, immutable: true })
  date: Date;

  constructor(profile: Profile, user: User, content: TimeSeriesContent<any>, obj?: DeepPartial<T>) {
    super(false);

    if (obj) {
      assignEntityData(this, obj);
    }

    this.pid = assureObjectId(profile._id);
    this.uid =
      content.timeSeriesConfig.userStrategy === UserAssignmentStrategy.PerUser
        ? assureObjectId(user._id)
        : null;
    this.cid = assureObjectId(content._id);
    this.interval = content.timeSeriesConfig.interval;

    if (!this.date) {
      return;
    }

    this.date = getFullDayDate(this.date);
    this.tid = toTimingId(this.date, this.interval, profile.locale);

    this.afterInit();
  }
}

export const DataPointSchema = SchemaFactory.createForClass(DataPoint);
