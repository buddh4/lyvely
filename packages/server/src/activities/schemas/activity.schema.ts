import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  CheckboxNumberDataPointConfig,
  SpinnerNumberDataPointConfig,
  NumberTimeSeriesContent,
  TimeSeriesContentSchemaFactory,
  DefaultDataPointConfigSchema,
  DataPointConfigFactory,
} from '@/time-series';
import { DataPointNumberInputType, ActivityModel, PropertiesOf, DataPointValueType } from '@lyvely/common';

type ActivityDataPointConfig = CheckboxNumberDataPointConfig | SpinnerNumberDataPointConfig;

/**
 * Base Activity content class.
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Activity extends NumberTimeSeriesContent<Activity> implements PropertiesOf<ActivityModel> {
  @Prop({ type: Number, default: 0 })
  score: number;

  @Prop({ type: DefaultDataPointConfigSchema, required: true })
  dataPointConfig: ActivityDataPointConfig;

  type: string;
}

export type ActivityDocument = Activity & mongoose.Document;
export const ActivitySchema = TimeSeriesContentSchemaFactory.createForClass(Activity, [
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointNumberInputType.Checkbox),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointNumberInputType.Range),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointNumberInputType.Spinner),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointNumberInputType.Time),
]);
