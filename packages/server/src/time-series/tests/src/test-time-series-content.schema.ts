import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CheckboxNumberDataPointConfig,
  NumberTimeSeriesContent,
  SpinnerNumberDataPointConfig,
  TimeSeriesContent,
  TimeSeriesConfigSchemaFactory,
  DataPointConfigSchema,
  DataPointConfigFactory,
  TextareaTextDataPointConfig,
  NumberTimeSeriesContentConfig,
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

type TestDataPointConfig = CheckboxNumberDataPointConfig | TextareaTextDataPointConfig;

@Schema({ _id: false })
class TestTimeSeriesConfig implements ITimeSeriesContentConfig {
  @Prop({ type: DataPointConfigSchema })
  timeSeries: TestDataPointConfig;
}

const TestTimeSeriesConfigSchema = TimeSeriesConfigSchemaFactory.createForClass(
  TestTimeSeriesConfig,
  [
    DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
    DataPointConfigFactory.getStrategyName(DataPointValueType.Text, DataPointInputType.Textarea),
  ],
);

@Schema()
export class TestTimeSeriesContent extends TimeSeriesContent<TestTimeSeriesContent> {
  @Prop({ type: TestTimeSeriesConfig })
  config: TestTimeSeriesConfig;

  @Prop()
  someTestField: string;

  toModel(user?: User): ContentModel<IContent<any, any>, any> {
    throw new Error('Method not implemented.');
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

const TestNumberTimeSeriesConfigSchema = TimeSeriesConfigSchemaFactory.createForClass(
  TestTimeSeriesConfig,
  [
    DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
    DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Spinner),
  ],
);

@Schema()
export class TestNumberTimeSeriesContent extends NumberTimeSeriesContent<TestNumberTimeSeriesContent> {
  @Prop()
  someTestField: string;

  @Prop({ type: TestNumberTimeSeriesConfigSchema, required: true })
  config: TestNumberTimeSeriesConfig;

  toModel(user?: User): ContentModel<IContent<any, any>, any> {
    throw new Error('Method not implemented.');
  }
}

export type TestNumberTimeSeriesContentDocument = TestNumberTimeSeriesContent & mongoose.Document;
export const TestNumberTimeSeriesContentSchema = SchemaFactory.createForClass(
  TestNumberTimeSeriesContent,
);
