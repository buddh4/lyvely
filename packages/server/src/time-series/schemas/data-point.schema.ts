import { assignEntityData, BaseEntity, EntityType } from '../../db/base.entity';
import { Prop } from '@nestjs/mongoose';
import mongoose, { Document }  from 'mongoose';
import {
  CalendarIntervalEnum,
  getFullDayDate,
  getNumberEnumValues,
  toTimingId,
  UserAssignmentStrategy,
  REGEX_TID,
  DeepPartial,
  IDataPoint
} from "lyvely-common";
import { TimeSeriesContent } from "./time-series-content.schema";
import { User } from "../../users";
import { Profile } from "../../profiles";
import { assureObjectId } from "../../db/db.utils";

type DataPointEntity = IDataPoint<mongoose.Types.ObjectId> & { _id: mongoose.Types.ObjectId }

/**
 * This represents a datapoint bucket of given interval.
 */
export abstract class DataPoint<
  T extends EntityType<DataPointEntity> = EntityType<DataPointEntity>
  > extends BaseEntity<T & { _id: mongoose.Types.ObjectId }> implements DataPointEntity {

  meta: any;

  @Prop({ type: mongoose.Schema.Types.ObjectId, immutable: true })
  oid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, immutable: true })
  pid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, immutable: true  })
  cid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, immutable: true })
  uid?: mongoose.Types.ObjectId;

  @Prop({ enum: getNumberEnumValues(CalendarIntervalEnum), required: true })
  interval: CalendarIntervalEnum;

  @Prop( { type: String, required: true, match: REGEX_TID, immutable: true })
  tid: string;

  /**
   * Contains a full day (no time) utc date with the same date described by tid.
   * date.toISOString() should always return a date string in the format '2020-02-20T00:00:00.000Z'
   * If a date with timezone information is given in the constructor, we simply translate the given date to utc without
   * respecting timezone differences.
   */
  @Prop( { type: Date, required: true, immutable: true })
  date: Date;

  constructor(profile: Profile, user: User, content: TimeSeriesContent, obj?: DeepPartial<T>) {
    super(false);

    if(obj) {
      assignEntityData(this, obj);
    }

    this.pid = assureObjectId(profile._id);
    this.uid = content.userStrategy === UserAssignmentStrategy.PerUser ? assureObjectId(user._id) : null;
    this.cid = assureObjectId(content._id);
    this.interval = content.dataPointConfig.interval;

    if(!this.date) {
      return;
    }

    this.date = getFullDayDate(this.date);
    this.tid = toTimingId(this.date);

    this.afterInit();
  }
}

export type DataPointDocument = DataPoint & Document;



