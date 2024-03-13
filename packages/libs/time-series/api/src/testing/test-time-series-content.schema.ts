import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CheckboxNumberDataPointConfig,
  TimeSeriesContent,
  TimeSeriesConfigSchemaFactory,
  DataPointConfigSchema,
  DataPointConfigFactory,
  TextareaTextDataPointConfig,
  TimerDataPointConfig,
} from '../';
import { NestedSchema, ContentModel } from '@lyvely/api';
import {
  DataPointInputType,
  ITimeSeriesContentConfig,
  DataPointValueType,
} from '@lyvely/time-series-interface';

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
export class TestTimeSeriesContent extends TimeSeriesContent {
  @Prop({ type: TestTimeSeriesConfigSchema })
  override config: TestTimeSeriesConfig;

  @Prop()
  someTestField: string;

  toModel(): ContentModel<string> {
    throw new Error('Method not implemented.');
  }
}

export const TestTimeSeriesContentSchema = SchemaFactory.createForClass(TestTimeSeriesContent);
