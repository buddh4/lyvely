import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CheckboxNumberDataPointConfig,
  NumberTimeSeriesContent,
  SpinnerNumberDataPointConfig,
  TimeSeriesContent,
  TimeSeriesConfigSchemaFactory,
  DefaultDataPointConfigSchema,
  DataPointConfigFactory,
  TextareaTextDataPointConfig,
  NumberTimeSeriesContentConfig,
} from '../../schemas';
import * as mongoose from 'mongoose';
import { DataPointInputType, DataPointValueType, ITimeSeriesContentConfig } from '@lyvely/common';

type TestDataPointConfig = CheckboxNumberDataPointConfig | TextareaTextDataPointConfig;

@Schema({ _id: false })
class TestTimeSeriesConfig implements ITimeSeriesContentConfig {
  @Prop({ type: DefaultDataPointConfigSchema })
  timeSeries: TestDataPointConfig;
}

const TestTimeSeriesConfigSchema = TimeSeriesConfigSchemaFactory.createForClass(TestTimeSeriesConfig, [
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Text, DataPointInputType.Textarea),
]);

@Schema()
export class TestTimeSeriesContent extends TimeSeriesContent<TestTimeSeriesContent> {
  @Prop({ type: TestTimeSeriesConfig })
  config: TestTimeSeriesConfig;

  @Prop()
  someTestField: string;

  createTimeSeriesConfigRevision() {
    return null;
  }
}

export type TestTimeSeriesContentDocument = TestTimeSeriesContent & mongoose.Document;
export const TestTimeSeriesContentSchema = SchemaFactory.createForClass(TestTimeSeriesContent);

type TestNumberDataPointConfig = CheckboxNumberDataPointConfig | SpinnerNumberDataPointConfig;

@Schema({ _id: false })
class TestNumberTimeSeriesConfig extends NumberTimeSeriesContentConfig<
  TestNumberTimeSeriesConfig,
  TestNumberDataPointConfig
> {}

const TestNumberTimeSeriesConfigSchema = TimeSeriesConfigSchemaFactory.createForClass(TestTimeSeriesConfig, [
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Spinner),
]);

@Schema()
export class TestNumberTimeSeriesContent extends NumberTimeSeriesContent<TestNumberTimeSeriesContent> {
  @Prop()
  someTestField: string;

  @Prop({ type: TestNumberTimeSeriesConfigSchema, required: true })
  config: TestNumberTimeSeriesConfig;
}

export type TestNumberTimeSeriesContentDocument = TestNumberTimeSeriesContent & mongoose.Document;
export const TestNumberTimeSeriesContentSchema = SchemaFactory.createForClass(TestNumberTimeSeriesContent);
