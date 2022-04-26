import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '../../profiles';
import mongoose from 'mongoose';
import { User } from '../../users';
import { Activity } from './activity.schema';
import { CalendarDate } from 'lyvely-common';
import { DataPoint } from "../../time-series";

@Schema({ timestamps: true })
export class ActivityDataPoint extends DataPoint<ActivityDataPoint> {
  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  score: number;

  afterInit() {
    super.afterInit();
    this.value = this.value || 0;
    this.score = this.score || 0;
  }

  static create(user: User, profile: Profile, activity: Activity, date: CalendarDate): ActivityDataPoint {
    const model = new ActivityDataPoint();
    //DataPoint.pupulate(model, profile, activity, date);
    return model;
  }
}

export const ActivityDataPointSchema = SchemaFactory.createForClass(ActivityDataPoint);
export type ActivityDataPointDocument = ActivityDataPoint & mongoose.Document;
