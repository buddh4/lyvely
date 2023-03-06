import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  DataPointConfigSchema,
  RangeNumberDataPointConfig,
  SpinnerNumberDataPointConfig,
  TextareaTextDataPointConfig,
  TimeNumberDataPointConfig,
  TimeSeriesConfigSchemaFactory,
  TimeSeriesContent,
} from '@/time-series';
import { DataPointInputType, DataPointValueType, ITimeSeriesContentConfig } from '@lyvely/common';
import { User } from '@/users';
import { NestedSchema } from '@/core';

type JournalDataPointConfig =
  | TextareaTextDataPointConfig
  | CheckboxNumberDataPointConfig
  | SpinnerNumberDataPointConfig
  | TimeNumberDataPointConfig
  | RangeNumberDataPointConfig;

@NestedSchema()
export class JournalConfig implements ITimeSeriesContentConfig {
  @Prop({ type: DataPointConfigSchema, required: true })
  timeSeries: JournalDataPointConfig;
}

export const JournalConfigSchema = TimeSeriesConfigSchemaFactory.createForClass(JournalConfig, [
  DataPointConfigFactory.getStrategyName(DataPointValueType.Text, DataPointInputType.Textarea),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Range),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Spinner),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Time),
]);

/**
 * Base Activity content class.
 */
@Schema()
export class Journal extends TimeSeriesContent<Journal> {
  @Prop({ type: JournalConfigSchema, required: true })
  config: JournalConfig;

  applyUpdate(update: any) {
    // TODO: implement
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

  toModel(user?: User): any {
    return '';
  }

  createTimeSeriesConfigRevision() {
    return null;
  }
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
