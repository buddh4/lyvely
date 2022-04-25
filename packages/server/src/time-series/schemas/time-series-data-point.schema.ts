import { assignEntityData, BaseEntity, EntityType } from '../../db/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document }  from 'mongoose';
import {
  DeepPartial,
  CalendarIntervalEnum,
  getFullDayDate,
  getNumberEnumValues,
  toTimingId,
} from "lyvely-common";
import { TimeSeries } from "./time-series-content.schema";

export interface TimeSeriesDataPointConstructor<Model extends TimeSeries> {
  new (obj?: DeepPartial<IDataPoint>): IDataPoint;
}

export interface IDataPoint {
  meta: {
    pid: mongoose.Types.ObjectId,
    cid: mongoose.Types.ObjectId,
    uid?: mongoose.Types.ObjectId,
    interval: CalendarIntervalEnum,
  }
  date: Date,
  tid: string,
}

@Schema({ _id: false })
export class DataPointMeta {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  cid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  uid?: mongoose.Types.ObjectId;

  @Prop({ enum: getNumberEnumValues(CalendarIntervalEnum), required: true })
  interval: CalendarIntervalEnum;

  constructor(obj?: DeepPartial<DataPointMeta>) {
    assignEntityData(this, obj);
  }
}


const DataPointMetaSchema = SchemaFactory.createForClass(DataPointMeta);

export abstract class DataPoint<T extends EntityType<IDataPoint> = EntityType<IDataPoint>> extends BaseEntity<T> implements IDataPoint {
  @Prop({ type: DataPointMetaSchema, required: true })
  meta: DataPointMeta;

  @Prop( { type: String, required: true, match: /^Y:[0-9]{4};Q:[0-4];M:(?:[1-9]|1[0-2]);W:(?:[1-9]|[1-4][0-9]|5[0-3]);D:(?:[1-9]|[1-2][0-9]|3[0-1])$/ })
  tid: string;

  /**
   * Contains a full day (no time) utc date with the same date described by tid.
   * date.toISOString() should always return a date string in the format '2020-02-20T00:00:00.000Z'
   * If a date with timezone information is given in the constructor, we simply translate the given date to utc without
   * respecting timezone differences.
   */
  @Prop( { type: Date, required: true })
  date: Date;

  afterInit() {
    super.afterInit();

    if(!this.date) {
      return;
    }

    this.date = getFullDayDate(this.date);
    this.tid = toTimingId(this.date);
  }
}

export type DataPointDocument = DataPoint & Document;



