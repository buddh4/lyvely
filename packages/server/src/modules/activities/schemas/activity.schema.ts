import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ActivityModel, DataPointInputStrategy } from '@lyvely/common';
import {
  CheckboxNumberDataPointConfig, SpinnerNumberDataPointConfig,
  NumberTimeSeriesContent,
  TimeSeriesContentSchemaFactory,
  DefaultDataPointConfigSchema,
} from '../../../interfaces/time-series';
import { PropertiesOf } from "@lyvely/common";

type ActivityDataPointConfig = CheckboxNumberDataPointConfig | SpinnerNumberDataPointConfig;

/**
 * Base Activity content class.
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Activity extends NumberTimeSeriesContent<Activity> implements PropertiesOf<ActivityModel> {

  @Prop({ required: true })
  title: string;

  @Prop({ type: Number })
  sortOrder: number;

  @Prop({ type: Number, default: 0 })
  score: number;

  @Prop({ type: DefaultDataPointConfigSchema, required: true })
  dataPointConfig: ActivityDataPointConfig;

  type: string;
}

export type ActivityDocument = Activity & mongoose.Document;
export const ActivitySchema = TimeSeriesContentSchemaFactory.createForClass(Activity, [
  DataPointInputStrategy.CheckboxNumber,
  DataPointInputStrategy.RangeNumber,
  DataPointInputStrategy.SpinnerNumber
]);
