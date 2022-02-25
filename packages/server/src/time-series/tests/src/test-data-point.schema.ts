import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { assignEntityData, BaseEntity, EntityType } from '../../../db/base.entity';
import {
  CalendarDateTime,
  CalendarIntervalEnum,
  dateTime,
  getFullDayDate,
  getNumberEnumValues,
  isToday
} from 'lyvely-common/src';
import { DeepPartial } from 'mongo-seeding/dist/common';

interface ITimingDataPoint<V> {
  meta: {
    pid: mongoose.Types.ObjectId,
    cid: mongoose.Types.ObjectId,
    uid?: mongoose.Types.ObjectId,
    interval: CalendarIntervalEnum,
  }
  date: Date,
  tid: string,
  value: V,
  times?: {
    ts: number,
    value: V
  }[]
}

@Schema({ _id: false })
class TimingDataPointMeta {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  cid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  uid?: mongoose.Types.ObjectId;

  @Prop({ enum: getNumberEnumValues(CalendarIntervalEnum), required: true })
  interval: CalendarIntervalEnum;

  constructor(obj?: DeepPartial<TimingDataPointMeta>) {
    assignEntityData(this, obj);
  }
}

const TimingDataPointMetaSchema = SchemaFactory.createForClass(TimingDataPointMeta);

@Schema({ _id: false })
export class DataPointTime {
  @Prop({ type: Number, required: true, min: 0 })
  ts: number;

  @Prop({ type: Number, required: true })
  value: number;

  constructor(ts: number, value: number) {
    this.ts = ts;
    this.value = value;
  }

}

const DataPointTimeSchema = SchemaFactory.createForClass(DataPointTime);

@Schema()
abstract class NumberTimingDataPoint<T extends EntityType<ITimingDataPoint<number>>> extends BaseEntity<T> implements ITimingDataPoint<number> {
  @Prop({ type: TimingDataPointMetaSchema, required: true })
  meta: TimingDataPointMeta;

  @Prop( { type: String, required: true, match: /^Y:[0-9]{4};Q:[0-4];M:(?:[1-9]|1[0-2]);W:(?:[1-9]|[1-4][0-9]|5[0-3]);D:(?:[1-9]|[1-2][0-9]|3[0-1])$/ })
  tid: string;

  /**
   * Contains a full day (no time) utc date with the same date described by tid.
   * date.toISOString() should always return a date string in the format '2020-02-20T00:00:00.000Z'
   * If a date with timezone information is given in the constructor, we simple translate the given date to utc without
   * respecting timezone differences.
   */
  @Prop( { type: Date, required: true })
  date: Date;

  @Prop( { type: Number, required: true })
  value: number;

  @Prop({ type: [DataPointTimeSchema] })
  times?: DataPointTime[];

  afterInit() {
    super.afterInit();

    if(!this.date) {
      return;
    }

    if(!this.times?.length) {
      const ts = isToday(this.date) ? dateTime(this.date).unixTs() : dateTime(this.date).time(23, 59, 59).unixTs();
      this.times = [new DataPointTime(ts, this.value)];
    }

    this.date = getFullDayDate(this.date);
    this.tid = toTimingId(this.date);
  }
}

export class TestNumberTimingDataPoint extends NumberTimingDataPoint<TestNumberTimingDataPoint> {}

export const TestNumberTimingDataPointPointSchema = SchemaFactory.createForClass(TestNumberTimingDataPoint);
export type TestNumberTimingDataPointDocument = TestNumberTimingDataPoint & mongoose.Document;

export function toTimingId(cd: CalendarDateTime) {
  const dt = dateTime(cd);
  const d = dt.toDate();
  return `Y:${d.getUTCFullYear()};Q:${dt.quarter()};M:${d.getUTCMonth() + 1};W:${dt.isoWeek()};D:${d.getUTCDate()}`
}

export function getTimingLevelIds(d: CalendarDateTime) {
  const dayId = toTimingId(d);
  const weekId = dayId.substring(0, dayId.lastIndexOf(';'));
  const monthId = weekId.substring(0, weekId.lastIndexOf(';'));
  const quarterId = monthId.substring(0, monthId.lastIndexOf(';'));
  const yearId = quarterId.substring(0, quarterId.lastIndexOf(';'));

  return {
    [CalendarIntervalEnum.Daily]: dayId,
    [CalendarIntervalEnum.Weekly]: weekId,
    [CalendarIntervalEnum.Monthly]: monthId,
    [CalendarIntervalEnum.Quarterly]: quarterId,
    [CalendarIntervalEnum.Yearly]: yearId,
  }
}


