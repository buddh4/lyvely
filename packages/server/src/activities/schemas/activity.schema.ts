import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  NumberDataPointConfig,
  NumberTimeSeriesContent,
  NumberTimeSeriesContentConfig,
} from '@/time-series';
import {
  ActivityModel,
  DataPointInputType,
  DataPointValueType,
  IContentDataType,
  PropertiesOf,
  PropertyType,
} from '@lyvely/common';

@Schema({ id: false })
export class ActivityConfig extends NumberTimeSeriesContentConfig<ActivityConfig> {
  @Prop({ type: Number })
  @PropertyType(Number, { default: 0 })
  score: number;
}

const ActivityConfigSchema = SchemaFactory.createForClass(ActivityConfig);

/**
 * Base Activity content class.
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Activity extends NumberTimeSeriesContent<Activity> implements PropertiesOf<ActivityModel> {
  @Prop({ type: ActivityConfigSchema, required: true })
  config: ActivityConfig;

  type: string;

  applyUpdate(update: {
    getTimeSeriesConfig?: () => Partial<NumberDataPointConfig>;
    getContent?: () => Partial<IContentDataType>;
  }) {
    this.applyTimeSeriesConfigUpdate(update?.getTimeSeriesConfig());
    this.applyContentUpdate(update?.getContent());
  }

  getDefaultConfig(): any {
    return DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(
      DataPointValueType.Number,
      DataPointInputType.Checkbox,
      {
        min: 0,
        max: 1,
      },
    );
  }
}

export type ActivityDocument = Activity & mongoose.Document;
export const ActivitySchema = SchemaFactory.createForClass(Activity);
