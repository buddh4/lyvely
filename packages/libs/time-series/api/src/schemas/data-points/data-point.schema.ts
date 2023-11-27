import {
  UserAssignmentStrategy,
  assureObjectId,
  ObjectIdProp,
  assignEntityData,
  BaseDocument,
  TObjectId,
  User,
  Profile,
} from '@lyvely/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CalendarInterval, getFullDayDate, toTimingId } from '@lyvely/dates';
import { getNumberEnumValues, DeepPartial, PropertiesOf } from '@lyvely/common';
import { DataPointModel } from '@lyvely/time-series-interface';
import { TimeSeriesContent } from '../time-series-content.schema';

export type DataPointEntity<T> = DataPointModel<TObjectId> & BaseDocument<T>;

/**
 * This represents a datapoint bucket of given interval.
 */
@Schema({ timestamps: true, discriminatorKey: 'valueType' })
export class DataPoint<T extends DataPointEntity<T> = DataPointEntity<any>>
  extends BaseDocument<T>
  implements PropertiesOf<DataPointModel<TObjectId, T>>
{
  meta: any;

  @ObjectIdProp({ immutable: true })
  oid: TObjectId;

  @ObjectIdProp({ required: true, immutable: true })
  pid: TObjectId;

  @ObjectIdProp({ required: true, immutable: true })
  cid: TObjectId;

  @ObjectIdProp({ immutable: true })
  uid?: TObjectId | null;

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
    this.tid = toTimingId(this.date, this.interval, profile.locale, profile.settings?.calendar);

    this.afterInit();
  }
}

export const DataPointSchema = SchemaFactory.createForClass(DataPoint);
