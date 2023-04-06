import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CheckboxNumberDataPointConfig,
  TimeSeriesContent,
  TimeSeriesConfigSchemaFactory,
  DataPointConfigSchema,
  DataPointConfigFactory,
  TextareaTextDataPointConfig,
  TimerDataPointConfig,
} from '@/time-series';
import * as mongoose from 'mongoose';
import {
  ContentModel,
  DataPointInputType,
  DataPointValueType,
  IContent,
  ITimeSeriesContentConfig,
} from '@lyvely/common';
import { User } from '@/users';
import { NestedSchema } from '@/core';

type TestDataPointConfig =
  | CheckboxNumberDataPointConfig
  | TextareaTextDataPointConfig
  | TimerDataPointConfig;

@NestedSchema()
class TestTimeSeriesConfig implements ITimeSeriesContentConfig {
  @Prop({ type: DataPointConfigSchema })
  timeSeries: TestDataPointConfig;
}

const TestTimeSeriesConfigSchema = TimeSeriesConfigSchemaFactory.createForClass(
  TestTimeSeriesConfig,
  [
    DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
    DataPointConfigFactory.getStrategyName(DataPointValueType.Text, DataPointInputType.Textarea),
    DataPointConfigFactory.getStrategyName(DataPointValueType.Timer, DataPointInputType.Timer),
  ],
);

@Schema()
export class TestTimeSeriesContent extends TimeSeriesContent<TestTimeSeriesContent> {
  @Prop({ type: TestTimeSeriesConfigSchema })
  config: TestTimeSeriesConfig;

  @Prop()
  someTestField: string;

  toModel(user?: User): ContentModel<IContent<any, any>, any> {
    throw new Error('Method not implemented.');
  }
}

export type TestTimeSeriesContentDocument = TestTimeSeriesContent & mongoose.Document;
export const TestTimeSeriesContentSchema = SchemaFactory.createForClass(TestTimeSeriesContent);
