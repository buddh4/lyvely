import {
  UserAssignmentStrategy,
  assureObjectId,
  ObjectIdProp,
  BaseDocument,
  TObjectId,
  User,
  Profile,
  CalendarPreferences,
  type BaseDocumentData,
} from '@lyvely/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CalendarInterval,
  toTimingId,
  ITiming,
  parseTimingId,
  getFullDayUTCDate,
} from '@lyvely/dates';
import { getNumberEnumValues, PropertiesOf, PartialPropertiesOf } from '@lyvely/common';
import { DataPointModel } from '@lyvely/time-series-interface';
import { TimeSeriesContent } from '../time-series-content.schema';

export type DataPointEntity<T> = DataPointModel<TObjectId> & BaseDocument<T>;

/**
 * This class serves as base class for all data point types of a time series.
 * Subclasses derived from this class are designated to define a custom value type.
 *
 * The span of a single data point over a time interval (e.g., a year, quarter, month, week, day) depends on the chosen
 * interval level. The interval is usually provided by the related time series content configuration
 * which may changes over time. An 'unscheduled' level is utilized when no specific time interval is defined, which
 * means that in this case there will only be one data point per time series.
 *
 * When constructing a data point instance the given date object within the initial data object will be transformed
 * from a non-utc date to an utc date with the same date but without time information and the non-utc date object will
 * be used to create the timing related fields like tid, year, month, week, day. This way we can use the utc date field for
 * date aggregations and direct aggregations on the timing fields without any date conversion logic.
 */
@Schema({ timestamps: true, discriminatorKey: 'valueType' })
export class DataPoint implements PropertiesOf<DataPointModel<TObjectId>>, ITiming {
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

  /**
   * Contains the utc date without time information with the same date described by tid.
   * date.toISOString() should always return a date string in the format '2020-02-20T00:00:00.000Z'
   * If a date with timezone information is given in the constructor, we simply translate the given date to utc without
   * respecting timezone differences.
   */
  @Prop({ type: Date, required: true, immutable: true })
  date: Date;

  valueType: string;

  value: any;

  id: string;

  _id: TObjectId;

  constructor(
    profile: Profile,
    user: User,
    content: TimeSeriesContent,
    data?: BaseDocumentData<DataPoint>
  ) {
    BaseDocument.init(this, data);

    this.oid = assureObjectId(content.oid);
    this.pid = assureObjectId(profile._id);
    this.uid =
      content.timeSeriesConfig.userStrategy === UserAssignmentStrategy.PerUser
        ? assureObjectId(user._id)
        : null;
    this.cid = assureObjectId(content._id);
    this.interval = content.timeSeriesConfig.interval;

    if (data !== false && data?.date) {
      this.setDate(profile, data.date);
    }
  }

  /**
   * Sets the given non-utc date and date related properties as tid and timing values as:
   *
   * - date: Transforms and sets the given date to an utc date without time information.
   * - tid: Creates and sets a tid for the given date (non utc).
   * - year, quarter, month, week, day: Sets the timing values according to the generated tid.
   *
   * @param profile
   * @param date
   */
  private setDate(profile: Profile, date: Date) {
    const calendarPreferences = profile.settings?.calendar as CalendarPreferences;
    this.date = getFullDayUTCDate(date);
    this.tid ??= toTimingId(date, this.interval, profile.locale, calendarPreferences);
    Object.assign(this, parseTimingId(this.tid));
  }
}

export const DataPointSchema = SchemaFactory.createForClass(DataPoint);
