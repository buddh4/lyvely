import { BaseEntity } from '../../db/base.entity';
import { CalendarDate, Calendar, ITimeSeriesDataPoint } from 'lyvely-common';
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose  from 'mongoose';
import { User } from '../../users/schemas/users.schema';
import { Profile } from '../../profiles';
import { Timing, TimingSchema } from '../../calendar/schemas/timing.schema';
import { assureObjectId } from '../../db/db.utils';


import { TimeSeriesContent } from './time-series-content.schema';

export interface TimeSeriesDataPointConstructor<Model extends TimeSeriesContent> {
  new (obj?: Partial<ITimeSeriesDataPoint>): ITimeSeriesDataPoint;
  create(user: User, profile: Profile, model: Model, date: CalendarDate): TimeSeriesDataPoint;
}

/**
 * Base schema for time series data point types.
 */
@Schema({ timestamps: true })
export abstract class TimeSeriesDataPoint extends BaseEntity<TimeSeriesDataPoint> implements ITimeSeriesDataPoint {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  contentId: mongoose.Types.ObjectId;

  @Prop({ type: TimingSchema, required: true })
  timing: Timing;

  @Prop({ required: true })
  timingId: string;

  static pupulate<LogModel extends TimeSeriesDataPoint>(log: LogModel, profile: Profile, model: TimeSeriesContent, date: CalendarDate): LogModel {
    const timing = Calendar.createTiming(model.interval, date, profile.getLocale());
    log.contentId = assureObjectId(model);
    log.timing = timing;
    log.timingId = timing._id;
    return log;
  }
}

export type TimeSeriesDataPointDocument = mongoose.Document<mongoose.Types.ObjectId> & TimeSeriesDataPoint;

