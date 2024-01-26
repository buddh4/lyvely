import {
  UserAssignmentStrategy,
  assureObjectId,
  ObjectIdProp,
  assignEntityData,
  BaseDocument,
  TObjectId,
  User,
  Profile,
  CalendarPreferences,
} from '@lyvely/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CalendarInterval,
  getFullDayDate,
  toTimingId,
  ITiming,
  parseTimingId,
} from '@lyvely/dates';
import { getNumberEnumValues, DeepPartial, PropertiesOf } from '@lyvely/common';
import { DataPointModel } from '@lyvely/time-series-interface';
import { TimeSeriesContent } from '../time-series-content.schema';

export type DataPointEntity<T> = DataPointModel<TObjectId> & BaseDocument<T>;

/**
 * This is a generic class representing different types of data points in a time series.
 * The subclasses derived from this class are designated to define specific value types.
 * The span of a single data point over a time interval (for example, a year, quarter, month, week, day)
 * depends on the chosen interval level. The interval is usually provided by the related time series content configuration
 * which may changes over time. An 'unscheduled' level is utilized when no specific time interval is defined, which
 * means that in this case there will only be one data point per time series.
 */
@Schema({ timestamps: true, discriminatorKey: 'valueType' })
export class DataPoint<T extends DataPointEntity<T> = DataPointEntity<any>>
  extends BaseDocument<T>
  implements PropertiesOf<DataPointModel<TObjectId, T>>, ITiming
{
  /** Related organization id. **/
  @ObjectIdProp({ immutable: true })
  oid: TObjectId;

  /** Related profile id. **/
  @ObjectIdProp({ required: true, immutable: true })
  pid: TObjectId;

  /** Related content id. **/
  @ObjectIdProp({ required: true, immutable: true })
  cid: TObjectId;

  /** The user id this data point is related to, in case of a per-user data point. **/
  @ObjectIdProp({ immutable: true })
  uid?: TObjectId | null;

  /**
   * The interval this data point spans over. This usually equals with the interval of the time series configuration,
   * unless the time series content configuration has changed.
   **/
  @Prop({ enum: getNumberEnumValues(CalendarInterval), required: true })
  interval: CalendarInterval;

  /** This tid is unique for each time series and is used to identify a specific data point. **/
  @Prop({ type: String, required: true, immutable: true })
  tid: string;

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

  valueType: string;

  value: any;

  /**
   * Contains a utc date without time information with the same date described by tid.
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

    if (this.date) {
      this.setDate(profile, this.date);
    }

    this.afterInit();
  }

  /**
   * Sets the date and date related properties as tid and timing values as:
   *
   * - date: Transforms and sets the given date to an utc date without time information.
   * - tid: Creates and sets a tid for the given date.
   * - year, quarter, month, week, day: Sets the timing values according to the generated tid.
   *
   * @param profile
   * @param date
   */
  setDate(profile: Profile, date: Date) {
    const calendarPreferences = profile.settings?.calendar as CalendarPreferences;
    this.date = getFullDayDate(date);
    this.tid = toTimingId(date, this.interval, profile.locale, calendarPreferences);
    Object.assign(this, parseTimingId(this.tid));
  }
}

export const DataPointSchema = SchemaFactory.createForClass(DataPoint);
