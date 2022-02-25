import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProfileAction, Profile } from '../../profiles';
import mongoose from 'mongoose';
import { assureStringId } from '../../db/db.utils';
import { User } from '../../users/schemas/users.schema';
import { Activity } from './activity.schema';
import { CalendarDate, IActivityDataPoint } from 'lyvely-common';
import { TimeSeriesDataPoint } from '../../time-series';

@Schema({ timestamps: true })
export class ActivityDataPoint extends ProfileAction<ActivityDataPoint> implements IActivityDataPoint<number> {
  @Prop({type: mongoose.Schema.Types.ObjectId, required: true})
  contentId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  max: number;

  @Prop({ required: true })
  score: number;

  public getContentId(): string {
    return assureStringId(this.contentId);
  }

  static create(user: User, profile: Profile, activity: Activity, date: CalendarDate): ActivityDataPoint {
    const model = new ActivityDataPoint({ user, profile, score: 0, value: 0 });
    TimeSeriesDataPoint.pupulate(model, profile, activity, date);
    return model;
  }
}

export const ActivityDataPointSchema = SchemaFactory.createForClass(ActivityDataPoint);
export type ActivityDataPointDocument = ActivityDataPoint & mongoose.Document;

// TODO: Do we need this?
ActivityDataPointSchema.methods.getTimingModelId = function () {
  const log = <ActivityDataPointDocument>this;
  return log.contentId.toString();
};